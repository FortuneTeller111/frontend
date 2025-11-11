"use client";

import Navbar from "./components/Navbar";
import IntegratedWalletPayment from "./components/IntegratedWalletPayment";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="pt-30">
        <IntegratedWalletPayment />
      </div>
    </div>
  );
}
