"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname(); // e.g. /ar/therapists or /en/therapists
  const other = locale === "ar" ? "en" : "ar";

  function switchLocale() {
    if (!pathname) return;
    const parts = pathname.split("/");
    parts[1] = other; // replace /ar with /en or vice versa
    router.push(parts.join("/"));
  }

  return (
    <button
      onClick={switchLocale}
      className="rounded-md border px-3 py-1 text-sm hover:bg-teal-50"
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      {locale === "ar" ? "EN" : "AR"}
    </button>
  );
}