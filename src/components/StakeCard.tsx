"use client";
import { useState } from "react";

export default function StakeCard() {
  const [tab, setTab] = useState<"stake" | "unstake">("stake");

  return (
    <div className="w-full max-w-md border border-[#C6A667] p-6 rounded-lg relative">


      <h2 className="text-center text-2xl mb-6">TAROT CARD READER</h2>

 
      <div className="flex">
        <button
          className={`flex-1 py-2 border border-[#C6A667] ${tab === "stake" ? "bg-[#594819]" : "bg-[#251D08]"}`}
          onClick={() => setTab("stake")}
        >
          STAKE
        </button>
        <button
          className={`flex-1 py-2 border border-[#C6A667] border-l-0 ${tab === "unstake" ? "bg-[#594819]" : "bg-[#251D08]"}`}
          onClick={() => setTab("unstake")}
        >
          UNSTAKЕ
        </button>
      </div>

    {/* Input */}
        <div className="mt-6">
        <div className="flex justify-between text-sm mb-1">
            <span>{tab === "stake" ? "STAKE" : "UNSTAKE"}</span>
            <span>AVAILABLE BALANCE : 241</span>
        </div>


  <div className="border border-[#C6A667] flex items-center px-3 py-2">
    <input
      type="number"
      placeholder="00.00"
      className="flex-1 bg-transparent outline-none text-white"
    />
    <button className="ml-3 border border-[#C6A667] px-3 py-1 text-sm">
      MAX
    </button>
  </div>
</div>



      <div className="mt-6 space-y-2 text-sm">
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
        className="w-full mt-8 py-3 border border-[#C6A667] bg-[#552C7B] text-white"
      >
        {tab === "stake" ? "STAKE" : "UNSTAKE"}
      </button>
    </div>
  );
}
