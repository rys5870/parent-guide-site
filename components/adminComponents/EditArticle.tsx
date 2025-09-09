'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleForm from './ArticleForm';
import { toast } from 'react-toastify';
import { Article, ArticleInput } from '@/lib/types/articleTypes';
import { Category } from '@/lib/types/categoryTypes';
interface EditArticleProps {
  articleID: string;
}

const EditArticle: React.FC<EditArticleProps> = ({ articleID }) => {
  const [initialData, setInitialData] = useState<{
    title: string;
    image: string;
    category?: Category;
    sections: { title: string; content: string }[];
  } | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, categoriesRes] = await Promise.all([
          axios.get<Article>(`/api/article?id=${articleID}`),
          axios.get<Category[]>('/api/categories'),
        ]);

        const article = articleRes.data;

        const cleanedData = {
          title: article.title,
          image: article.image,
          category: article.category,
          sections: article.sections.map((s) => ({
            title: s.title ?? '',
            content: s.content,
          })),
        };

        setInitialData(cleanedData);
        setCategories(categoriesRes.data);
      } catch (error) {
        toast.error('שגיאה בטעינת נתונים');
        console.error('Error fetching article or categories:', error);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleID]);

const handleSubmit = async (data: ArticleInput) => {
  try {
    await axios.put(`/api/article/${articleID}`, data);
    toast.success('המאמר עודכן!');
  } catch (error) {
    toast.error('שגיאה בעדכון המאמר');
    console.error('Error updating article:', error);
  }
};


  if (loading) return <p>טוען...</p>;
  if (!initialData) return <p>מאמר לא נמצא</p>;

  return (
   <ArticleForm
  initialData={initialData}
  categories={categories} 
  showCategorySelect={true}
  onSubmit={handleSubmit}
  mode="edit"
/>
  );
};

export default EditArticle;