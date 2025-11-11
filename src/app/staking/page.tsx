"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Staking() {
  const [tab, setTab] = useState<"stake" | "unstake">("stake");

  return (
    <main
        className="min-h-screen w-full flex items-center justify-center px-4"
      >
        <Navbar />
    <div
      className="w-full max-w-md relative p-2"
      style={{
        backgroundImage: "url('/images/vector.svg')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="p-1"
        style={{
          backgroundImage: "url('/images/line.svg')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="p-10"
          style={{
            backgroundImage: "url('/images/design.svg')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h2 className="text-white text-center text-2xl mb-6">TAROT CARD READER</h2>

          <div
            className="relative flex"
            style={{
              backgroundImage: "url('/images/input.svg')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              padding: "11px",
            }}
          >
            <button
              className={`text-white flex-1 py-2 text-center ${
                tab === "stake" ? "bg-[#594819]" : "bg-[#251D08]"
              }`}
              onClick={() => setTab("stake")}
            >
              STAKE
            </button>

            <button
              className={`text-white flex-1 py-2 text-center ${
                tab === "unstake" ? "bg-[#594819]" : "bg-[#251D08]"
              }`}
              onClick={() => setTab("unstake")}
            >
              UNSTAKE
            </button>
          </div>

          <div className="text-white mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>{tab === "stake" ? "STAKE" : "UNSTAKE"}</span>
              <span>AVAILABLE BALANCE : 241</span>
            </div>

            <div
              className=" flex items-center px-3 py-2"
              style={{
                backgroundImage: "url('/images/input.svg')",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <input
                type="number"
                placeholder="00.00"
                className="flex-1 bg-transparent outline-none text-white"
              />
              <button className="ml-3 border rounded-sm border-[#C6A667] px-3 py-1 text-sm bg-[#2B2413]">
                MAX
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm text-[#E3C679]">
            <div className="flex justify-between">
              <span>YOUR SHARE</span>
              <span>2510%</span>
            </div>
            <div className="flex justify-between">
              <span>APR.%</span>
              <span>0.58%</span>
            </div>
            <div className="flex justify-between">
              <span>READING POINTS</span>
              <span>251</span>
            </div>
          </div>

          <button
            className="w-full my-6 py-3 text-white text-center relative transition-all duration-300 
             hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(198,166,103,0.65)]"
            style={{
              backgroundImage: "url('/images/stake-btn.svg')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            {tab === "stake" ? "STAKE" : "UNSTAKE"}
          </button>

          <img
            src="/images/img.svg"
            width={118}
            height={17}
            alt="logo"
            className="mx-auto"
          />
        </div>
      </div>
    </div>
    <Footer />
      </main>
  );
}
