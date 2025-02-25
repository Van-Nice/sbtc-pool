"use client"

import React, { useState } from 'react';
import { Check, AlertCircle, HelpCircle } from 'lucide-react';

type ClaimStatus = 'unclaimed' | 'pending' | 'completed';

export default function SBTCDistributionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>('unclaimed');
  const [showTooltip, setShowTooltip] = useState(false);

  // Simulated user data
  const userContribution = 0.003;
  const sBTCShare = 0.003;
  const isSBTCAvailable = true; // This would be determined by the actual state of the bridging process

  const handleClaimClick = () => {
    setIsModalOpen(true);
  };

  const confirmClaim = () => {
    setIsModalOpen(false);
    setClaimStatus('pending');
    // Simulate claim process
    setTimeout(() => {
      setClaimStatus('completed');
    }, 3000);
  };

  const renderClaimButton = () => {
    if (!isSBTCAvailable) {
      return (
        <div className="relative">
          <button
            className="w-full bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            Claim sBTC
          </button>
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
              sBTC is not yet available for claiming
            </div>
          )}
        </div>
      );
    }

    switch (claimStatus) {
      case 'unclaimed':
        return (
          <button
            onClick={handleClaimClick}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Claim sBTC
          </button>
        );
      case 'pending':
        return (
          <button className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed flex items-center justify-center">
            <AlertCircle className="animate-spin mr-2" />
            Claiming...
          </button>
        );
      case 'completed':
        return (
          <button className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed flex items-center justify-center">
            <Check className="mr-2" />
            Claimed
          </button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          sBTC Distribution
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your sBTC Share</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
              <p className="font-medium">You contributed {userContribution} BTC</p>
              <p className="mt-1">Entitling you to {sBTCShare} sBTC</p>
            </div>

            {renderClaimButton()}

            {claimStatus === 'completed' && (
              <div className="mt-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-4">
                <p className="font-medium">Claim Successful!</p>
                <p className="mt-1">Your sBTC has been sent to your Stacks address.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About sBTC Distribution</h2>
            <p className="text-gray-600 mb-4">
              sBTC is distributed proportionally to your Bitcoin contributions. Once the bridging process is complete,
              you can claim your sBTC share, which will be sent to your connected Stacks address.
            </p>
            <div className="flex items-start">
              <HelpCircle className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-500">
                If you encounter any issues with claiming your sBTC, please contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm sBTC Claim</h3>
            <p className="mb-6">Are you sure you want to claim {sBTCShare} sBTC to your Stacks address?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmClaim}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}