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
      className={`fixed inset-y-0 h-screen left-0 z-50 
        bg-myColor_red text-white/80 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-gradient-to-l from-Color_red to-Color_pink h-screen p-10
        border-r border-myColor_red flex flex-col gap-6"
      >
        <div className="flex items-center justify-between gap-5">
          <button
            onClick={onClose}
            className="hover:text-myColor_red transition-colors"
          >
            <X />
          </button>
          <div className="bg-amber-50 rounded-2xl">
            <Logo logoSrc="/logo.webp" className="text-white" />
          </div>
        </div>

        <nav className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          {filteredLinks.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={onClose}
              className={`hover:text-myColor_red transition-colors ${
                pathname === item.href ? "text-white" : ""
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <SocialMedia />
      </div>
    </div>
  );
};

export default SideMenu;