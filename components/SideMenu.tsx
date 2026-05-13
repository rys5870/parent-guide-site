'use client';
import React, { FC } from "react";
import Logo from "./Logo";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useFilteredLinks } from "@/hooks/useFilteredLinks";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SideBarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

const { user, isLoaded } = useUser();
const filteredLinks = useFilteredLinks(user, isLoaded);

  if (!isLoaded) return null;

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <button
        type="button"
        aria-label="סגירת תפריט"
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={sidebarRef}
        className={`relative mr-auto flex h-screen w-[min(22rem,86vw)] flex-col gap-8 overflow-y-auto border-r border-white/50 bg-[#b9152d] bg-gradient-to-br from-[#9f1239] via-[#be185d] to-[#c2410c] p-6 text-white shadow-2xl shadow-black/35 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-5">
          <button
            type="button"
            aria-label="סגירת תפריט"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white hover:text-myColor_red"
          >
            <X />
          </button>
          <div className="rounded-2xl bg-white/95 p-1 shadow-lg">
            <Logo logoSrc="/logo.webp" className="h-[50px] w-[170px]" />
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-base font-bold tracking-wide">
          {filteredLinks.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={onClose}
              className={`rounded-2xl px-4 py-3 transition-colors hover:bg-white hover:text-myColor_red ${
                pathname === item.href ? "bg-white text-myColor_red shadow-md" : "bg-black/12 text-white shadow-sm"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-black/18 p-4 shadow-inner">
          <p className="mb-3 text-sm font-semibold text-white">אפשר למצוא אותי גם כאן</p>
          <SocialMedia
            className="gap-2"
            iconClassName="border-white/30 bg-white/10 text-white hover:bg-white hover:text-myColor_red"
            tooltipClassName="bg-white text-myColor_red"
          />
        </div>
      </div>
    </div>
  );
};

export default SideMenu;