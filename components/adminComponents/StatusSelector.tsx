"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
const status = [
  { value: "not-treated-or-empty", label: "לא טופל", color: "bg-red-400" },
  { value: "", label: "הכל", color: "bg-myColor_orange" },
  { value: "טופל", label: "טופל", color: "bg-green-300" },
  { value: "בטיפול", label: "בטיפול", color: "bg-amber-200" },
];
interface SelectingStatusProps {
  handleStatus: (value: string) => void;
}
const StatusSelector = ({ handleStatus }: SelectingStatusProps) => {
  const [selectedButton, setSelectedButton] = useState<string>(
    "not-treated-or-empty"
  );
  return (
    <div className="m-4">
      {status.map((item) => (
        <Button
          onClick={() => {
            handleStatus(item.value);
            setSelectedButton(item.value);
          }}
          className={`m-2 p-2 font-bold ${
            selectedButton === item.value ? "bg-myColor_pink text-white" : item.color
          }`}
          key={item.value}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default StatusSelector;
