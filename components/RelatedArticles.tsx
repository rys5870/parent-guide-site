import Link from "next/link";
import Image from "next/image";
import { ArticleSummary } from "@/lib/types/articleTypes";

type Props = {
  articles: ArticleSummary[];
};

const RelatedArticles: React.FC<Props> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <aside className="rounded-[1.5rem] border border-myColor_pink/10 bg-white/85 p-5 shadow-lg shadow-myColor_pink/10 backdrop-blur-sm">
      <h3 className="mb-5 border-b border-myColor_pink/10 pb-3 text-xl font-extrabold text-gray-900">
        מאמרים נוספים בנושא
      </h3>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article._id}>
            <Link
              href={`/articles/${article._id}`}
              className="group flex items-center gap-4 rounded-2xl border border-myColor_pink/10 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-myColor_orange/30 hover:shadow-lg"
            >
              {article.image && (
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
                  <Image
                    src={article.image}
                    alt={`תמונה מתוך המאמר: ${article.title}`}
                    fill
                    sizes="80px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex-1 text-right">
                <h4 className="line-clamp-2 text-base font-bold text-gray-800 transition duration-200 group-hover:text-myColor_red">
                  {article.title}
                </h4>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default RelatedArticles;