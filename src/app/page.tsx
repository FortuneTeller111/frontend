import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
