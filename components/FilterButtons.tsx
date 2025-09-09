'use client'
import { useState } from "react";

const FilterButtons = () => {
  const [selected, setSelected] = useState("ערים");

  return (
    <div className="flex rtl">
      <button
        onClick={() => setSelected("ערים")}
        className={`px-4 py-2 font-semibold transition duration-200 border border-green-300
          ${selected === "ערים"
            ? "bg-green-700 text-white rounded-r-lg shadow-md"
            : "bg-white text-green-800 rounded-r-lg hover:bg-green-50"}`}
      >
        לפי ערים
      </button>
      <button
        onClick={() => setSelected("תאריך")}
        className={`px-4 py-2 font-semibold transition duration-200 border border-green-300
          ${selected === "תאריך"
            ? "bg-green-700 text-white rounded-l-lg shadow-md"
            : "bg-white text-green-800 rounded-l-lg hover:bg-green-50"}`}
      >
        לפי תאריך
      </button>
    </div>
  );
};

export default FilterButtons;