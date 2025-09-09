"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "react-toastify";

type Props = {
  onAdd?: (newCategory: { category: string; _id: string }) => void;
};

const AddCategoryForm: React.FC<Props> = ({ onAdd }) => {
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (category.trim() === "") {
      setError("נא להזין שם קטגוריה");
      return;
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "שגיאה בשמירה");

      onAdd?.(data); // אם יש onAdd, נעדכן את הרשימה
      setCategory("");
      toast.success("הקטגוריה נוספה בהצלחה");
    } catch (err) {
      console.error("שגיאה בשמירה:", err);
      setError("לא ניתן לשמור את הקטגוריה");
    }
  };

  return (
    <form
      className="flex flex-col items-center space-y-2 border-2 border-myColor_pink p-3 rounded-2xl"
      onSubmit={handleAddCategory}
    >
      <div className="w-full">
        <label className="block mb-1">שם:</label>
        <Input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="הכנס שם קטגוריה"
          className="w-full"
        />
      </div>
      <Button type="submit">הוסף קטגוריה</Button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default AddCategoryForm;