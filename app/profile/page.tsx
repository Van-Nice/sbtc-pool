"use client";

import React, { useState } from "react";
import { Copy, LogOut, RefreshCw, Check } from "lucide-react";

// Mock data for demonstration
const MOCK_DATA = {
  btcAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  stacksAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  btcBalance: 1.23456789,
  stxBalance: 100.5,
  sBTCBalance: 0.5,
  email: "demo@example.com",
  totalContributions: 2.5,
  sBTCShare: 1.5,
};

// Mock bridging state for demonstration
type BridgingState = {
  status: "idle" | "pending" | "confirming" | "completed" | "failed";
  txId?: string;
  confirmations?: number;
  error?: string;
};

export default function UserProfilePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [copiedField, setCopiedField] = useState<"btc" | "stacks" | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [bridgingState, setBridgingState] = useState<BridgingState>({
    status: "idle",
  });

  // Mock file upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate loading
    setTimeout(() => {
      setIsConnected(true);
      setFileError(null);
    }, 1000);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setFileError(null);
  };

  const switchWallet = () => {
    disconnectWallet();
    document.getElementById("toml-upload")?.click();
  };

  const copyToClipboard = (text: string, field: "btc" | "stacks") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Mock bridging interface component
  const BridgingInterface = () => {
    const [depositAmount, setDepositAmount] = useState<string>("");

    const handleDeposit = async () => {
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount < 0.01) {
        setFileError("Minimum deposit amount is 0.01 BTC");
        return;
      }

      setBridgingState({ status: "pending" });

      // Simulate transaction processing
      setTimeout(() => {
        setBridgingState({
          status: "confirming",
          txId: "0x" + Math.random().toString(16).slice(2),
          confirmations: 0,
        });

        // Simulate confirmations
        let confirmations = 0;
        const interval = setInterval(() => {
          confirmations++;
          setBridgingState((prev) => ({
            ...prev,
            confirmations,
            status: confirmations >= 6 ? "completed" : "confirming",
          }));

          if (confirmations >= 6) {
            clearInterval(interval);
          }
        }, 2000);
      }, 2000);
    };

    return (
      <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Bridge BTC to sBTC (Demo)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deposit Amount (BTC)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min={0.01}
                step="0.001"
                placeholder="Enter amount in BTC"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={bridgingState.status !== "idle"}
              />
            </div>

            <button
              onClick={handleDeposit}
              disabled={bridgingState.status !== "idle"}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {bridgingState.status === "idle"
                ? "Initiate Deposit"
                : bridgingState.status === "pending"
                ? "Processing..."
                : bridgingState.status === "confirming"
                ? `Confirming (${bridgingState.confirmations}/6)`
                : bridgingState.status === "completed"
                ? "Completed"
                : "Failed"}
            </button>

            {bridgingState.status !== "idle" && (
              <div className="mt-4">
                {bridgingState.txId && (
                  <div className="text-sm text-gray-600">
                    Transaction ID: {bridgingState.txId}
                  </div>
                )}
                {bridgingState.status === "completed" && (
                  <div className="text-sm text-green-600">
                    Successfully bridged {depositAmount} BTC to sBTC! (Demo)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          sBTC Bridge Demo
        </h1>

        {!isConnected ? (
          <div className="text-center">
            <label
              htmlFor="toml-upload"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 cursor-pointer inline-block"
            >
              Connect Wallet (Demo)
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
          <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Connected Wallet (Demo)
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      BTC Address:
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2 font-mono">
                        {MOCK_DATA.btcAddress}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(MOCK_DATA.btcAddress, "btc")
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
                      <span className="text-sm text-gray-900 mr-2 font-mono">
                        {MOCK_DATA.stacksAddress}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(MOCK_DATA.stacksAddress, "stacks")
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

            <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Wallet Balances (Demo)
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      BTC Balance:
                    </span>
                    <span className="text-sm text-gray-900">
                      {MOCK_DATA.btcBalance.toFixed(8)} BTC
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      STX Balance:
                    </span>
                    <span className="text-sm text-gray-900">
                      {MOCK_DATA.stxBalance.toFixed(2)} STX
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      sBTC Balance:
                    </span>
                    <span className="text-sm text-gray-900">
                      {MOCK_DATA.sBTCBalance.toFixed(8)} sBTC
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <BridgingInterface />
          </>
        )}
      </div>
    </div>
  );
}
