// src/app/[locale]/page.tsx
import type { Locale } from "@/lib/i18n";

// Sections (make sure these paths match your files)
import HeroSection from "@/components/hero-section";
import Features from "@/components/features-12";           // or "@/components/features"
import ContentSection from "@/components/content-4";       // or "@/components/content-section"
import FAQs from "@/components/faqs";
import ContactSection from "@/components/contact";
import CallToAction from "@/components/call-to-action";

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = (params.locale === "en" ? "en" : "ar") as "ar" | "en";

  return (
    <>
      <HeroSection locale={locale} />
      <Features locale={locale} />
      <ContentSection locale={locale} />
      <FAQs locale={locale} />
      <ContactSection locale={locale} />
      <CallToAction locale={locale} />
    </>
  );
}