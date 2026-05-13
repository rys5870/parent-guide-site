import {
  Facebook,
  Instagram,
  Mail,
  Youtube,
} from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { FaWhatsapp } from "react-icons/fa";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

const socialLinks = [
  {
    title: "Facebook",
    href: "https://www.facebook.com/dvoriravinski/?locale=he_IL",
    icon: <Facebook className="w-5 h-5" aria-hidden="true" />,
  },
  {
    title: "WhatsApp",
    href: "https://chat.whatsapp.com/CVltvucsRV8HJM0k5qOykU?mode=ems_copy_c",
    icon: <FaWhatsapp className="w-5 h-5" aria-hidden="true" />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com/dvoriravinski/",
    icon: <Instagram className="w-5 h-5" aria-hidden="true" />,
  },
  {
    title: "Mail",
    href: "mailto:1@dvoriravinski.co.il?subject=מתעניין&body=שלום, אני מתעניין ורוצה לקבל פרטים נוספים." +
          "%0D%0A%0D%0Aתודה רבה!%0D%0A",
    icon: <Mail className="w-5 h-5" aria-hidden="true" />,
  },
  {
    title: "YouTube",
    href: "https://www.youtube.com/@%D7%93%D7%91%D7%95%D7%A8%D7%99%D7%A8%D7%91%D7%99%D7%A0%D7%A1%D7%A7%D7%99-%D7%A26%D7%A7",
    icon: <Youtube className="w-5 h-5" aria-hidden="true" />,
  },
];

const SocialMedia = ({
  className,
  iconClassName,
  tooltipClassName,
}: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {socialLinks.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`מעבר ל-${item.title}`}
                aria-label={`מעבר לעמוד ${item.title}`}
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-full border border-myColor_pink/20 bg-white/70 text-myColor_red transition hover:-translate-y-0.5 hover:bg-myColor_red hover:text-white focus:outline-none focus:ring-2 focus:ring-myColor_pink/35",
                  iconClassName
                )}
              >
                <span role="img" aria-hidden="true">
                  {item.icon}
                </span>
              </a>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-white text-darkColor font-semibold",
                tooltipClassName
              )}
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;