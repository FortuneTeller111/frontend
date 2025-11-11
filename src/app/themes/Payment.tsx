"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
} from "@solana/spl-token";
import axios from "axios";

const RECIPIENT_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_RECIPIENT_WALLET!
);
const USDC_MINT_DEVNET = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT_DEVNET!
);
const PAYMENT_AMOUNT = 1_000_000; // 1 USDC

const Payment = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [txSignature, setTxSignature] = useState<string>("");

  const handlePayAndGetMessage = async () => {
    if (!publicKey || !signTransaction) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setTxSignature("");

    try {
      // Get associated token accounts
      const senderATA = await getAssociatedTokenAddress(
        USDC_MINT_DEVNET,
        publicKey
      );

      const recipientATA = await getAssociatedTokenAddress(
        USDC_MINT_DEVNET,
        RECIPIENT_WALLET
      );

      // Check if sender has USDC
      try {
        const senderTokenAccount = await getAccount(connection, senderATA);
        if (Number(senderTokenAccount.amount) < PAYMENT_AMOUNT) {
          throw new Error("Insufficient USDC balance");
        }
      } catch (err) {
        throw new Error(
          "You don't have a USDC account. Please get some devnet USDC first."
        );
      }

      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        senderATA,
        recipientATA,
        publicKey,
        PAYMENT_AMOUNT
      );

      // Create and send transaction
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transaction = new Transaction().add(transferInstruction);
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );

      // Wait for confirmation
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      setTxSignature(signature);

      // Wait a bit for transaction to propagate
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Now call the API with the payment proof
      const paymentHeader = `solana:${RECIPIENT_WALLET.toString()}:${USDC_MINT_DEVNET.toString()}:${PAYMENT_AMOUNT}:${signature}:devnet`;

      console.log("Calling API with payment header:", paymentHeader);

      const response = await axios.post(
        "/api/paid-message",
        {},
        {
          headers: {
            "X-402-Payment": paymentHeader,
          },
          validateStatus: (status) => status < 500, // Don't throw on 4xx errors
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        setLoading(false);
      } else {
        throw new Error(response.data.message || "API call failed");
      }
    } catch (err: any) {
      setLoading(false);
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Payment failed"
      );
    }
  };

  return (
    <div className="absolute bottom-6 left-6 right-6">
      <button
        onClick={handlePayAndGetMessage}
        disabled={!connected || loading}
        className="w-full py-2 sm:py-3 text-white text-center relative transition-all duration-300 
               hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(198,166,103,0.65)]"
        style={{
          backgroundImage: "url('/images/stake-btn.svg')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        
        {loading
              ? "Processing Payment..."
              : !connected
              ? "Connect Wallet First"
              : "GET READINGS"}
      </button>
      <img
        src="/images/img.svg"
        width={118}
        height={17}
        alt="logo"
        className="mx-auto mt-3"
      />
    </div>
  );
};

export default Payment;
