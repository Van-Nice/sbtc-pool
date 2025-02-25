"use client";

import React, { useState, useEffect } from "react";
import { Bitcoin, ArrowRight, Clock, RefreshCw } from "lucide-react";

type Contribution = {
  amount: number;
  time: string;
};

export default function Home() {
  const [currentTotal, setCurrentTotal] = useState(0.0075);
  const recentContributions = useState<Contribution[]>([])[0];

  const threshold = 0.01;
  const progress = (currentTotal / threshold) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTotal((prevTotal) => {
        const newTotal = prevTotal + 0.0001;
        return newTotal > threshold ? threshold : newTotal;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Bitcoin Bridging Dashboard
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-semibold text-gray-700">
                Current Total:
              </span>
              <div className="flex items-center">
                <Bitcoin className="text-orange-500 mr-2" />
                <span className="text-2xl font-bold text-orange-500">
                  {currentTotal.toFixed(4)} BTC
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Progress to Bridging Goal
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {progress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
              Contribute Bitcoin
              <ArrowRight className="ml-2" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Contribution History
            </h2>
            <ArrowRight className="text-orange-500" />
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Bridging Status
            </h2>
            <ArrowRight className="text-orange-500" />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Contributions
            </h2>
            <ul className="divide-y divide-gray-200">
              {recentContributions.map((contribution, index) => (
                <li
                  key={index}
                  className="py-3 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Bitcoin className="text-orange-500 mr-2" />
                    <span className="font-medium">
                      {contribution.amount.toFixed(4)} BTC
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1" size={16} />
                    {contribution.time}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center">
          <RefreshCw className="mr-2" size={16} />
          Data updates in real-time
        </div>
      </div>
    </div>
  );
}
