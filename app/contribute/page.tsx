"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  QrCode,
  Copy,
  Wallet,
  ArrowRight,
  Check,
  Loader2,
  Clock,
} from "lucide-react";
import { useWallet } from "../contexts/WalletContext";

// Mock data for demonstration
const MOCK_POOL_STATUS = {
  totalAmount: 12.5,
  status: "Active",
  contributions: [
    { address: "bc1q...xyz1", amount: 5.0, timestamp: Date.now() - 86400000 },
    { address: "bc1q...xyz2", amount: 7.5, timestamp: Date.now() - 43200000 },
  ],
};

const DEMO_BRIDGE_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

interface PoolStatus {
  totalAmount: number;
  status: string;
  contributions: Array<{
    address: string;
    amount: number;
    timestamp: number;
  }>;
}

export default function ContributePage() {
  const { walletInfo, isConnected } = useWallet();
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [poolStatus, setPoolStatus] = useState<PoolStatus>(MOCK_POOL_STATUS);

  // Simulate contract deployment check
  useEffect(() => {
    if (!isConnected) {
      console.log("No wallet connected");
      return;
    }

    // Simulate successful contract deployment
    console.log("Contracts verified successfully");
  }, [isConnected]);

  // Simulate pool status updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setPoolStatus((prevStatus) => ({
        ...prevStatus,
        totalAmount: Number(
          (prevStatus.totalAmount + Math.random() * 0.01).toFixed(8)
        ),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !walletInfo) {
      alert("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);

    // Simulate transaction processing
    setTimeout(() => {
      // Add the new contribution to the pool
      const newContribution = {
        address: walletInfo.address,
        amount: parseFloat(amount),
        timestamp: Date.now(),
      };

      setPoolStatus((prevStatus) => ({
        ...prevStatus,
        totalAmount: prevStatus.totalAmount + parseFloat(amount),
        contributions: [...prevStatus.contributions, newContribution],
      }));

      setIsConfirmed(true);
      setIsSubmitting(false);
      setAmount("");

      // Reset confirmation after 5 seconds
      setTimeout(() => {
        setIsConfirmed(false);
      }, 5000);
    }, 2000); // Simulate 2-second transaction time
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(DEMO_BRIDGE_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate QR code data URL for the bridge address
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${DEMO_BRIDGE_ADDRESS}`;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {!isConnected && (
        <div className="max-w-3xl mx-auto mb-8">
          <div
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
            role="alert"
          >
            <p className="font-bold">Wallet Not Connected</p>
            <p>Please connect your wallet to contribute to the pool.</p>
          </div>
        </div>
      )}

      {poolStatus && (
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
            <p className="font-bold">Pool Status</p>
            <p>Total Amount: {poolStatus.totalAmount.toFixed(8)} BTC</p>
            <p>Status: {poolStatus.status}</p>
            <p>Contributors: {poolStatus.contributions.length}</p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Contribute Bitcoin
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-200 p-4 rounded-lg">
                <Image
                  src={qrCodeUrl}
                  alt="Bridge Address QR Code"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="text"
                value={DEMO_BRIDGE_ADDRESS}
                readOnly
                className="flex-grow p-2 border rounded-l-md text-sm font-mono"
                aria-label="Bridge Address"
                title="Bitcoin Bridge Address"
              />
              <button
                onClick={handleCopy}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition duration-300 flex items-center"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How to Contribute
            </h2>
            <ol className="list-decimal list-inside space-y-4 mb-6">
              <li className="flex items-center">
                <Wallet className="mr-2 text-blue-500" />
                Open your Leather wallet or other compatible wallet
              </li>
              <li className="flex items-center">
                <QrCode className="mr-2 text-blue-500" />
                Scan the QR code above or copy the bridging address
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 text-blue-500" />
                Enter the amount you wish to contribute
              </li>
              <li className="flex items-center">
                <Check className="mr-2 text-blue-500" />
                Confirm and send the transaction
              </li>
            </ol>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contribution Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount in BTC"
                  className="w-full p-2 border rounded-md"
                  step="0.00000001"
                  min="0"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                disabled={isSubmitting || isConfirmed}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : isConfirmed ? (
                  <Check className="mr-2" />
                ) : null}
                {isSubmitting
                  ? "Processing..."
                  : isConfirmed
                  ? "Contribution Sent!"
                  : "Send Contribution"}
              </button>
            </form>

            {isConfirmed && (
              <div
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
                role="alert"
              >
                <p className="font-bold">Transaction Submitted!</p>
                <p>
                  Your contribution has been successfully sent to the bridging
                  address.
                </p>
              </div>
            )}

            <div className="text-center">
              <a
                href="/history"
                className="text-blue-500 hover:text-blue-600 flex items-center justify-center"
              >
                <Clock className="mr-2" />
                View Contribution History
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
