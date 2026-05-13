'use client';
import React from "react";
import Container from "./Container";
import dynamic from "next/dynamic";

const HeaderMenu = dynamic(() => import("./HeaderMenu"), { ssr: false });

import Logo from "./Logo";
import MobilMenu from "./MobilMenu";
const HeaderAuth = dynamic(() => import("./HeaderAuth"), { ssr: false });

const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-myColor_pink/10 bg-white/88 py-2 shadow-sm shadow-myColor_pink/5 backdrop-blur-xl md:py-2.5">
      <Container className="flex items-center justify-between gap-2 text-lightColor md:gap-4">
        <div className="flex w-auto items-center justify-start gap-2 md:w-1/4">
          <MobilMenu />
          <Logo logoSrc={"/logo.webp"} className="h-[40px] w-[132px] sm:h-[46px] sm:w-[156px] md:h-[52px] md:w-[184px]" />
        </div>

        <HeaderMenu />

        <div className="flex w-auto items-center justify-end gap-3 md:w-1/4">
          <HeaderAuth />
        </div>
      </Container>
    </header>
  );
};

export default Header;