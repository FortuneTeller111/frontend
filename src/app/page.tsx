import Navbar from "@/components/Navbar";
import Image from "next/image";
import Staking from "./staking/page";

export default function Home() {
  return (
    <div className="min-h-screen main-bg">
      {/* <Navbar/> */}
      <Staking/>
    </div>
  );
}
