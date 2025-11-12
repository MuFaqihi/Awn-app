"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function AnimatedOTPInput({
  value,
  onChange,
  onComplete,
  maxLength = 6,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  maxLength?: number;
  className?: string;
}) {
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  function setAt(i: number, ch: string) {
    const next = (value.slice(0, i) + ch + value.slice(i + 1)).slice(0, maxLength);
    onChange(next);
    if (ch && i < maxLength - 1) refs.current[i + 1]?.focus();
    if (next.length === maxLength && !next.includes("_")) onComplete?.(next);
  }

  function onKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = value.slice(0, i) + "_" + value.slice(i + 1);
      onChange(next);
      if (i > 0) refs.current[i - 1]?.focus();
    }
  }

  React.useEffect(() => {
    // initialize only when the value is truly empty
    if (value === '') onChange('_'.repeat(maxLength));
    // DO NOT depend on `onChange` here; it causes a reset every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxLength, value]);

  const chars = (value || "_".repeat(maxLength)).slice(0, maxLength).split("");

  return (
    <div className={cn("flex gap-3", className)}>
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={ch.replace("_", "")}
          onChange={(e) => setAt(i, e.target.value.replace(/\D/g, "").slice(0, 1))}
          onKeyDown={(e) => onKey(i, e)}
          className={cn(
            // Match the form input styling
            "h-14 w-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-semibold",
            "focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
            "transition-all duration-200",
            "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-teal-400",
            // Add subtle shadow to match form inputs
            "shadow-sm",
            // Hover state
            "hover:border-gray-300 dark:hover:border-gray-500"
          )}
        />
      ))}
    </div>
  );
}