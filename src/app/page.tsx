import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Stake from "./components/Stake";

export default function Home() {
  return (
    <>
      <main
        className="min-h-screen w-full flex items-center justify-center px-4"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, #2C022A 0%, #0B022C 100%)",
        }}
      >
        <Navbar />
        <Stake />
        <Footer />
      </main>
    </>
  );
}
