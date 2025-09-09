import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
  textClassName?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "טוען...",
  className,
  textClassName,
}) => {
  return (
    <div className={cn("w-full flex flex-col items-center justify-center gap-4 py-10", className)}>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-red-500"></div>
      {text && (
        <p className={cn("text-pink-700 font-semibold text-sm", textClassName)}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;