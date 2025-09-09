"use client";
import React, { useEffect, useState } from "react";
import AddCategoryForm from "./AddCategoryForm";
import CategoryList from "./CategoryList";
  import axios from "axios";

type Category = {
  category: string;
  _id: string;
};

const CategoriesManage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("שגיאה בטעינת קטגוריות:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);



const handleDeleteCategory = async (id: string) => {
  try {
  await axios.delete(`/api/admin/categories?id=${id}`);
    setCategories((prev) => prev.filter((cat) => cat._id !== id));
  } catch (error) {
    console.error("שגיאה במחיקת קטגוריה:", error);
  }
};

  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
  };

  return (
    <div className="space-y-6">
      <AddCategoryForm onAdd={handleAddCategory} />
      {loading ? (
        <p>טוען קטגוריות...</p>
      ) : (
        <CategoryList categories={categories} onDelete={handleDeleteCategory} />
      )}
    </div>
  );
};

export default CategoriesManage;