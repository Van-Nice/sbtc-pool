"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

type Section = 'how-it-works' | 'faq' | 'resources' | 'glossary';

const faqs = [
  {
    question: "How do I contribute?",
    answer: "To contribute, connect your Leather wallet, navigate to the Contribution page, and follow the instructions to send Bitcoin to the bridging address."
  },
  {
    question: "What is sBTC?",
    answer: "sBTC (Stacks Bitcoin) is a representation of Bitcoin on the Stacks blockchain, allowing for Bitcoin to be used in smart contracts and decentralized applications on Stacks."
  },
  {
    question: "How long does the bridging process take?",
    answer: "The bridging process typically takes about 30-60 minutes, depending on network conditions and the amount being bridged."
  },
  {
    question: "Is there a minimum contribution amount?",
    answer: "While there's no strict minimum, we recommend contributing at least 0.001 BTC to ensure the transaction fees don't outweigh your contribution."
  }
];

const glossaryTerms = [
  {
    term: "Bridging",
    definition: "The process of transferring assets from one blockchain to another, in this case, from Bitcoin to Stacks."
  },
  {
    term: "Devnet",
    definition: "A development network used for testing blockchain applications before deploying to the main network."
  },
  {
    term: "Leather Wallet",
    definition: "A cryptocurrency wallet that supports both Bitcoin and Stacks, allowing users to manage their assets and interact with decentralized applications."
  },
  {
    term: "sBTC",
    definition: "A 1:1 Bitcoin-backed asset on the Stacks blockchain, enabling Bitcoin to be used in Stacks smart contracts."
  }
];

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<Section>('how-it-works');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const renderSection = () => {
    switch (activeSection) {
      case 'how-it-works':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <p className="mb-4">
              Our application bridges small Bitcoin amounts into sBTC on the Stacks network. Here&apos;s how it works:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li>Connect your Leather wallet to the app.</li>
              <li>Contribute Bitcoin to the bridging address.</li>
              <li>Once the total contributions reach 0.01 BTC, the bridging process begins.</li>
              <li>The Bitcoin is converted to sBTC on the Stacks network.</li>
              <li>sBTC is distributed to contributors proportional to their input.</li>
            </ol>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Note: This process currently operates on the devnet for testing purposes.
              </p>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-md">
                  <button
                    className="w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {expandedFaq === index ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 py-2 bg-gray-50">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'resources':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Resources</h2>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="flex items-center text-blue-500 hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={18} className="mr-2" />
                  Official Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-blue-500 hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={18} className="mr-2" />
                  Video Tutorial: Getting Started with sBTC
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-blue-500 hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={18} className="mr-2" />
                  Join our Discord Community
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@example.com"
                  className="flex items-center text-blue-500 hover:text-blue-600"
                >
                  <ExternalLink size={18} className="mr-2" />
                  Email Support
                </a>
              </li>
            </ul>
          </div>
        );
      case 'glossary':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Glossary</h2>
            <dl className="space-y-4">
              {glossaryTerms.map((item, index) => (
                <div key={index}>
                  <dt className="font-medium text-lg">{item.term}</dt>
                  <dd className="mt-1 text-gray-600">{item.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          About / Help
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <nav className="md:w-64 bg-gray-50 p-6">
              <ul className="space-y-2">
                {(['how-it-works', 'faq', 'resources', 'glossary'] as Section[]).map((section) => (
                  <li key={section}>
                    <button
                      onClick={() => setActiveSection(section)}
                      className={`w-full text-left px-4 py-2 rounded-md ${
                        activeSection === section
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex-1 p-6">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}