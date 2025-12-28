"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const NAV_MENU = [
  { name: "Staking", href: "/staking", current: true },
  { name: "Dashboard", href: "/", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative">
      <div className="mx-auto">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img src="/images/logo.svg" />
            </Link>
          </div>
          <div>
            {NAV_MENU.map((item: any) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <button className="bg-fortune-green hover:bg-fortune-green/60 text-fortune-black text-base font-medium px-6 py-3 rounded-lg">
            Connect Wallet
          </button>

          <button
            type="button"
            className="sm:hidden relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden pb-4">
            <button className="w-full bg-green-500 hover:bg-green-500/60 text-gray-900 text-base font-medium px-6 py-3 rounded-lg transition-colors">
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
