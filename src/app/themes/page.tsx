"use client";

import Navbar from "@/components/Navbar";
import Card from "./Card";
import Footer from "@/components/Footer";

const pages = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-12 py-24">
      <Navbar />
      <div className="flex flex-col lg:flex-row items-start justify-center pt-20 lg:pt-0 gap-y-10 lg:gap-x-10">
        <Card
          title="TAROT READING"
          desc="Gain ancient wisdom from the stars uncover your karmic patterns, strengths, and destiny based on your birth chart."
          imageSrc=""
          disable={false}
        />
        <Card
          title="NUMEROLOGY"
          desc="Discover insights into your personality and life path through mystical power of numbers derived from your name and birth date."
          imageSrc=""
          disable={true}
        />
        <Card
          title="ASTROLOGY"
          desc="Explore how planetary movements and zodiac signs shape your emotions, relationships, and life journey."
          imageSrc=""
          disable={true}
        />
      </div>
      <Footer />
    </main>
  );
};

export default pages;
