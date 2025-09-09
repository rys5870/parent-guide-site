import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({
  className,
  logoSrc,
}: {
  className?: string;
  logoSrc: string;
}) => {
  return (
    <Link href={"/"}>
      <div className={cn("relative w-[208px] h-[60px]", className)}>
        <Image
          alt="logo"
          src={logoSrc}
          fill
          sizes="(max-width: 768px) 100vw, 200px"
          className=" object-contain hover:scale-105 transition-all"
          priority={true}
        />
      </div>
    </Link>
  );
};

export default Logo;
