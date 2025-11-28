import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import OpenAI from "openai";

// Initialize Solana connection (devnet)
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const RECIPIENT_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_RECIPIENT_WALLET!
);

const USDC_MINT_DEVNET = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT_DEVNET!
);

// Payment amount: 1 USDC (6 decimals)
const PAYMENT_AMOUNT = 1_000_000;

const tarotMeanings: { [key: string]: string } = {
  the_noob:
    "Fresh wallet energy, first transactions, learning the ropes, FOMO-driven decisions",
  shadowy_supercoder:
    "Anonymous builder, late-night deployments, mysterious smart contracts, hidden genius",
  data_oracle:
    "On-chain analytics master, pattern recognition, predictive insights, truth seeker",
  community_builder:
    "DAO leader, governance participation, social tokens, collective power",
  protocol_architect:
    "DeFi innovator, composability expert, system designer, foundational builder",
  blockchain_educator:
    "Knowledge sharer, onboarding guide, technical translator, mass adoption catalyst",
  liquidity_provider:
    "Market maker, yield optimizer, pool depth creator, passive income master",
  gas_optimizer:
    "Transaction efficiency expert, MEV awareness, timing precision, cost minimizer",
  exploit_defender:
    "White hat guardian, vulnerability hunter, protocol protector, security first",
  privacy_seeker:
    "Zero-knowledge advocate, mixer user, anonymous transactions, sovereignty defender",
  flash_loaner:
    "Arbitrage master, instant capital deployer, opportunity seizer, risk calculator",
  smart_contract_auditor:
    "Code reviewer, bug finder, security enforcer, trust builder",
  yield_farmer:
    "APY hunter, protocol hopper, reward harvester, compound interest maximizer",
  asset_burner:
    "Deflationary force, supply reducer, value concentrator, diamond hands",
  cross_chain_bridger:
    "Multichain navigator, interoperability pioneer, liquidity mover, network connector",
  rug_puller:
    "Dark force warning, trust breaker, cautionary tale, risk reminder",
  crisis_manager:
    "Bear market survivor, liquidation avoider, risk mitigator, calm in chaos",
  gitcoin_grant_recipient:
    "Public goods builder, community funded, impact creator, ecosystem contributor",
  meme_coin_trader:
    "Cultural capital rider, community coin flipper, viral trend catcher, high risk tolerance",
  defi_billionaire:
    "Whale status, market mover, protocol governor, generational wealth",
  fed_chair:
    "Monetary policy influencer, market sentiment driver, macro perspective, traditional bridge",
  chain_traveller:
    "Multi-network explorer, gas fee optimizer, bridge expert, ecosystem diversifier",
};

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
    const body = await req.json();
    const wallet_address = body.address;
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
          message:
            parseError instanceof Error ? parseError.message : "Parse failed",
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

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    });

    // Fetch wallet data from Solana blockchain
    async function fetchWalletData(walletAddress: string) {
      try {
        // Using Helius RPC for Solana data (you can also use Alchemy, QuickNode, etc.)
        const response = await fetch(`https://api.devnet.solana.com`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [walletAddress],
          }),
        });

        const data = await response.json();
        const balanceLamports = data.result?.value || 0;
        const balanceSOL = balanceLamports / 1e9;

        // Get transaction count
        const signaturesResponse = await fetch(
          `https://api.devnet.solana.com`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "getSignaturesForAddress",
              params: [walletAddress, { limit: 1000 }],
            }),
          }
        );

        const signaturesData = await signaturesResponse.json();
        const totalTransactions = signaturesData.result?.length || 0;

        // Analyze wallet behavior
        const walletData = {
          balance: `${balanceSOL.toFixed(2)} SOL`,
          total_transactions: totalTransactions,
          trade_pattern: analyzeTradePattern(balanceSOL, totalTransactions),
          balance_trend: analyzeBalanceTrend(balanceSOL),
          risk_profile: analyzeRiskProfile(balanceSOL, totalTransactions),
          activity_level: analyzeActivityLevel(totalTransactions),
        };

        return walletData;
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        // Return fallback data if API fails
        return {
          balance: "Unknown SOL",
          total_transactions: 0,
          trade_pattern: "mysterious and untraceable",
          balance_trend: "hidden in the cosmic mist",
          risk_profile: "enigmatic",
          activity_level: "veiled",
        };
      }
    }

    function analyzeTradePattern(
      balance: number,
      transactions: number
    ): string {
      if (transactions < 10) return "newly awakened to the blockchain realm";
      if (transactions > 500 && balance > 10)
        return "seasoned trader with bold moves";
      if (balance > 50) return "cautious accumulator with steady vision";
      if (transactions > 100) return "active explorer seeking opportunities";
      return "balanced wanderer on the digital path";
    }

    function analyzeBalanceTrend(balance: number): string {
      if (balance > 100) return "abundantly flourishing";
      if (balance > 10) return "steadily growing";
      if (balance > 1) return "carefully building";
      return "beginning the journey";
    }

    function analyzeRiskProfile(balance: number, transactions: number): string {
      const ratio = transactions > 0 ? balance / transactions : 0;
      if (ratio > 1) return "conservative guardian";
      if (ratio > 0.1) return "balanced navigator";
      if (ratio > 0.01) return "bold adventurer";
      return "fearless explorer";
    }

    function analyzeActivityLevel(transactions: number): string {
      if (transactions > 1000) return "highly active";
      if (transactions > 100) return "moderately active";
      if (transactions > 10) return "occasionally active";
      return "newly initiated";
    }

    // Draw tarot cards (deterministic based on wallet address)
    function drawCards(walletAddress: string, numCards: number = 3): string[] {
      const allCards = Object.keys(tarotMeanings);

      // Create a simple hash from wallet address for deterministic selection
      let hash = 0;
      for (let i = 0; i < walletAddress.length; i++) {
        hash = (hash << 5) - hash + walletAddress.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }

      // Use hash to select cards deterministically
      const selectedCards: string[] = [];
      const usedIndices = new Set<number>();

      for (let i = 0; i < numCards; i++) {
        let index = Math.abs(hash + i * 7919) % allCards.length; // 7919 is a prime number

        // Ensure we don't select the same card twice
        while (usedIndices.has(index)) {
          index = (index + 1) % allCards.length;
        }

        usedIndices.add(index);
        selectedCards.push(allCards[index]);
      }

      return selectedCards;
    }

    // Analyze wallet and create summary
    function analyzeWallet(walletData: any): string {
      return (
        `Wallet balance: ${walletData.balance}. ` +
        `Total transactions: ${walletData.total_transactions}. ` +
        `Trading pattern: ${walletData.trade_pattern}. ` +
        `Balance trend: ${walletData.balance_trend}. ` +
        `Risk profile: ${walletData.risk_profile}. ` +
        `Activity level: ${walletData.activity_level}.`
      );
    }

    // Generate mystical message using OpenAI
    async function generateFortune(
      cards: string[],
      walletSummary: string
    ): Promise<string> {
      const cardMeaningsText = cards
        .map((card) => `- ${card}: ${tarotMeanings[card]}`)
        .join("\n");

      const prompt = `You are a mystical Web3 fortune teller who reads the blockchain like ancient cards.

The following Web3 tarot cards have been drawn:
${cards.map((card) => `- ${card}`).join("\n")}

Card meanings:
${cardMeaningsText}

Wallet analysis:
${walletSummary}

Create a mystical, poetic message (2-3 sentences) that weaves together the Web3 card symbolism with the wallet's on-chain patterns. Use metaphors related to smart contracts, gas fees, MEV, liquidity pools, and blockchain consensus. The message should feel personal and insightful, connecting the cards' meanings to the wallet's behavior. Do not mention the cards by name in the message, only weave their symbolism into the narrative.`;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 200,
        });

        return (
          completion.choices[0]?.message?.content?.trim() ||
          "Your wallet whispers of untold potential, a fresh genesis block awaiting its first transaction. The blockchain paths before you shimmer with possibility, each gas fee a stepping stone toward your destiny in the decentralized realm."
        );
      } catch (error) {
        console.error("Error generating fortune:", error);
        // Updated fallback message for Web3 theme
        return "Your wallet whispers of untold potential, a fresh genesis block awaiting its first transaction. The blockchain paths before you shimmer with possibility, each gas fee a stepping stone toward your destiny in the decentralized realm.";
      }
    }

    if (!wallet_address) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Step 1: Fetch and analyze wallet data
    const walletData = await fetchWalletData(wallet_address);
    const walletSummary = analyzeWallet(walletData);

    // Step 2: Draw tarot cards
    const cards = drawCards(wallet_address, 3);

    // Step 3: Generate mystical message
    const message = await generateFortune(cards, walletSummary);

    return NextResponse.json(
      {
        cards,
        message,
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
    console.error("Error details:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );

    // Updated fallback response for API failures
    return NextResponse.json(
      {
        cards: ["the_noob"],
        message:
          "Your wallet whispers of untold potential, a fresh genesis block awaiting its first transaction. The blockchain paths before you shimmer with possibility, each gas fee a stepping stone toward your destiny in the decentralized realm.",
        error: "Service temporarily unavailable",
        fallback: true,
      },
      {
        status: 200, // Return 200 with fallback data instead of 500
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
