"use client";

import React, { useState } from "react";
import { Copy, LogOut, RefreshCw, Check } from "lucide-react";
import toml from "@iarna/toml";
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import * as bitcoin from "bitcoinjs-lib";
import {
  getAddressFromPrivateKey,
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
} from "@stacks/transactions";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { STACKS_TESTNET } from "@stacks/network";
// Add StacksNetwork import
import { StacksMainnet, StacksMocknet } from "@stacks/network";

// Use tiny-secp256k1 for browser compatibility
import * as tinySecp from "@bitcoin-js/tiny-secp256k1-asmjs";
bitcoin.initEccLib(tinySecp);
const BIP32Factory = bip32.default(tinySecp);

// Define TOML structure
interface TomlAccount {
  account: {
    mnemonic: string;
    email?: string;
    contributions?: {
      total: number;
      sbtc_share: number;
    };
  };
}

// Network configurations
const btcNetwork = bitcoin.networks.regtest; // Devnet uses regtest

type WalletInfo = {
  btcAddress: string;
  stacksAddress: string;
  btcBalance?: number;
  stxBalance?: number;
};

type UserInfo = {
  email: string;
  totalContributions: number;
  sBTCShare: number;
};

export default function UserProfilePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [copiedField, setCopiedField] = useState<"btc" | "stacks" | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch BTC balance from local devnet
  const fetchBTCBalance = async (address: string) => {
    try {
      // Using Bitcoin Core RPC API with devnet credentials
      const response = await fetch("/api/btc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Default devnet credentials (base64 encoded devnet:devnet)
          Authorization: "Basic ZGV2bmV0OmRldm5ldA==",
        },
        body: JSON.stringify({
          jsonrpc: "1.0",
          id: "btc-balance",
          method: "getbalance",
          params: [],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Bitcoin RPC response:", errorText);
        throw new Error(`Bitcoin RPC error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (data.error) {
        console.error("Bitcoin RPC error response:", data.error);
        throw new Error(`Bitcoin RPC error: ${data.error.message}`);
      }

      // Result is in BTC
      return data.result || 0;
    } catch (error) {
      console.error("Error fetching BTC balance:", error);
      // Show more detailed error to user
      setFileError(
        `BTC Balance Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Make sure your Bitcoin Core devnet is running on port 18443.`
      );
      return 0;
    }
  };

  // Function to fetch STX balance from local devnet
  const fetchSTXBalance = async (address: string) => {
    try {
      // Using Stacks node API directly
      const response = await fetch(`/api/stx/v2/accounts/${address}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Convert hex balance to number
      const balanceHex = data.balance.replace("0x", "");
      const balanceInt =
        balanceHex === "0".repeat(32) ? 0 : parseInt(balanceHex, 16);

      return balanceInt / 1000000; // Convert microSTX to STX
    } catch (error) {
      console.error("Error fetching STX balance:", error);
      setFileError(
        `STX Balance Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return 0;
    }
  };

  // Function to request STX from faucet
  const requestFromFaucet = async (address: string) => {
    try {
      const seed = await bip39.mnemonicToSeed(
        "shadow private easily thought say logic fault paddle word top book during ignore notable orange flight clock image wealth health outside kitten belt reform"
      );
      const root = BIP32Factory.fromSeed(seed, btcNetwork);
      const stxChild = root.derivePath("m/44'/5757'/0'/0/0");
      if (!stxChild.privateKey) {
        throw new Error("Failed to derive faucet private key");
      }

      const faucetPrivateKey = Buffer.from(stxChild.privateKey).toString("hex");

      // Create network instance for devnet
      const network = new StacksMocknet();
      network.coreApiUrl = "http://localhost:3999"; // Point to local devnet

      // Create a STX transfer transaction
      const transaction = await makeSTXTokenTransfer({
        recipient: address,
        amount: 100_000_000_000, // 100 STX
        senderKey: faucetPrivateKey,
        network,
        memo: "Faucet drip",
        nonce: 0, // Start with nonce 0 for new accounts
        fee: 10000, // 0.01 STX
        anchorMode: AnchorMode.Any,
      });

      // Broadcast the transaction
      const broadcastResponse = await broadcastTransaction(transaction);
      console.log("Faucet transfer broadcast:", broadcastResponse);

      if ("error" in broadcastResponse) {
        throw new Error(
          `Failed to broadcast transaction: ${broadcastResponse.error}`
        );
      }

      // Wait a few seconds and refresh the balance
      setTimeout(async () => {
        if (walletInfo) {
          const newBalance = await fetchSTXBalance(walletInfo.stacksAddress);
          setWalletInfo({
            ...walletInfo,
            stxBalance: newBalance,
          });
        }
      }, 3000);

      return broadcastResponse;
    } catch (error) {
      console.error("Error requesting from faucet:", error);
      setFileError(
        error instanceof Error ? error.message : "Failed to request from faucet"
      );
    }
  };

  // Add a button to request STX in the UI
  const FaucetButton = () => (
    <button
      onClick={() => walletInfo && requestFromFaucet(walletInfo.stacksAddress)}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      Request STX from Faucet
    </button>
  );

  // Handle file upload and sign-in
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = toml.parse(content);
        const typedParsed = parsed as unknown as TomlAccount;

        // Extract mnemonic from TOML
        const mnemonic = typedParsed.account.mnemonic;
        if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
          throw new Error("Invalid or missing mnemonic in TOML file");
        }

        // Derive seed
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const root = BIP32Factory.fromSeed(seed, btcNetwork);

        // Derive Bitcoin address (m/44'/0'/0'/0/0 for regtest)
        const btcChild = root.derivePath("m/44'/0'/0'/0/0");
        const btcAddress = bitcoin.payments.p2pkh({
          pubkey: Buffer.from(btcChild.publicKey),
          network: btcNetwork,
        }).address!;

        // Derive Stacks address (m/44'/5757'/0'/0/0)
        const stxChild = root.derivePath("m/44'/5757'/0'/0/0");
        if (!stxChild.privateKey) {
          throw new Error("Failed to derive private key");
        }
        const stxPrivateKey = Buffer.from(stxChild.privateKey).toString("hex");
        const stacksAddress = getAddressFromPrivateKey(
          stxPrivateKey,
          "testnet"
        );

        // After deriving addresses, fetch balances
        const btcBalance = await fetchBTCBalance(btcAddress);
        const stxBalance = await fetchSTXBalance(stacksAddress);

        // Set wallet info with balances
        setWalletInfo({
          btcAddress,
          stacksAddress,
          btcBalance,
          stxBalance,
        });

        // Set user info from TOML file
        setUserInfo({
          email: typedParsed.account.email || "user@example.com",
          totalContributions: typedParsed.account.contributions?.total || 0,
          sBTCShare: typedParsed.account.contributions?.sbtc_share || 0,
        });

        setIsConnected(true);
        setFileError(null);
        setIsLoading(false);
      } catch (error) {
        setFileError(
          error instanceof Error ? error.message : "Failed to process TOML file"
        );
        setIsConnected(false);
        setWalletInfo(null);
        setUserInfo(null);
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletInfo(null);
    setUserInfo(null);
    setFileError(null);
  };

  const switchWallet = () => {
    // Reset state and trigger file upload again
    disconnectWallet();
    document.getElementById("toml-upload")?.click();
  };

  const copyToClipboard = (text: string, field: "btc" | "stacks") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Settings updated!");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          User Profile
        </h1>

        {!isConnected ? (
          <div className="text-center">
            <label
              htmlFor="toml-upload"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 cursor-pointer inline-block"
            >
              Upload Wallet File (.toml)
            </label>
            <input
              id="toml-upload"
              type="file"
              accept=".toml"
              onChange={handleFileUpload}
              className="hidden"
            />
            {fileError && (
              <p className="mt-2 text-sm text-red-600">{fileError}</p>
            )}
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Connected Wallet
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    BTC Address:
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-2 truncate max-w-[200px]">
                      {walletInfo?.btcAddress}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(walletInfo?.btcAddress || "", "btc")
                      }
                      className="text-blue-500 hover:text-blue-600"
                    >
                      {copiedField === "btc" ? (
                        <Check size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Stacks Address:
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-2 truncate max-w-[200px]">
                      {walletInfo?.stacksAddress}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          walletInfo?.stacksAddress || "",
                          "stacks"
                        )
                      }
                      className="text-blue-500 hover:text-blue-600"
                    >
                      {copiedField === "stacks" ? (
                        <Check size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={switchWallet}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-600"
                >
                  <RefreshCw size={16} className="mr-1" />
                  Switch Wallet
                </button>
                <button
                  onClick={disconnectWallet}
                  className="flex items-center text-sm text-red-500 hover:text-red-600"
                >
                  <LogOut size={16} className="mr-1" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}

        {isConnected && walletInfo && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Wallet Balances
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    BTC Balance:
                  </span>
                  <span className="text-sm text-gray-900">
                    {isLoading
                      ? "Loading..."
                      : `${walletInfo.btcBalance?.toFixed(8) || "0"} BTC`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    STX Balance:
                  </span>
                  <span className="text-sm text-gray-900">
                    {isLoading
                      ? "Loading..."
                      : `${walletInfo.stxBalance?.toFixed(2) || "0"} STX`}
                  </span>
                </div>
                <FaucetButton />
              </div>
            </div>
          </div>
        )}

        {isConnected && userInfo && (
          <>
            <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Account Settings
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email for Notifications
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue={userInfo.email}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Update Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Contributions
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Total Contributions:{" "}
                    <span className="font-medium text-gray-900">
                      {userInfo.totalContributions} BTC
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    sBTC Share:{" "}
                    <span className="font-medium text-gray-900">
                      {userInfo.sBTCShare} sBTC
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
