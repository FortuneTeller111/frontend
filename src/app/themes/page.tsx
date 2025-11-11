"use client";

import Navbar from "@/components/Navbar";
import Card from "./Card";
import Footer from "@/components/Footer";

const pages = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-12 py-24">
      <Navbar />
      <div className="flex items-start justify-center gap-x-10">
        <Card
          title="NUMEROLOGY"
          desc="Discover insights into your personality and life path through the mystical power of numbers derived from your name and birth date."
          imageSrc=""
        />
        <Card
          title="VEDIC"
          desc="Gain ancient wisdom from the stars — uncover your karmic patterns, strengths, and destiny based on your birth chart."
          imageSrc=""
        />
        <Card
          title="ASTROLOGY"
          desc="Explore how planetary movements and zodiac signs shape your emotions, relationships, and life journey."
          imageSrc=""
        />
      </div>
      <Footer />
    </main>
  );
};

export default pages;
