import React from "react";
import Container from "./Container";
import Image from "next/image";
import Comments from "./Comments";
import { Article } from "@/lib/types/articleTypes";
import AddComment from "./AddComment";
import RelatedArticles from "./RelatedArticles";
import PageBackdrop from "./PageBackdrop";

const getReadingTime = (sections: Article["sections"]) => {
  const words = sections
    .map((section) => section.content)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 180));
};

const normalizeArticleContent = (content: string) =>
  content
    .replace(/“\s*—\s*”/g, " — ")
    .replace(/\s+•\s+/g, "\n• ")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const renderContentBlocks = (content: string, sectionIndex: number) => {
  const normalizedContent = normalizeArticleContent(content);

  if (!normalizedContent) {
    return null;
  }

  return normalizedContent.split(/\n{2,}/).map((block, blockIndex) => {
    const lines = block.split("\n").filter((line) => line.trim());
    const isBulletList = lines.every((line) => line.trim().startsWith("•"));
    const trimmedBlock = block.trim();
    const isQuote =
      (trimmedBlock.startsWith("“") && trimmedBlock.endsWith("”")) ||
      trimmedBlock.startsWith(">");

    if (isBulletList) {
      return (
        <ul
          key={`${sectionIndex}-list-${blockIndex}`}
          className="my-6 space-y-3 rounded-2xl bg-[#fff8fb] p-5"
        >
          {lines.map((line, lineIndex) => (
            <li
              key={`${sectionIndex}-item-${blockIndex}-${lineIndex}`}
              className="flex gap-3 text-lg leading-8 text-gray-800"
            >
              <span className="mt-3 size-2 shrink-0 rounded-full bg-myColor_red" />
              <span>{line.replace(/^•\s*/, "")}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (isQuote) {
      return (
        <blockquote
          key={`${sectionIndex}-quote-${blockIndex}`}
          className="my-7 rounded-2xl border-r-4 border-myColor_red bg-myColor_red/7 px-5 py-4 text-xl font-bold leading-9 text-gray-900"
        >
          {trimmedBlock.replace(/^>\s*/, "")}
        </blockquote>
      );
    }

    return (
      <p
        key={`${sectionIndex}-paragraph-${blockIndex}`}
        className="my-5 text-lg leading-9 text-gray-700 md:text-xl md:leading-10"
      >
        {trimmedBlock}
      </p>
    );
  });
};

const ArticleDetails: React.FC<Article> = ({
  _id,
  title,
  image,
  sections,
  category,
}) => {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const [similarArticles, setSimilarArticles] = React.useState<Article[]>([]);
  const readingTime = getReadingTime(sections);
  const categoryName = typeof category === "object" ? category.category : "";
  const categoryId = typeof category === "object" ? category._id : category;

  React.useEffect(() => {
    const fetchSimilarArticles = async () => {
      try {
        const response = await fetch(
          `/api/article/related?categoryId=${categoryId}&excludeId=${_id}`
        );
        const data = await response.json();
        setSimilarArticles(data);
      } catch (error) {
        console.error("שגיאה בשליפת מאמרים דומים:", error);
      }
    };
    fetchSimilarArticles();
  }, [_id, categoryId]);

  React.useEffect(() => {
    setRefreshTrigger(0);
  }, [_id]);

  const handleCommentAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div
      role="main"
      aria-label={`מאמר: ${title}`}
      className="relative min-h-screen overflow-x-hidden py-10 md:py-14"
    >
      <PageBackdrop />
      <Container>
        <header className="mb-8 overflow-hidden rounded-[2.25rem] border border-myColor_pink/10 bg-white/88 shadow-[0_24px_80px_-42px_rgba(205,36,103,0.35)] backdrop-blur-md md:mb-10">
          <div className="grid items-center gap-8 p-5 md:p-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="text-right">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                {categoryName && (
                  <span className="rounded-full bg-myColor_red/10 px-4 py-2 text-sm font-extrabold text-myColor_red">
                    {categoryName}
                  </span>
                )}
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600">
                  {readingTime} דקות קריאה
                </span>
              </div>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-950 md:text-6xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                מאמר לקריאה רגועה, עם חלוקה ברורה לקטעים, פסקאות ורעיונות מרכזיים.
              </p>
              <div className="mt-6 h-1.5 w-28 rounded-full bg-gradient-to-l from-myColor_pink via-myColor_orange to-myColor_red" />
            </div>

            {image && (
              <div className="relative min-h-[16rem] overflow-hidden rounded-[1.75rem] border-4 border-white shadow-2xl shadow-myColor_pink/15 md:min-h-[22rem]">
                <Image
                  className="object-cover"
                  src={image}
                  alt={`תמונה מתוך המאמר: ${title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  priority
                />
              </div>
            )}
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="flex-1">
            <article
              className="overflow-hidden rounded-[2rem] border border-myColor_pink/10 bg-white/92 px-5 py-8 shadow-xl shadow-myColor_pink/10 backdrop-blur-sm md:px-10 md:py-10"
              role="article"
            >
              {sections.map((section, index) => (
                <section
                  key={`${index}-${section.title}`}
                  aria-labelledby={`section-title-${index}`}
                  className="relative mb-12 border-b border-myColor_pink/10 pb-10 last:mb-0 last:border-b-0 last:pb-0"
                >
                  <div className="mb-6 flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-myColor_red to-myColor_orange text-lg font-extrabold text-white shadow-lg shadow-myColor_red/20">
                      {section.icon || index + 1}
                    </div>
                    <div>
                      {section.title && (
                        <h2
                          id={`section-title-${index}`}
                          className="text-2xl font-extrabold leading-tight text-gray-950 md:text-3xl"
                        >
                          {section.title}
                        </h2>
                      )}
                      <div className="mt-3 h-1 w-16 rounded-full bg-myColor_red/30" />
                    </div>
                  </div>

                  <div className="max-w-none">{renderContentBlocks(section.content, index)}</div>
                </section>
              ))}
            </article>

            <div className="mt-16 rounded-2xl bg-[#fff8fb] p-5 shadow-inner md:p-6">
              <Comments id={_id} refreshTrigger={refreshTrigger} />
            </div>

            <div className="mt-10">
              <AddComment id={_id} onCommentAdded={handleCommentAdded} />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:w-[22rem] lg:self-start">
            <div className="rounded-[1.5rem] border border-myColor_pink/10 bg-white/88 p-5 shadow-lg shadow-myColor_pink/10 backdrop-blur-sm">
              <p className="text-sm font-extrabold text-myColor_red">במאמר הזה</p>
              <nav className="mt-4 space-y-2" aria-label="תוכן עניינים">
                {sections.map((section, index) => (
                  <a
                    key={`${section.title}-${index}-toc`}
                    href={`#section-title-${index}`}
                    className="block rounded-xl bg-gray-50 px-3 py-2 text-sm font-bold text-gray-700 transition hover:bg-myColor_red/10 hover:text-myColor_red"
                  >
                    {section.title || `קטע ${index + 1}`}
                  </a>
                ))}
              </nav>
            </div>
            <RelatedArticles articles={similarArticles} />
          </aside>
        </div>
      </Container>
    </div>
  );
};

export default ArticleDetails;
