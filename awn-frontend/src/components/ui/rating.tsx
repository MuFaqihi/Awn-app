"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  className?: string;
}

export function Rating({
  value,
  onChange,
  max = 5,
  size = "md",
  readonly = false,
  className,
}: RatingProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (newValue: number) => {
    if (!readonly && onChange) {
      onChange(newValue);
    }
  };

  const handleMouseEnter = (newValue: number) => {
    if (!readonly) {
      setHoveredValue(newValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredValue(null);
    }
  };

  return (
    <div 
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isFilled = (hoveredValue || value) >= starValue;
        
        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            className={cn(
              "transition-colors duration-150",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-150",
                isFilled
                  ? "text-amber-500 fill-amber-500"
                  : "text-gray-300 hover:text-amber-400"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}