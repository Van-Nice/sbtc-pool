"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

type BridgingStatus = 'accumulating' | 'in-progress' | 'complete';

type BridgingEvent = {
  id: string;
  date: string;
  bitcoinAmount: number;
  sBTCAmount: number;
  stacksAddress: string;
};

const mockCurrentStatus: {
  status: BridgingStatus;
  currentTotal?: number;
  txId?: string;
  estimatedTime?: string;
  sBTCAmount?: number;
  stacksAddress?: string;
} = {
  status: 'in-progress',
  currentTotal: 0.015,
  txId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  estimatedTime: '30 minutes',
};

const mockBridgingHistory: BridgingEvent[] = [
  {
    id: '1',
    date: '2023-10-15T14:30:00Z',
    bitcoinAmount: 0.01,
    sBTCAmount: 0.01,
    stacksAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
  {
    id: '2',
    date: '2023-10-10T09:15:00Z',
    bitcoinAmount: 0.015,
    sBTCAmount: 0.015,
    stacksAddress: 'ST2CZJ4UX4JFXQKRP2SR5RKWQ9XN5VNSKZTZDC7AE',
  },
  {
    id: '3',
    date: '2023-10-05T18:45:00Z',
    bitcoinAmount: 0.02,
    sBTCAmount: 0.02,
    stacksAddress: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
  },
];

export default function BridgingStatusPage() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const renderStatusBadge = (status: BridgingStatus) => {
    switch (status) {
      case 'accumulating':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Accumulating</span>;
      case 'in-progress':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">In Progress</span>;
      case 'complete':
        return <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Complete</span>;
    }
  };

  const renderCurrentStatus = () => {
    switch (mockCurrentStatus.status) {
      case 'accumulating':
        return (
          <div className="flex items-center">
            <Clock className="mr-2 text-blue-500" />
            <span>Accumulating Contributions: {mockCurrentStatus.currentTotal} BTC</span>
          </div>
        );
      case 'in-progress':
        return (
          <div>
            <div className="flex items-center mb-2">
              <AlertTriangle className="mr-2 text-yellow-500" />
              <span>Bridging in Progress</span>
            </div>
            <div className="text-sm">
              <p>Transaction ID: {mockCurrentStatus.txId}</p>
              <p>Estimated Time: {mockCurrentStatus.estimatedTime}</p>
            </div>
          </div>
        );
      case 'complete':
        return (
          <div>
            <div className="flex items-center mb-2">
              <CheckCircle className="mr-2 text-green-500" />
              <span>Bridging Complete</span>
            </div>
            <div className="text-sm">
              <p>sBTC Minted: {mockCurrentStatus.sBTCAmount} sBTC</p>
              <p>Stacks Address: {mockCurrentStatus.stacksAddress}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Bridging Status
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Status</h2>
            <div className="flex items-center mb-4">
              {renderStatusBadge(mockCurrentStatus.status)}
              <span className="text-lg font-medium">{mockCurrentStatus.status.charAt(0).toUpperCase() + mockCurrentStatus.status.slice(1)}</span>
            </div>
            {renderCurrentStatus()}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bridging History</h2>
            <div className="space-y-4">
              {mockBridgingHistory.map((event) => (
                <div key={event.id} className="border rounded-md">
                  <button
                    className="w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  >
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.bitcoinAmount} BTC</span>
                    {expandedEvent === event.id ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {expandedEvent === event.id && (
                    <div className="px-4 py-2 bg-gray-50">
                      <p>Date: {new Date(event.date).toLocaleString()}</p>
                      <p>Bitcoin Bridged: {event.bitcoinAmount} BTC</p>
                      <p>sBTC Minted: {event.sBTCAmount} sBTC</p>
                      <p>
                        Stacks Address:{' '}
                        <a
                          href={`https://explorer.stacks.co/address/${event.stacksAddress}?chain=mainnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 underline flex items-center"
                        >
                          {event.stacksAddress}
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}