"use client";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HederMenu = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden flex-1 items-center justify-center gap-1 rounded-full border border-myColor_pink/10 bg-white/70 p-1 text-sm font-semibold text-lightColor shadow-inner shadow-myColor_pink/5 md:inline-flex">
      {headerData.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={`relative rounded-full px-3.5 py-2 transition-all duration-200 hover:bg-myColor_red/8 hover:text-myColor_red lg:px-4 ${
            pathname === item.href
              ? "bg-myColor_red text-white shadow-sm shadow-myColor_red/20 hover:bg-myColor_red hover:text-white"
              : ""
          }`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default HederMenu;