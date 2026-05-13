import ArticleList from "@/components/ArticleList";
import Carousel from "@/components/Carousle";
import ChildInAdultWorld from "@/components/ChildInAdultWorld";
import Container from "@/components/Container";
import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import PageBackdrop from "@/components/PageBackdrop";

export const metadata = {
  title: "בית |  ד. רבינסקי",
  description:
    "ברוכים הבאים! כאן תמצאו ליווי אישי, הדרכה וכלים מעשיים להתמודדות עם אתגרי ההורות — מגמילה, שינה, גבולות ועד תקשורת מקרבת. כי כל הורה ראוי לתמיכה",
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PageBackdrop />
      <HeroSection />
      <Container className="relative z-10 space-y-7 px-3 pb-12 pt-6 md:space-y-10 md:px-4">
        <section className="rounded-[1.5rem] border border-myColor_pink/15 bg-white/82 p-4 shadow-[0_18px_55px_-34px_rgba(205,36,103,0.25)] backdrop-blur-md md:p-6">
          <div className="mb-5 text-center">
            <p className="text-sm font-bold text-myColor_red">הבסיס לשינוי בבית</p>
            <h2 className="mt-2 text-xl font-extrabold text-gray-900 md:text-2xl">
              כלים קטנים שמייצרים קשר גדול
            </h2>
          </div>
          <ChildInAdultWorld />
        </section>

        <section className="relative overflow-hidden rounded-[1.5rem] border border-myColor_pink/15 bg-white/85 p-4 shadow-[0_18px_55px_-34px_rgba(211,32,53,0.25)] backdrop-blur-md md:p-6">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-myColor_orange/15 blur-3xl" aria-hidden />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-myColor_pink/12 blur-3xl" aria-hidden />
          <div className="relative flex flex-col gap-4 border-b border-myColor_pink/10 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold text-myColor_red">נבחר עבורכם</p>
              <h2 className="mt-1 text-xl font-extrabold text-gray-900 md:text-2xl">
                מאמרים נבחרים
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">
                קריאה קצרה וממוקדת לנושאים שחוזרים כמעט בכל בית.
              </p>
            </div>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-myColor_red px-6 py-3 font-bold text-white shadow-lg shadow-myColor_red/20 transition hover:-translate-y-0.5 hover:bg-myColor_orange"
              href={"/articles"}
            >
              לכל המאמרים
              <span aria-hidden>←</span>
            </Link>
          </div>
          <ArticleList numToShow={3} isFavorite={true} />
        </section>

        <div className="overflow-hidden rounded-[1.5rem] border border-myColor_pink/10 shadow-[0_18px_55px_-36px_rgba(205,36,103,0.32)]">
          <Carousel />
        </div>
      </Container>
    </div>
  );
}
