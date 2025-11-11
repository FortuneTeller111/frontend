import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

// Initialize Solana connection (devnet)
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Your wallet that will receive payments
const RECIPIENT_WALLET = new PublicKey("8A2C3qpv87bzA8m6EEefEKYww4G39XJwFrsrtVKVSSqR");

// USDC mint address on devnet
const USDC_MINT_DEVNET = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

// Payment amount: 1 USDC (6 decimals)
const PAYMENT_AMOUNT = 1_000_000;

// Parse payment header manually
function parsePaymentHeader(header: string) {
  try {
    const parts = header.split(":");
    if (parts.length !== 6 || parts[0] !== "solana") {
      throw new Error("Invalid payment header format");
    }

    return {
      chain: parts[0],
      recipient: parts[1],
      mint: parts[2],
      amount: parseInt(parts[3]),
      signature: parts[4],
      network: parts[5],
    };
  } catch (error) {
    console.error("Error parsing payment header:", error);
    throw new Error("Failed to parse payment header");
  }
}

// Verify payment transaction
async function verifyPayment(
  signature: string,
  recipientWallet: PublicKey,
  mintAddress: PublicKey,
  expectedAmount: number
): Promise<boolean> {
  try {
    console.log("Verifying transaction:", signature);

    // Get transaction details
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    if (!tx) {
      console.error("Transaction not found");
      return false;
    }

    console.log("Transaction found:", {
      slot: tx.slot,
      blockTime: tx.blockTime,
      meta: tx.meta?.err ? "Error" : "Success",
    });

    // Check if transaction was successful
    if (tx.meta?.err) {
      console.error("Transaction failed:", tx.meta.err);
      return false;
    }

    // Get recipient's associated token account
    const recipientATA = await getAssociatedTokenAddress(
      mintAddress,
      recipientWallet
    );

    console.log("Recipient ATA:", recipientATA.toString());

    // Check pre and post token balances
    const preBalances = tx.meta?.preTokenBalances || [];
    const postBalances = tx.meta?.postTokenBalances || [];

    console.log("Pre-token balances:", preBalances);
    console.log("Post-token balances:", postBalances);

    // Find the recipient's token account in the transaction
    const recipientPreBalance = preBalances.find(
      (balance) =>
        balance.owner === recipientWallet.toString() &&
        balance.mint === mintAddress.toString()
    );

    const recipientPostBalance = postBalances.find(
      (balance) =>
        balance.owner === recipientWallet.toString() &&
        balance.mint === mintAddress.toString()
    );

    if (!recipientPostBalance) {
      console.error("Recipient token account not found in transaction");
      return false;
    }

    // Calculate the amount received
    const preAmount = recipientPreBalance?.uiTokenAmount?.amount
      ? parseInt(recipientPreBalance.uiTokenAmount.amount)
      : 0;
    const postAmount = recipientPostBalance.uiTokenAmount?.amount
      ? parseInt(recipientPostBalance.uiTokenAmount.amount)
      : 0;

    const amountReceived = postAmount - preAmount;

    console.log("Amount verification:", {
      preAmount,
      postAmount,
      amountReceived,
      expectedAmount,
    });

    // Verify the amount
    if (amountReceived < expectedAmount) {
      console.error(
        `Insufficient payment: expected ${expectedAmount}, received ${amountReceived}`
      );
      return false;
    }

    console.log("Payment verified successfully!");
    return true;
  } catch (error) {
    console.error("Error verifying payment:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("=== API Route Called ===");

    // Check for x402 payment header
    const paymentHeader = req.headers.get("x-402-payment");
    console.log("Payment header:", paymentHeader);

    if (!paymentHeader) {
      console.log("No payment header, returning 402");
      return NextResponse.json(
        {
          error: "Payment required",
          message: "Please pay 1 USDC to access this message",
        },
        {
          status: 402,
          headers: {
            "X-Accept-402": `solana:${RECIPIENT_WALLET.toString()}:${USDC_MINT_DEVNET.toString()}:${PAYMENT_AMOUNT}:devnet`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Parse the payment header
    let paymentData;
    try {
      paymentData = parsePaymentHeader(paymentHeader);
      console.log("Parsed payment data:", paymentData);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return NextResponse.json(
        {
          error: "Invalid payment header",
          message: parseError instanceof Error ? parseError.message : "Parse failed",
        },
        {
          status: 400,
        }
      );
    }

    // Verify payment parameters
    if (
      paymentData.recipient !== RECIPIENT_WALLET.toString() ||
      paymentData.mint !== USDC_MINT_DEVNET.toString() ||
      paymentData.amount < PAYMENT_AMOUNT ||
      paymentData.network !== "devnet"
    ) {
      console.log("Invalid payment parameters:", {
        recipientMatch: paymentData.recipient === RECIPIENT_WALLET.toString(),
        mintMatch: paymentData.mint === USDC_MINT_DEVNET.toString(),
        amountMatch: paymentData.amount >= PAYMENT_AMOUNT,
        networkMatch: paymentData.network === "devnet",
      });

      return NextResponse.json(
        {
          error: "Invalid payment parameters",
          message: "Payment does not match required terms",
        },
        {
          status: 402,
          headers: {
            "X-Accept-402": `solana:${RECIPIENT_WALLET.toString()}:${USDC_MINT_DEVNET.toString()}:${PAYMENT_AMOUNT}:devnet`,
          },
        }
      );
    }

    // Verify the transaction on-chain
    console.log("Starting payment verification...");
    const isValid = await verifyPayment(
      paymentData.signature,
      RECIPIENT_WALLET,
      USDC_MINT_DEVNET,
      PAYMENT_AMOUNT
    );

    if (!isValid) {
      console.log("Payment verification failed");
      return NextResponse.json(
        {
          error: "Payment verification failed",
          message: "Could not verify payment transaction on blockchain",
        },
        {
          status: 402,
          headers: {
            "X-Accept-402": `solana:${RECIPIENT_WALLET.toString()}:${USDC_MINT_DEVNET.toString()}:${PAYMENT_AMOUNT}:devnet`,
          },
        }
      );
    }

    // Payment verified! Return the protected content
    console.log("Payment verified successfully, returning content");
    return NextResponse.json(
      {
        message: "Hey Welcome to paid message! 🎉",
        transactionSignature: paymentData.signature,
        paidAmount: `${PAYMENT_AMOUNT / 1_000_000} USDC`,
        verified: true,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("=== API Error ===");
    console.error("Error details:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      {
        status: 500,
      }
    );
  }
}