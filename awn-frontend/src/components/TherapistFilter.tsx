"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type Filters = { gender: string; specialty: string; session: string };

export default function TherapistFilter({
  onFilter,
  locale,
}: {
  onFilter: (f: Filters) => void;
  locale: Locale;
}) {
  const [gender, setGender] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [session, setSession] = useState("");
  const isArabic = locale === "ar"; // ✅ اللغة

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      <select
        className="border rounded-md px-3 py-2"
        value={gender}
        onChange={(e) => {
          const v = e.target.value;
          setGender(v);
          onFilter({ gender: v, specialty, session });
        }}
      >
        <option value="">{isArabic ? "الجنس: الكل" : "Gender: All"}</option>
        <option value="male">{isArabic ? "ذكر" : "Male"}</option>
        <option value="female">{isArabic ? "أنثى" : "Female"}</option>
      </select>

      <select
        className="border rounded-md px-3 py-2"
        value={specialty}
        onChange={(e) => {
          const v = e.target.value;
          setSpecialty(v);
          onFilter({ gender, specialty: v, session });
        }}
      >
      <option value="">{isArabic ? "التخصص: الكل" : "Specialty: All"}</option>
      <option value="sports">{isArabic ? "إصابات رياضية" : "Sports"}</option>
      <option value="general">{isArabic ? "علاج طبيعي عام" : "General Physical Therapy"}</option>
      <option value="orthopedic">{isArabic ? "عظام" : "Orthopedic"}</option>
      <option value="women">{isArabic ? "نساء" : "Women"}</option>
      <option value="geriatrics">{isArabic ? "مسنين" : "Geriatrics"}</option>
      </select>

      <select
        className="border rounded-md px-3 py-2"
        value={session}
        onChange={(e) => {
          const v = e.target.value;
          setSession(v);
          onFilter({ gender, specialty, session: v });
        }}
      >
        <option value="">{isArabic ? "نوع الجلسة: الكل" : "Session: All"}</option>
        <option value="home">{isArabic ? "منزلية" : "At Home"}</option>
        <option value="online">{isArabic ? "أونلاين" : "Online"}</option>
      </select>

      <button
        onClick={() => {
          setGender("");
          setSpecialty("");
          setSession("");
          onFilter({ gender: "", specialty: "", session: "" });
        }}
        className="border rounded-md px-3 py-2"
      >
        {isArabic ? "إعادة تعيين" : "Reset"}
      </button>
    </div>
  );
}
