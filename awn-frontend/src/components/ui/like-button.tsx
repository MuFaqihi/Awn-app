"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LikeButton({
  children = "Like",
  className,
  initialLiked = false,
  onToggle,
}: { 
  children?: React.ReactNode; 
  className?: string;
  initialLiked?: boolean;
  onToggle?: (liked: boolean) => void;
}) {
  const [liked, setLiked] = React.useState(initialLiked);
  
  const handleClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    onToggle?.(newLiked);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm",
        liked ? "bg-rose-600 text-white border-rose-600" : "bg-background",
        className
      )}
    >
      <motion.span
        key={liked ? "♥" : "♡"}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 16 }}
        aria-hidden
      >
        {liked ? "♥" : "♡"}
      </motion.span>
      {children}
    </motion.button>
  );
}