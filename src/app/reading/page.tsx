"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PinataSDK } from "pinata";
import { TAROT_CARDS } from "@/lib/Cards";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEWAY,
});

const Reading = () => {
  const wallet = useWallet();
  const [readingData, SetReadingData] = useState<any>();
  const [showCard, setShowCard] = useState(false);
  const [cardLinks, setCardLinks] = useState<
    Array<{
      card_name: string;
      cid: string;
      url: string;
    }>
  >([]);
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
      fetchPrivateFile(reading);
    } else {
      router.push("/themes");
    }
  }, [wallet]);

  const fetchPrivateFile = async (reading: any) => {
    const groupData = await pinata.groups.private.list();
    const CardCID: any = await pinata.files.private
      .list()
      .group(groupData.groups[0].id)
      .limit(30);

    const filteredCards = CardCID.files
      .filter((card: any) => reading.cards.includes(card.name))
      .map((card: any) => ({
        card_name: card.name,
        cid: card.cid,
      }));
    const cardsWithLinks = await Promise.all(
      filteredCards.map(async (card: any) => {
        const url = await pinata.gateways.private.createAccessLink({
          cid: card.cid,
          expires: 1800,
        });

        return {
          card_name: card.card_name,
          cid: card.cid,
          url: url,
        };
      })
    );
    setCardLinks(cardsWithLinks);
  };
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
            {cardLinks.map((data: any, index: number) => (
              <div key={index} className="flex flex-col items-center mx-10">
                <img src={data.url} className="w-[214px] h-[341px]" />
                <p className="text-white mt-2 pt-4 text-xl">
                  {TAROT_CARDS[data.card_name]}
                </p>
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
