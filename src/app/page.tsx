import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="main-bg">
      <Navbar/>
      <h1 className="text-5xl text-amber-200">Hello World</h1>
    </div>
  );
}
