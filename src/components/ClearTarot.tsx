"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ClearTarot = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/reading") {
      sessionStorage.removeItem("tarotReading");
    }
  }, [pathname]);

  return null;
}

export default ClearTarot;
