import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <main
        className="min-h-screen w-full flex items-center justify-center px-4">
        <Navbar />
        <Footer />
      </main>
    </>
  );
}
