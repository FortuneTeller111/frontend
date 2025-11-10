import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import Solana wallet styles
import '@solana/wallet-adapter-react-ui/styles.css';

/**
 * Solana Wallet Provider Component
 * Wraps the app with Solana wallet context
 */
export function SolanaWalletProvider({ children }: any) {
  // Network can be 'devnet', 'testnet', or 'mainnet-beta'
  // Use environment variable to switch between networks
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    const customRpc = "https://api.devnet.solana.com";
    return customRpc || clusterApiUrl(network);
  }, [network]);

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

/**
 * Get network configuration
 */
export function getNetworkConfig() {
  const network = 'devnet';
  const usdcMint = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Devnet USDC

  return {
    network,
    usdcMint,
    explorer: 'https://explorer.solana.com/?cluster=devnet',
  };
}