"use client";
import WalletConnect from "./WalletConnect";

const Navbar = () => {
  return (
    <div>
      <nav className="fixed w-full z-20 top-0 start-0">
        <div className="flex flex-wrap items-center justify-between mx-auto px-12 pt-6 pb-4">
          <img src="/images/logo.png" className="w-[128px] h-[42px]"/>
          <div className="flex gap-x-6 text-2xl">
            <a href="/" className="text-white">Home</a>
            <a href="/staking" className="text-white">Stake</a>
            <a href="/" className="text-white">Get Reading</a>
          </div>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <WalletConnect/>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
