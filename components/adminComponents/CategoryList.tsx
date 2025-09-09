"use client";
import React from "react";
import { Button } from "../ui/button";
import { MdDelete } from "react-icons/md";

type Category = {
  category: string;
  _id: string;
};

type Props = {
  categories: Category[];
  onDelete: (id: string) => void;
};

const CategoryList: React.FC<Props> = ({ categories, onDelete }) => {
  if (categories.length === 0) {
    return <p className="text-gray-500">אין קטגוריות להצגה</p>;
  }

  return (
    <ul className="space-y-2 border-2 border-myColor_pink p-3 rounded-2xl">
      {categories.map((cat) => (
        <li
          key={cat._id}
          className="flex justify-between items-center border-2 border-myColor_pink text-myColor_pink p-2 rounded-2xl"
        >
          <strong>{cat.category}</strong>
          <Button
            variant="destructive"
            size="icon"
            className="bg-transparent text-red-600 hover:text-white"
            onClick={() => onDelete(cat._id)}
          >
            <MdDelete />
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;