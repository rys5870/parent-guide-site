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
    `whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-bold shadow-sm transition-all duration-200 ${
      isSelected
        ? "border-myColor_red bg-myColor_red text-white shadow-myColor_red/20 hover:bg-myColor_red"
        : "border-myColor_pink/20 bg-white/80 text-myColor_red hover:-translate-y-0.5 hover:border-myColor_orange/50 hover:bg-Color_orange/20"
    }`;

  return (
    <ul className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-2 md:flex-wrap md:justify-center md:overflow-visible">
      <li key="all">
        <Button
          type="button"
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
              type="button"
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