'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleForm from './ArticleForm';
import { toast } from 'react-toastify';
import { Category } from '@/lib/types/categoryTypes';
import { ArticleInput } from '@/lib/types/articleTypes';

export default function AddArticle() {
  const [categories, setCategories] = useState<Category[]>([]);

 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get<Category[]>('/api/categories');
      setCategories(res.data);
    } catch {
      toast.error('שגיאה בטעינת קטגוריות');
    }
  };

  fetchCategories();
}, []);


const handleSubmit = async (data: ArticleInput) => {
  try {
    await axios.post('/api/admin/article', data);
    toast.success('המאמר נשמר!');
  } catch (error) {
    toast.error('שגיאה בשמירת המאמר');
    console.error('Error saving article:', error);
  }
};

  return (
    <ArticleForm
      categories={categories}
      showCategorySelect={true}
      onSubmit={handleSubmit}
    />
  );
}