"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "./ui/button";

type Category = {
  _id: string;
  category?: string;
};

interface SelectingCategoriesProps {
  handleCategory: (category: string) => void;
}

const SelectingCategories = ({ handleCategory }: SelectingCategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedButton, setSelectedButton] = useState<string>("all");

  useEffect(() => {
    axios
      .get<Category[]>("/api/categories")
      .then((res) => {
        const validCategories = Array.isArray(res.data)
          ? res.data.filter((cat) => cat._id && cat.category)
          : [];
        setCategories(validCategories);
      })
      .catch((err) => {
        console.error("שגיאה בשליפה:", err);
        toast.error("לא ניתן לטעון קטגוריות");
      });
  }, []);

  const getButtonClass = (isSelected: boolean) =>
    `bg-white text-myColor_red border-2 rounded-4xl px-4 py-2 transition-all duration-200 ${
      isSelected
        ? "bg-myColor_pink text-white hover:bg-myColor_pink hover:text-white"
        : "hover:bg-white hover:text-black"
    }`;

  return (
    <ul className="flex gap-5 flex-wrap justify-center p-5">
      <li key="all">
        <Button
         
          className={getButtonClass(selectedButton === "all")}
          onClick={() => {
            handleCategory("");
            setSelectedButton("all");
          }}
        >
          הכל
        </Button>
      </li>

      {categories.length > 0 ? (
        categories.map((cat) => (
          <li key={cat._id}>
            <Button
             
              className={getButtonClass(selectedButton === cat.category)}
              onClick={() => {
                handleCategory(cat._id);
                setSelectedButton(cat.category || "");
              }}
            >
              {cat.category || "ללא שם"}
            </Button>
          </li>
        ))
      ) : (
        <li>
          <p className="text-gray-500"></p>
        </li>
      )}
    </ul>
  );
};

export default SelectingCategories;