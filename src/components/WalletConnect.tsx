"use client";

import { useEffect, useRef, useState } from "react";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";

const WalletConnect = () => {
  const { isConnecting, address, isConnected, chain } = useAccount();
  const { chains, switchChain } = useSwitchChain();
  const [switchError, setSwitchError] = useState<string | null>(null);

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { disconnect } = useDisconnect();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  const handleSwitchChain = async (chainId: number) => {
    try {
      setSwitchError(null);
      switchChain({ chainId });
    } catch (error: any) {
      console.error("Chain switch error:", error);
      setSwitchError(error?.message || "Failed to switch network");
    }
  };

  if (!isConnected) {
    return (
      <button
        className="bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
        onClick={async () => {
          if (isConnected) {
            disconnect();
          }
          openConnectModal?.();
        }}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  if (isConnected && !chain) {
    return (
      <button 
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
        onClick={openChainModal}
      >
        Wrong Network
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {switchError && (
        <div className="w-full px-4 py-2 bg-red-900/50 border border-red-600 rounded-lg text-red-200 text-sm">
          {switchError}
        </div>
      )}
      
      <div
        className="flex justify-center items-center px-4 py-2 border border-gray-600 bg-gray-800 hover:bg-gray-750 rounded-lg font-mono gap-x-2 cursor-pointer transition-colors duration-200"
        onClick={() => openAccountModal?.()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            openAccountModal?.();
          }
        }}
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {address ? address.slice(2, 4).toUpperCase() : '??'}
        </div>
        <div className="flex flex-col items-start">
          <p className="text-xs text-gray-400">Connected</p>
          <p className="text-sm font-semibold text-white">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Account'}
          </p>
        </div>
      </div>
      
      <button 
        className="px-4 py-2 border border-gray-600 bg-gray-800 hover:bg-gray-750 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
        onClick={openChainModal}
      >
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
        {chain?.name || 'Switch Network'}
      </button>

      <button
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
};


// import { ConnectButton } from '@rainbow-me/rainbowkit';

// const WalletConnect = () => {
//   return <ConnectButton />;
// };
export default WalletConnect;


