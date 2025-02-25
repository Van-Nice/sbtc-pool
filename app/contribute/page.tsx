"use client"

import React, { useState } from 'react';
import { QrCode, Copy, Wallet, ArrowRight, Check, Loader2, Clock } from 'lucide-react';

export default function ContributePage() {
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const bridgingAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

  const handleCopy = () => {
    navigator.clipboard.writeText(bridgingAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate transaction processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Contribute Bitcoin
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-200 p-4 rounded-lg">
                <QrCode size={200} />
              </div>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="text"
                value={bridgingAddress}
                readOnly
                className="flex-grow p-2 border rounded-l-md text-sm"
              />
              <button
                onClick={handleCopy}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition duration-300 flex items-center"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Contribute</h2>
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
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
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
                {isSubmitting ? 'Processing...' : isConfirmed ? 'Contribution Sent!' : 'Send Contribution'}
              </button>
            </form>

            {isConfirmed && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                <p className="font-bold">Transaction Submitted!</p>
                <p>Your contribution has been successfully sent to the bridging address.</p>
              </div>
            )}

            <div className="text-center">
              <a href="/history" className="text-blue-500 hover:text-blue-600 flex items-center justify-center">
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