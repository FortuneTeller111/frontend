
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import IntegratedWalletPayment from "./components/IntegratedWalletPayment";

export default function Home() {
  return (
    <>
      <main
        className="min-h-screen w-full flex items-center justify-center px-4">
        <Navbar />
          <div className="pt-30">
          <IntegratedWalletPayment />
        </div>
        <Footer />
      </main>
    </>
  );
}
