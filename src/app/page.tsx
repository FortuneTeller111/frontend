import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="min-h-screen w-full flex items-center justify-center px-4">
        <Navbar />
        <div className="w-full pt-16 mx-auto px-12 flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-7xl">
              welcome to
              <br />
              <span className="text-[#FF71FC]">tarot</span> reading{" "}
            </h1>
            <p className="pt-4 text-3xl">
              explore your card reading and make <br /> your fortune!
            </p>
            <div className="w-[320px] pt-6">
              <Link
                href="/themes"
                className="block w-full cursor-pointer my-6 py-3 text-white text-xl text-center relative transition-all duration-300 hover:scale-[1.03]"
                style={{
                  backgroundImage: "url('/images/btn-bg.png')",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                Explore
              </Link>
            </div>
          </div>
          <div>
            <img src="/images/Chakra.png" className="w-[524px] h-[532px]" />
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
