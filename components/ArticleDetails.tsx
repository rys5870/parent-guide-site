import React from "react";
import Container from "./Container";
import Image from "next/image";
import Comments from "./Comments";
import { Article } from "@/lib/types/articleTypes";
import PageTitle from "./PageTitle";
import AddComment from "./AddComment";

const ArticleDetails: React.FC<Article> = ({ _id, title, image, sections }) => {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleCommentAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div role="main" aria-label={`מאמר: ${title}`}>
      <PageTitle text={title} />
      <Container>
        <div className="bg-myColor_red/3 py-5 px-5 md:px-12 lg:px-28">
          <div className="text-center my-24" />

          <div
            className="mx-5 md:mx-auto mb-10"
            style={{ marginTop: "-100px" }}
          >
            {image && (
              <Image
                className="border-4 border-white block mx-auto"
                src={image}
                alt={`תמונה מתוך המאמר: ${title}`}
                width={700}
                height={500}
                priority
              />
            )}

            {sections.map((section, index) => (
              <section
                key={`${index}-${section.title}`}
                aria-labelledby={`section-title-${index}`}
                className="mb-8"
              >
                <h2
                  id={`section-title-${index}`}
                  className="text-xl font-semibold"
                >
                  {section.title}
                </h2>
                <p className="text-gray-700 mt-2">{section.content}</p>
                {section.icon && (
                  <div
                    className="text-3xl mt-4"
                    role="img"
                    aria-label={`אייקון עבור ${section.title}`}
                  >
                    {section.icon}
                  </div>
                )}
              </section>
            ))}
          </div>

          <Comments id={_id} refreshTrigger={refreshTrigger} />
          <AddComment id={_id} onCommentAdded={handleCommentAdded} />
        </div>
      </Container>
    </div>
  );
};

export default ArticleDetails;