"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Reading = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4">
      <Navbar />
      <div>
        {/* <p className="text-white font-medium text-4xl text-center">Reveal your cards</p> */}
        <div className="inline-flex">
            <img src="/images/card.png" className="w-[214px] h-[341px] mx-10"/>
            <img src="/images/card.png" className="w-[214px] h-[341px] mx-10"/>
            <img src="/images/card.png" className="w-[214px] h-[341px] mx-10"/>
        </div>
        <div className="pt-10 flex justify-center">
            <button
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

      </div>
      <Footer />
    </main>
  );
};

export default Reading;
