import React, { createContext, useContext } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

const SolanaWalletContext = createContext(null);

export function SolanaWalletContextProvider({ children }: any) {
  const wallet = useWallet();
  const { connection } = useConnection();

  const solanaWallet: any = {
    // Wallet type
    walletType: 'solana',
    
    // Connection status
    connected: wallet.connected,
    
    // Address
    address: wallet.publicKey?.toString(),
    
    // Solana-specific
    wallet,
    connection,
    publicKey: wallet.publicKey,
    disconnect: wallet.disconnect,
    signTransaction: wallet.signTransaction,
    signMessage: wallet.signMessage,
    
    // Helper to get network name
    getNetworkName: () => {
      return 'solana-devnet';
    },
  };

  return (
    <SolanaWalletContext.Provider value={solanaWallet}>
      {children}
    </SolanaWalletContext.Provider>
  );
}

/**
 * Hook to use the Solana wallet context
 */
export function useSolanaWallet() {
  const context = useContext(SolanaWalletContext);
  if (!context) {
    throw new Error('useSolanaWallet must be used within SolanaWalletContextProvider');
  }
  return context;
}