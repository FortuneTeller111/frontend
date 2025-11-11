import Footer from "@/components/Footer";
import IntegratedWalletPayment from "@/components/IntegratedWalletPayment";
import Navbar from "@/components/Navbar";

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
