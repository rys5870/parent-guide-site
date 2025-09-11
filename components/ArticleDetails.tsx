import React from "react";
import Container from "./Container";
import Image from "next/image";
import Comments from "./Comments";
import { Article } from "@/lib/types/articleTypes";
import PageTitle from "./PageTitle";
import AddComment from "./AddComment";
import RelatedArticles from "./RelatedArticles";

const ArticleDetails: React.FC<Article> = ({
  _id,
  title,
  image,
  sections,
  category,
}) => {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const [similarArticles, setSimilarArticles] = React.useState<Article[]>([]);

  React.useEffect(() => {
    const fetchSimilarArticles = async () => {
      try {
        const response = await fetch(
          `/api/article/related?categoryId=${category}&excludeId=${_id}`
        );
        const data = await response.json();
        setSimilarArticles(data);
      } catch (error) {
        console.error("שגיאה בשליפת מאמרים דומים:", error);
      }
    };
    fetchSimilarArticles();
  }, [_id, category]);

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
      className="bg-gradient-to-b from-[#fdf6f0] to-white min-h-screen py-12"
    >
      <Container>
        {/* כותרת */}
        <div className="text-center mb-10">
          <PageTitle text={title} />
          <div className="mx-auto mt-4 w-24 border-b-4 border-myColor_red rounded" />
        </div>

        {/* תמונת כותרת */}
        {image && (
          <div className="flex justify-center mb-12">
            <Image
              className="rounded-2xl border-4 border-white shadow-xl object-cover max-h-[400px] w-auto"
              src={image}
              alt={`תמונה מתוך המאמר: ${title}`}
              width={900}
              height={400}
              priority
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* תוכן מאמר */}
          <div className="bg-white flex-1 py-10 px-6 md:px-12 rounded-2xl shadow-lg border border-gray-100">
            <article
              className="prose prose-lg max-w-none text-gray-800 font-[Assistant]"
              role="article"
            >
              {sections.map((section, index) => (
                <section
                  key={`${index}-${section.title}`}
                  aria-labelledby={`section-title-${index}`}
                  className="mb-12"
                >
                  <h2
                    id={`section-title-${index}`}
                    className="text-2xl md:text-3xl font-bold text-myColor_red mb-4 border-b border-gray-200 pb-2"
                  >
                    {section.title}
                  </h2>
                  <p className="mt-4 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                  {section.icon && (
                    <div
                      className="text-4xl mt-6 flex justify-center md:justify-start bg-myColor_red/10 p-4 rounded-full w-fit mx-auto md:mx-0"
                      role="img"
                      aria-label={`אייקון עבור ${section.title}`}
                    >
                      {section.icon}
                    </div>
                  )}
                </section>
              ))}
            </article>

            {/* תגובות */}
            <div className="mt-16 bg-gray-50 p-6 rounded-xl shadow-inner">
              <Comments id={_id} refreshTrigger={refreshTrigger} />
            </div>

            {/* הוספת תגובה */}
            <div className="mt-10">
              <AddComment id={_id} onCommentAdded={handleCommentAdded} />
            </div>
          </div>

          {/* מאמרים דומים */}
          <aside className="lg:w-1/3">
            <RelatedArticles articles={similarArticles} />
          </aside>
        </div>
      </Container>
    </div>
  );
};

export default ArticleDetails;
