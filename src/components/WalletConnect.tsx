"use client";

import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const WalletConnect = () => {
  return (
    <div className="relative w-[210px] h-[57px]">
      <img 
        src="/images/wallet.png" 
        className="absolute inset-0 w-full h-full pointer-events-none"
        alt="wallet background"
      />
      <WalletMultiButtonDynamic 
        className="bg-[url(/images/wallet.png)]! border-none! w-[210px]! h-[57px]!"
        style={{
          width: '210px',
          height: '57px',
          background: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </div>
  );
};

export default WalletConnect;