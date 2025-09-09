import React from "react";
import Decorations from "./Decorations";

interface ArticleHeaderProps {
  title: string;
  subtitle?: string;
}

const TitleHeader: React.FC<ArticleHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="m-2 w-full text-center py-10 px-4 bg-gradient-to-r from-pink-100 to-red-100 rounded-xl shadow-md relative overflow-hidden">
      <h1 className="text-3xl lg:text-5xl font-extrabold text-pink-700 leading-tight z-10 relative">
        {title}
      </h1>

      {subtitle && (
        <div className="mt-4 flex items-center justify-center gap-4 relative z-10">
         <Decorations width={80} height={80}/>

          <p className="text-gray-600 text-base lg:text-lg font-medium text-right">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
};

export default TitleHeader;