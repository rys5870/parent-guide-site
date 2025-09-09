import Logo from "@/components/Logo";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import { MdAlternateEmail, MdOutlineSpaceDashboard } from "react-icons/md";
import { MdArticle } from "react-icons/md";
import { TbBrandApplePodcast, TbCategoryPlus, TbHomeEdit } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";
import { TiInfoLargeOutline } from "react-icons/ti";
import { LuMessageCircleReply } from "react-icons/lu";
import { FaReply } from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen">
        {/* למשל: תפריט צד */}
        <aside className=" bg-myColor_orange text-white flex flex-col p-4">
          <nav>
            <Logo className=" hidden lg:block" logoSrc={"/logo.png"} />
            <ul>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin">
                  <div className="flex items-center gap-1 ">
                    <span>
                      <MdOutlineSpaceDashboard className="size-6" />
                    </span>
                    <span className=" hidden md:block text-right">דשבורד</span>
                  </div>
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin/articles">
                  <div className="flex items-center gap-1 ">
                    <span>
                      <MdArticle className="size-6" />
                    </span>
                    <span className=" hidden md:block">ניהול מאמרים</span>
                  </div>
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin/podcast">
                  <div className="flex items-center gap-1 ">
                    <span>
                      <TbBrandApplePodcast className="size-6" />
                    </span>
                    <span className=" hidden md:block">ניהול פודקסטים</span>
                  </div>
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin">
                  <div className="flex items-center gap-1 ">
                    <span>
                      <TbHomeEdit className="size-6" />
                    </span>
                    <span className=" hidden md:block">ניהול דף הבית</span>
                  </div>
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin/about">
                  <div className="flex items-center gap-1 ">
                    <span>

                      <TiInfoLargeOutline className="size-6" />
                    </span>
                    <span className=" hidden md:block">ניהול דף אודות</span>
                  </div>
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin/contact">
                <div className="flex items-center gap-1 ">
                    <span>
                      <RiContactsLine className="size-6" />
                    </span>
                    <span className=" hidden md:block">רשימת יצירת קשר</span>
                  </div>
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin/email">
                 <div className="flex items-center gap-1 ">
                    <span>
                      <MdAlternateEmail className="size-6" />
                    </span>
                     <span className=" hidden md:block">רשימת ניוזלייטר</span>
                  </div>
                
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin/categories">
                  <div className="flex items-center gap-1 ">
                    <span>

                      <TbCategoryPlus className="size-6" />
                    </span>
                     <span className=" hidden md:block">ניהול קטגוריות</span>
                  </div>
                
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin/comments">
                 <div className="flex items-center gap-1 ">
                    <span>
                      
                      <LuMessageCircleReply className="size-6" />
                    </span>
                    <span className=" hidden md:block">ניהול תגובות </span>
                  </div>
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin/testimonial">
                 <div className="flex items-center gap-1 ">
                    <span>
                      
                      <LuMessageCircleReply className="size-6" />
                    </span>
                    <span className=" hidden md:block">ניהול תגובות הורים </span>
                  </div>
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin/users">
                 <div className="flex items-center gap-1 ">
                    <span>
                      <RiContactsLine className="size-6" />
                    </span>
                      <span className=" hidden md:block">ניהול משתמשים</span>
                  </div>
               
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/admin/drawing">
                 <div className="flex items-center gap-1 ">
                    <span>
                      <RiContactsLine className="size-6" />
                    </span>
                      <span className=" hidden md:block">פיענוח ציורי ילדים</span>
                  </div>
               
                </Link>
              </li>
              <li className="p-2 bg-myColor_orange hover:bg-orange-300">
                <Link href="/">
                 <div className="flex items-center gap-1 ">
                    <span>
                      <FaReply className="size-6" />
                    </span>
                       <span className=" hidden md:block">חזרה לאתר</span>
                  </div>
                
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        {/* תוכן מרכזי */}
        <main className="flex-1 p-6 w-">{children}</main>
      </div>
    </ClerkProvider>
  );
}
