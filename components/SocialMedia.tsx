import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";
interface Props{
    className?: string;
    iconClassName?: string;
    tooltipClassName?: string;
}
const socialLinks = [
  {
    title: "Facebook",
    href: "https://www.facebook.com",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    title: "Twitter",
    href: "https://www.twitter.com",
    icon: <Twitter className="w-5 h-5" />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    title: "YouTube",
    href: "https://www.youtube.com",
    icon: <Youtube className="w-5 h-5" />,
  },
];
const SocialMedia = ({className,iconClassName,tooltipClassName}:Props) => {
  return (
    <TooltipProvider >
        <div className={cn("flex items-center gap-3.5 ",className)}>
      {socialLinks?.map((item) => (
        <Tooltip key={item?.title}>
          <TooltipTrigger asChild>
            <a href={item?.href}   className={cn("p-2 border rounded-full", iconClassName)} target="_blank" rel="noopener noreferrer">
              {item?.icon}
            </a>
          </TooltipTrigger>
          <TooltipContent className={cn("bg-white text-darkColor font-semibold",tooltipClassName)}>{item.title}</TooltipContent>
        </Tooltip>
      ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
