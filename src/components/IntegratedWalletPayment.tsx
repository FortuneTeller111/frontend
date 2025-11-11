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

const RECIPIENT_WALLET = new PublicKey("8A2C3qpv87bzA8m6EEefEKYww4G39XJwFrsrtVKVSSqR");

const USDC_MINT_DEVNET = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

const PAYMENT_AMOUNT = 1_000_000; // 1 USDC

function IntegratedWalletPayment() {
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
        throw new Error("You don't have a USDC account. Please get some devnet USDC first.");
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
      await new Promise(resolve => setTimeout(resolve, 2000));

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
        setMessage(response.data.message);
        setLoading(false)
      } else {
        throw new Error(response.data.message || "API call failed");
      }
    } catch (err: any) {
        setLoading(false)
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
    <div className="flex flex-col items-center gap-6 p-8 max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-xl w-full">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Premium Content Access
          </h2>
          <p className="text-gray-300 mb-6">
            Pay 1 USDC on Solana devnet to unlock the exclusive message
          </p>

          <button
            onClick={handlePayAndGetMessage}
            disabled={!connected || loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              !connected || loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            }`}
          >
            {loading
              ? "Processing Payment..."
              : !connected
              ? "Connect Wallet First"
              : "Pay 1 USDC & Get Message"}
          </button>
        </div>
      </div>

      {error && (
        <div className="w-full bg-red-500/10 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {txSignature && (
        <div className="w-full bg-blue-500/10 border border-blue-500 rounded-lg p-4">
          <p className="text-blue-400 text-sm mb-2">Transaction Confirmed!</p>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 text-xs break-all underline"
          >
            {txSignature}
          </a>
        </div>
      )}

      {message && (
        <div className="w-full bg-green-500/10 border border-green-500 rounded-lg p-6">
          <h3 className="text-green-400 font-semibold mb-2">
            🎉 Premium Content Unlocked!
          </h3>
          <p className="text-white text-lg">{message}</p>
        </div>
      )}
    </div>
  );
}

export default IntegratedWalletPayment;