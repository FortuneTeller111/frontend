import { SolanaWalletProvider } from "@/config/solana";
import "./globals.css";
import localFont from "next/font/local";

const grimReaper = localFont({
  src: "../../public/fonts/GrimReaper-jEBRO.ttf",
  variable: "--font-custom",
  weight: "400",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={grimReaper.variable}>
      <body className="">
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  );
}
