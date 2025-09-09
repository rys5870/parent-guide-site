'use client';
import React, {useEffect, useState } from 'react';
import axios from 'axios';
import ArticleDetails from '@/components/ArticleDetails';
import { Article } from '@/lib/types/articleTypes';

type Props = {
  params: Promise<{ id: string }>;
};






const Page = ({ params }: Props) => {
  const [id, setId] = useState<string | null>(null);
  const [data, setData] = useState<Article | null>(null);

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchArticleData = async () => {
      try {
        const response = await axios.get<Article>('/api/article', {
          params: { id },
        });
        setData(response.data);
      } catch (error) {
        console.error('שגיאה בשליפת המאמר:', error);
      }
    };

    fetchArticleData();
  }, [id]);


  if (!data) return <div>טוען...</div>;

  return (
    <div>
     <ArticleDetails
  title={data.title}
  image={data.image}
  sections={data.sections}
  _id={data._id}
  category={data.category}
  date={data.date}
  isFavorite={data.isFavorite}
/>

    </div>
  );
};

export default Page;