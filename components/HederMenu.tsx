"use client";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { use } from "react";

const HederMenu = () => {
    const pathname = usePathname();
  return (
    <div className="hidden md:inline-flex w-1/3 items-center gap-7 text-sm capitalize font-normal text-lightColor">
      {headerData.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`hover:text-myColor_red font-bold hoverEffect relative group ${pathname === item?.href && "text-myColor_red"}`}
        >
          {item?.title}
          <span
            className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-myColor_red group-hover:w-12 hoverEffect group-hover:left-0 ${pathname === item?.href && "w-1/2"}`}
          />
          <span
            className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-myColor_red group-hover:w-12 hoverEffect group-hover:right-0 ${pathname === item?.href && "w-1/2"}`}
          />
        </Link>
      ))}
    </div>
  );
};

export default HederMenu;
