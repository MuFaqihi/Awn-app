"use client";

import { use } from "react";  
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import TeamSection from "@/components/team";
import SearchBar from "@/components/SearchBar";
import TherapistFilter from "@/components/TherapistFilter";

export default function TherapistsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ gender: "", specialty: "", session: "" });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} locale={locale} />
      </div>

      <div className="mb-6">
        <TherapistFilter onFilter={setFilters} locale={locale} />
      </div>

      <TeamSection locale={locale} searchQuery={searchQuery} filters={filters} />
    </div>
  );
}
