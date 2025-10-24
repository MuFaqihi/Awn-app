"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export default function SearchBar({
  onSearch,
  locale,
}: {
  onSearch: (value: string) => void;
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const isArabic = locale === "ar";

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
      }}
      placeholder={isArabic ? "ابحث عن الأخصائي..." : "Search for a therapist..."}
      className="w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm outline-none focus:border-emerald-500"
    />
  );
}
