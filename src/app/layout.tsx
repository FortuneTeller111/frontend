"use client";

import { SolanaWalletProvider } from "./config/solana";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
