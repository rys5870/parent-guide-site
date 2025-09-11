import Link from "next/link";
import Image from "next/image";
import { ArticleSummary } from "@/lib/types/articleTypes";

type Props = {
  articles: ArticleSummary[];
};

const RelatedArticles: React.FC<Props> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <aside className="bg-gradient-to-br from-[#fffdf9] to-[#fff6ef] p-6 rounded-3xl shadow-xl border border-[#f3eae2]">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-myColor_red/30">
        מאמרים נוספים בנושא
      </h3>
      <ul className="space-y-6">
        {articles.map((article) => (
          <li key={article._id}>
            <Link
              href={`/articles/${article._id}`}
              className="group flex items-center gap-4 bg-white rounded-xl border border-[#f8efe6] p-4 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {article.image && (
                <div className="w-24 h-24 flex-shrink-0 relative rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={article.image}
                    alt={`תמונה מתוך המאמר: ${article.title}`}
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                </div>
              )}
              <div className="flex-1 text-right">
                <h4 className="text-lg font-semibold text-gray-800 group-hover:text-myColor_red transition duration-200">
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