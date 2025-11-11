"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CardImage: any = {
  "The Star": "/images/star.png",
  "The Moon": "/images/moon.png",
  "The Sun": "/images/flower.png",
};

const Reading = () => {
  const wallet = useWallet();
  const [readingData, SetReadingData] = useState<any>();
  const [showCard, setShowCard] = useState(false);
  const router = useRouter();

  const getTarotReading = () => {
    try {
      const stored = sessionStorage.getItem("tarotReading");
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error("Error fetching tarot reading:", error);
      return null;
    }
  };

  useEffect(() => {
    const reading = getTarotReading();
    if (reading) {
      SetReadingData(reading);
    } else {
      router.push("/themes");
    }
  }, [wallet]);

  const InitalCard = () => {
    return (
      <>
        <div className="w-full inline-flex justify-center">
          <img src="/images/card.png" className="w-[214px] h-[341px] mx-10" />
          <img src="/images/card.png" className="w-[214px] h-[341px] mx-10" />
          <img src="/images/card.png" className="w-[214px] h-[341px] mx-10" />
        </div>
      </>
    );
  };

  const RevealedCard = () => {
    return (
      <>
        {readingData && (
          <div className="w-full inline-flex justify-center">
            {readingData.cards.map((data: string, index: number) => (
              <div key={index} className="flex flex-col items-center mx-10">
                <img src={CardImage[data]} className="w-[214px] h-[341px]" />
                <p className="text-white mt-2 pt-4 text-xl">{data}</p>
              </div>
            ))}
          </div>
        )}
        <div className="w-full pt-4 flex justify-center text-[#E3C679] mt-6">
          {readingData && (
            <div className="w-[680px] text-center">
              <p className="text-xl">{readingData.message}</p>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4">
      <Navbar />
      <div className="pt-24">
        <div className="w-full text-center pb-6">
          <p className="text-[#E3C679] text-4xl">Reveal your cards</p>
        </div>

        {showCard ? <RevealedCard /> : <InitalCard />}

        {!showCard && (
          <div className="pt-10 flex justify-center">
            <button
              onClick={() => setShowCard(true)}
              className="w-[396px] my-6 py-3 text-white text-center relative cursor-pointer transition-all duration-300 hover:bg-transparent hover:scale-[1.03]"
              style={{
                backgroundImage: "url('/images/stake-btn.svg')",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              Reveal your cards
            </button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default Reading;
