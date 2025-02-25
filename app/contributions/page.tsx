"use client"

import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink, Search } from 'lucide-react';

type Contribution = {
  id: string;
  amount: number;
  timestamp: string;
};

const mockContributions: Contribution[] = Array.from({ length: 50 }, (_, i) => ({
  id: `txid_${i + 1}`.padStart(64, '0'),
  amount: Number((Math.random() * 0.01).toFixed(8)),
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
}));

export default function ContributionHistoryPage() {
  const [sortColumn, setSortColumn] = useState<keyof Contribution>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const sortedAndFilteredContributions = useMemo(() => {
    return mockContributions
      .filter(contribution =>
        contribution.id.includes(searchTerm) ||
        contribution.amount.toString().includes(searchTerm) ||
        contribution.timestamp.includes(searchTerm)
      )
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [sortColumn, sortDirection, searchTerm]);

  const paginatedContributions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredContributions.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, sortedAndFilteredContributions]);

  const totalPages = Math.ceil(sortedAndFilteredContributions.length / itemsPerPage);

  const handleSort = (column: keyof Contribution) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Contribution History
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search contributions..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {(['id', 'amount', 'timestamp'] as const).map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center">
                          {column === 'id' ? 'Transaction ID' : column.charAt(0).toUpperCase() + column.slice(1)}
                          <ArrowUpDown size={14} className="ml-1" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedContributions.map((contribution, index) => (
                    <tr key={contribution.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
                        <a href={`https://mempool.space/testnet/tx/${contribution.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          {`${contribution.id.slice(0, 8)}...${contribution.id.slice(-8)}`}
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contribution.amount.toFixed(8)} BTC
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(contribution.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="mr-2 px-2 py-1 border rounded-md disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-2 px-2 py-1 border rounded-md disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="text-sm text-gray-700">
                Showing {paginatedContributions.length} of {sortedAndFilteredContributions.length} contributions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}