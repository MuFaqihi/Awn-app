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
  // ✅ تعريف الـ refs بشكل صحيح
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  function setAt(i: number, ch: string) {
    const next = (value.slice(0, i) + ch + value.slice(i + 1)).slice(0, maxLength);
    onChange(next);
    if (ch && i < maxLength - 1) refs.current[i + 1]?.focus();
    if (next.length === maxLength && !next.includes("_")) onComplete?.(next);
  }

  function onKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    // ✅ منع الحروف
    if (/^[A-Za-z]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // ✅ التعامل مع Backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = value.slice(0, i) + "_" + value.slice(i + 1);
      onChange(next);
      if (i > 0) refs.current[i - 1]?.focus();
    }
  }

  React.useEffect(() => {
    if (value === "") onChange("_".repeat(maxLength));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxLength, value]);

  const chars = (value || "_".repeat(maxLength)).slice(0, maxLength).split("");

  return (
    <div className={cn("flex gap-2", className)}>
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={ch.replace("_", "")}
          onChange={(e) => {
            const val = e.target.value;
            if (!/^\d?$/.test(val)) return; // ✅ يقبل رقم واحد فقط
            setAt(i, val);
          }}
          onKeyDown={(e) => onKey(i, e)}
          className={cn(
            "h-12 w-10 rounded-md border bg-background text-center text-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary transition"
          )}
        />
      ))}
    </div>
  );
}
