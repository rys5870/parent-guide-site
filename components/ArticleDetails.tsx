import React from "react";
import Container from "./Container";
import Image from "next/image";

interface ArticleProps {
  id: string;
  title: string;
  topic: string;
  content: string;
  readTime: string;
  createdAt: string;
  imageUrl: string;
}

const ArticleDetails: React.FC<ArticleProps> = ({
  id,
  title,
  topic,
  content,
  readTime,
  createdAt,
  imageUrl,
}) => {
  return (
    <div>
      <Container>
        <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
        
        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {title}
          </h1>
          
          
        </div>
        <div className="mx-5 max-w-200 md:mx-auto mt-[-100] mb-10 ">
          <Image
            className="border-4 border-white"
            src={imageUrl}
            alt=""
            width={1280}
            height={720}
          />
          <h1 className="my-8 text-2xl font-semibold">Introduction</h1>
          <p className="">{content}</p>
          <h3 className="my-5 text-[18px] font-semibold">
            Step 1: Self-Reflection and Goal Setting
          </h3>
          <p className="my-3">
            Before you can manage your lifestyle, you must have a clear
            understanding of what you want
          </p>
          <p className="my-3">
            Before you can manage your lifestyle, you must have a clear
            understanding of what you want
          </p>
          <h3 className="my-5 text-[18px] font-semibold">
            Step 2: Self-Reflection and Goal Setting
          </h3>
          <p className="my-3">
            Before you can manage your lifestyle, you must have a clear
            understanding of what you want
          </p>
          <p className="my-3">
            Before you can manage your lifestyle, you must have a clear
            understanding of what you want
          </p>
          <h3 className="my-5 text-[18px] font-semibold">
            Step 3: Self-Reflection and Goal Setting
          </h3>
          <p className="my-3">
            Before you can manage your lifestyle, you must have a clear
            understanding of what you want
          </p>
          <p className="my-3">
            Before you can manage your lifestyle, you must have a clear
            understanding of what you want
          </p>
          <div className="my-24">
            <p className="text-black font-semibold my-4">
              Share this article on social media
            </p>
         
          </div>
        </div>
      </div>
      </Container>
    </div>
  );
};

export default ArticleDetails;
