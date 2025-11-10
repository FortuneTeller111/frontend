"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const WalletConnect = () => {
  return (
    <div className="relative w-[187px] h-[57px]">
      <img 
        src="/images/wallet.png" 
        className="absolute inset-0 w-full h-full pointer-events-none"
        alt="wallet background"
      />
      <WalletMultiButton 
        className="bg-[url(/images/wallet.png)]! border-none! w-[187px]! h-[57px]!"
        style={{
          width: '187px',
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