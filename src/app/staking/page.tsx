"use client";

import React, { useState } from 'react';

const Staking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');
  const [amount, setAmount] = useState<string>('0.00');
  const balance = 10000;

  const calculateReceive = (value: string): string => {
    const num = parseFloat(value) || 0;
    return num.toFixed(2);
  };

  const handleMaxClick = () => {
    setAmount(balance.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="min-h-screen main-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <img src="/images/logo.svg"/>
        </div>
        <button className="bg-emerald-400 hover:bg-emerald-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors">
          Connect Wallet
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
          <span className="text-teal-400">Stake</span>{' '}
          <span className="text-white">$Fortune Token</span>
        </h1>
        <p className="text-gray-400 text-lg mb-12 text-center">
          Stack fortune and get your prediction asper horosccope!
        </p>

        {/* Staking Card */}
        <div className="w-full max-w-md bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
          {/* Tab Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab('stake')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'stake'
                  ? 'bg-emerald-400 text-gray-900'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
              }`}
            >
              Stake
            </button>
            <button
              onClick={() => setActiveTab('unstake')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'unstake'
                  ? 'bg-emerald-400 text-gray-900'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
              }`}
            >
              Unstake
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-400 text-sm">Amount to stake</label>
              <span className="text-gray-400 text-sm">
                Balance: <span className="text-white">{balance}</span>
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-4 text-white text-lg focus:outline-none focus:border-emerald-400 transition-colors"
                placeholder="0.00"
              />
              <button
                onClick={handleMaxClick}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 font-semibold text-sm hover:text-emerald-300 transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Receive Amount */}
          <div className="bg-gray-800 bg-opacity-50 rounded-lg px-4 py-3 mb-6 flex justify-between items-center">
            <span className="text-gray-400">You will receive</span>
            <span className="text-white font-semibold">
              {calculateReceive(amount)} Fortune
            </span>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Your Share</span>
              <span className="text-white">2510.x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">APR%</span>
              <span className="text-white">0.58%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Reading Points</span>
              <span className="text-white">281</span>
            </div>
          </div>

          {/* Stake Button */}
          <button className="w-full bg-emerald-400 hover:bg-emerald-500 text-gray-900 font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
              <path d="M9 12h6m-3-3v6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Stake Tokens
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 px-8 py-6 flex justify-between items-center">
        <div className="flex gap-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Gitbook
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Github
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Tutorials
          </a>
        </div>
        <div className="flex gap-4">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <p className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <p className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <p className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <p className="w-5 h-5" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Staking;