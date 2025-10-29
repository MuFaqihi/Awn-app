// src/app/[locale]/page.tsx
import type { Locale } from "@/lib/i18n";

// Sections (make sure these paths match your files)
import HeroSection from "@/components/hero-section";
    // or "@/components/features"
import ContentSection from "@/components/content-4";       // or "@/components/content-section"
import CallToAction from "@/components/call-to-action";


export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = (params.locale === "en" ? "en" : "ar") as "ar" | "en";

  return (
    <>
      <HeroSection locale={locale} />

      <ContentSection locale={locale} />
     
 
      <CallToAction locale={locale} />
    </>
  );
}