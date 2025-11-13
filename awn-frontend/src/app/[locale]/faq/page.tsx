import { Locale } from "@/lib/i18n";
import { Metadata } from "next";
import FAQs from "@/components/faqs";

interface FAQPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'ar' ? 'الأسئلة الشائعة - عون' : 'FAQ - Awn',
    description: locale === 'ar' 
      ? 'إجابات سريعة حول منصة عون للعلاج الطبيعي والمواعيد والخدمات'
      : 'Quick answers about Awn physiotherapy platform, appointments, and services',
  };
}

export default function FAQPage({ params }: FAQPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <FAQs locale={params.locale} />
      </div>
    </div>
  );
}