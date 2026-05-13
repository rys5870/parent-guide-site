import Logo from "@/components/Logo";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import { MdAlternateEmail, MdOutlineSpaceDashboard } from "react-icons/md";
import { MdArticle } from "react-icons/md";
import { TbBrandApplePodcast, TbBook2, TbCategoryPlus, TbHomeEdit } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";
import { TiInfoLargeOutline } from "react-icons/ti";
import { LuLock, LuMessageCircleReply } from "react-icons/lu";
import { FaReply } from "react-icons/fa";

const adminLinks = [
  { title: "דשבורד", href: "/admin", icon: MdOutlineSpaceDashboard },
  { title: "ניהול מאמרים", href: "/admin/articles", icon: MdArticle },
  { title: "ניהול פודקסטים", href: "/admin/podcast", icon: TbBrandApplePodcast },
  { title: "ניהול קורסים", href: "/admin/courses", icon: TbBook2 },
  { title: "הרשאות קורסים", href: "/admin/course-access", icon: LuLock },
  { title: "ניהול דף הבית", href: "/admin", icon: TbHomeEdit },
  { title: "ניהול דף אודות", href: "/admin/about", icon: TiInfoLargeOutline },
  { title: "רשימת יצירת קשר", href: "/admin/contact", icon: RiContactsLine },
  { title: "ניוזלטר ושליחת מיילים", href: "/admin/email", icon: MdAlternateEmail },
  { title: "ניהול קטגוריות", href: "/admin/categories", icon: TbCategoryPlus },
  { title: "ניהול תגובות", href: "/admin/comments", icon: LuMessageCircleReply },
  { title: "ניהול תגובות הורים", href: "/admin/testimonial", icon: LuMessageCircleReply },
  { title: "ניהול משתמשים", href: "/admin/users", icon: RiContactsLine },
  { title: "פיענוח ציורי ילדים", href: "/admin/drawing", icon: RiContactsLine },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen bg-slate-50">
        <aside className="sticky top-0 flex h-screen w-20 shrink-0 flex-col overflow-y-auto bg-gradient-to-b from-myColor_red via-myColor_pink to-myColor_orange px-3 py-4 text-white shadow-2xl shadow-myColor_pink/25 md:w-64 md:px-4">
          <div className="mb-6 hidden rounded-3xl bg-white/95 p-2 shadow-lg ring-1 ring-white/40 lg:block">
            <Logo className="mx-auto" logoSrc="/logo.webp" />
          </div>

          <div className="mb-4 hidden px-2 md:block">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/65">
              Admin Panel
            </p>
            <h2 className="mt-1 text-xl font-extrabold">ניהול האתר</h2>
          </div>

          <nav className="flex flex-1 flex-col gap-2" aria-label="תפריט ניהול">
            {adminLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={`${item.href}-${item.title}`}
                  href={item.href}
                  className="group grid min-h-14 grid-cols-1 items-center justify-items-center rounded-2xl border border-white/60 bg-white/92 px-3 py-2.5 text-sm font-extrabold text-gray-900 shadow-md shadow-black/10 transition-all duration-200 hover:-translate-x-1 hover:bg-white hover:text-myColor_red hover:shadow-lg md:grid-cols-[2.25rem_1fr] md:justify-items-start md:gap-3 md:px-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-myColor_red/10 text-myColor_red transition-colors group-hover:bg-myColor_red group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="hidden w-full leading-none md:block">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/"
            className="mt-5 grid min-h-14 grid-cols-1 items-center justify-items-center rounded-2xl border border-white/70 bg-white px-3 py-2.5 text-sm font-extrabold text-myColor_red shadow-lg shadow-black/10 transition-all hover:-translate-x-1 hover:bg-gray-50 md:grid-cols-[2.25rem_1fr] md:justify-items-start md:gap-3 md:px-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-myColor_red/10">
              <FaReply className="size-5" />
            </span>
            <span className="hidden w-full leading-none md:block">חזרה לאתר</span>
          </Link>
        </aside>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </ClerkProvider>
  );
}
