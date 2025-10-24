import type { Locale } from '@/lib/i18n';
import Link from 'next/link';

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const ar = params.locale === 'ar';
  const base = `/${params.locale}`;
  const t = ar
    ? {
        h1: 'عن عون',
        intro: 'عون تربط المرضى بأخصائيي العلاج الطبيعي المرخّصين في الرياض مع حجز سهل وملفات موثوقة.',
        hHow: 'كيف تعمل عون؟',
        pHow: 'للمرضى: تصفّح الأخصائيين، اطّلع على الخبرات والتوفر، ثم احجز فورًا مع تذكيرات. للأخصائي: أنشئ ملفك، وثّق بياناتك، وأدر جدولك.',
        hTrust: 'الثقة والسلامة',
        pTrust: 'نركّز على التحقق من الترخيص، مراجعات ما بعد الجلسة، والخصوصية. التحقق بالهوية سيُفعّل تدريجيًا.',
        hCoverage: 'النطاق الجغرافي',
        pCoverage: 'نغطّي الرياض أولًا، مع التوسّع لاحقًا.',
        cta1: 'احجز جلسة',
        cta2:'انضم كمختص',
      }
    : {
        h1: 'About Awn',
        intro: 'Awn connects patients with licensed physiotherapists in Riyadh, offering trusted profiles and easy booking.',
        hHow: 'How Awn Works',
        pHow: 'Patients: browse therapists, check expertise & availability, then book with reminders. Therapists: create profile, verify, and manage your schedule.',
        hTrust: 'Trust & Safety',
        pTrust: 'We focus on license verification, post-session reviews, and privacy. ID verification will roll out in phases.',
        hCoverage: 'Coverage',
        pCoverage: 'Riyadh first, expanding soon.',
        cta1: 'Start Booking',
        cta2: 'Join as Therapist',
      };

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 md:py-20 space-y-12" dir={ar ? 'rtl' : 'ltr'}>
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold md:text-4xl">{t.h1}</h1>
        <p className="text-muted-foreground">{t.intro}</p>
      </header>

      <section id="how-it-works" className="space-y-3 scroll-mt-24">
        <h2 className="text-2xl font-medium">{t.hHow}</h2>
        <p className="text-muted-foreground">{t.pHow}</p>
      </section>

      <section id="trust" className="space-y-3">
        <h2 className="text-2xl font-medium">{t.hTrust}</h2>
        <p className="text-muted-foreground">{t.pTrust}</p>
      </section>

      <section id="coverage" className="space-y-3">
        <h2 className="text-2xl font-medium">{t.hCoverage}</h2>
        <p className="text-muted-foreground">{t.pCoverage}</p>
      </section>

      <div className="flex flex-wrap gap-3 pt-4">
        <Link
          href={`${base}/therapists`}
          className="inline-flex items-center rounded-md bg-[#013D5B] px-4 py-2 text-white hover:bg-[#013D5B]/90 active:translate-y-[1px]"
        >
          {t.cta1}
        </Link>
        <Link
          href={`${base}/signup?role=therapist`}
          className="inline-flex items-center rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600 active:translate-y-[1px]"
        >
          {t.cta2}
        </Link>
      </div>
    </section>
  );
}