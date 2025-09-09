import ArticleList from "@/components/ArticleList";
import Carousel from "@/components/Carousle";
import ChildInAdultWorld from "@/components/ChildInAdultWorld";
import Container from "@/components/Container";
import HeroSection from "@/components/HeroSection";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "בית |  ד. רבינסקי",
  description:
    "ברוכים הבאים! כאן תמצאו ליווי אישי, הדרכה וכלים מעשיים להתמודדות עם אתגרי ההורות — מגמילה, שינה, גבולות ועד תקשורת מקרבת. כי כל הורה ראוי לתמיכה",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <Container className="mt-3 space-y-5 p-1">
        <ChildInAdultWorld />
        <div className="absolute top-28 right-1 flex flex-col items-end gap-2 animate-fade-in">
         <Image
  src="/img.webp"
  alt="תמונה"
  width={0}
  height={0}
  sizes="100vw"
  className="w-[250px] h-auto"

/>
<Image
  src="/img.webp"
  alt="תמונה"
   width={0}
  height={0}
  sizes="100vw"
  className="w-[150px] h-auto"

/>
<Image
  src="/img.webp"
  alt="תמונה"
  width={0}
  height={0}
  sizes="100vw"
  className="w-[75px] h-auto"

/>
<Image
  src="/img.webp"
  alt="תמונה"
    width={0}
  height={0}
  sizes="100vw"
  className="w-[45px] h-auto"

/>
        </div>

        <div className="flex flex-wrap justify-center   border-2 border-pink-100 p-5">
          <div className=" w-full flex flex-wrap justify-between  items-center gap-3">
            <h2 className="font-bold text-2xl">מאמרים נבחרים</h2>

            <Link
              className=" text-2xl text-white p-2 rounded-3xl bg-myColor_red"
              href={"/articles"}
            >
              לכל המאמרים👈
            </Link>
          </div>
          <ArticleList numToShow={3} isFavorite={true} />
        </div>

        <Carousel />
      </Container>
    </>
  );
}
