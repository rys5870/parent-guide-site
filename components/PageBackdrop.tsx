import React from "react";

/** Shared warm canvas for the public site. Uses the original pink/red/orange palette. */
export default function PageBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,180,217,0.42),transparent_34%),linear-gradient(180deg,#ffffff_0%,#fff8f6_48%,rgba(252,240,228,0.65)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute top-[8%] right-[7%] h-[min(28rem,62vw)] w-[min(28rem,62vw)] rounded-full bg-Color_orange/35 blur-[120px] mix-blend-multiply" />
      <div className="absolute top-[22%] left-[6%] h-[min(22rem,50vw)] w-[min(22rem,50vw)] rounded-full bg-Color_pink/40 blur-[110px] mix-blend-multiply" />
      <div className="absolute bottom-[12%] right-[18%] h-[min(24rem,52vw)] w-[min(24rem,52vw)] rounded-full bg-myColor_orange/20 blur-[130px] mix-blend-multiply" />
      <div className="absolute bottom-[4%] left-[14%] h-[min(18rem,45vw)] w-[min(18rem,45vw)] rounded-full bg-myColor_pink/15 blur-[100px] mix-blend-multiply" />
      <div className="absolute inset-x-6 top-36 h-px bg-gradient-to-l from-transparent via-myColor_pink/15 to-transparent" />
    </div>
  );
}
