import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = ({className,logoSrc}:{className?:string,logoSrc:string}) => {
  return (
    <Link href={"/"}>
       <img
          alt="logo"
          src={logoSrc}
          className="w-52 hover:scale-105 transition-all"
        />
    </Link>
  );
};

export default Logo;
