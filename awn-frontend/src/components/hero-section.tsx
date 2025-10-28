'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CalendarCheck2, Stethoscope } from 'lucide-react';

type Locale = 'ar' | 'en';

const content = {
  ar: {
    title: 'احجز جلسة علاج طبيعي بسهولة وثقة',
    subtitle:
      'تجعل عَون العلاج الطبيعي متاحًا للجميع. اكتشف الأخصائيين المرخّصين، واحجز الجلسات التي تناسب جدولك، وابدأ رحلة تعافٍ واثقة — كل ذلك في مكان واحد.',
    ctaPrimary: 'تصفّح المختصّين',
    ctaTherapist: 'دخول المختصّ',
    // 👇 Three strong, “real” highlights (edit the copy to match your doc wording)
    highlights: [
      {
        title: 'أخصائيون مرخّصون',
        desc: 'تحقق وترخيص مهني ساري (SCFHS) مع ملفات موثقة وخبرة واضحة.',
        icon: ShieldCheck,
      },
      {
        title: 'مواعيد منظمة وسريعة',
        desc: 'إتاحة فورية مع جدول واضح، وإدارة سهلة للتعديل أو الإلغاء.',
        icon: CalendarCheck2,
      },
      {
        title: 'خطة علاج مخصّصة',
        desc: 'جلسات في العيادة أو منزلية (الرياض) مع توصيات وتمارين بيتية.',
        icon: Stethoscope,
      },
    ],
    toTherapists: (l: string) => `/${l}/therapists`,
    toTherapistLogin: (l: string) => `/${l}/login?role=therapist`,
  },
  en: {
    title: 'Book trusted physiotherapy with ease',
    subtitle:
      'ʿAwn makes physical therapy accessible for everyone. Discover licensed therapists, book sessions that fit your routine, and gain the confidence to continue your recovery journey .',
    ctaPrimary: 'Browse therapists',
    ctaTherapist: 'Therapist sign-in',
    highlights: [
      {
        title: 'Licensed & verified',
        desc: 'Active SCFHS licensure with verified profiles and transparent experience.',
        icon: ShieldCheck,
      },
      {
        title: 'Organized, fast scheduling',
        desc: 'Immediate availability, clear calendar, easy reschedule/cancel.',
        icon: CalendarCheck2,
      },
      {
        title: 'Personalized care plan',
        desc: 'Clinic or Riyadh home visits with tailored exercises and follow-ups.',
        icon: Stethoscope,
      },
    ],
    toTherapists: (l: string) => `/${l}/therapists`,
    toTherapistLogin: (l: string) => `/${l}/login?role=therapist`,
  },
} as const;

export default function HeroSection({ locale = 'ar' }: { locale?: Locale }) {
  const t = content[locale];
  const isRTL = locale === 'ar';

  return (
    <main className="overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="relative">
        {/* soft grid bg */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70 dark:opacity-30"
          style={{
            maskImage: 'radial-gradient(ellipse at 50% 30%, black 65%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 65%, transparent 90%)',
            backgroundImage:
              'linear-gradient(to bottom, transparent 96%, rgba(148,163,184,.35) 96%), linear-gradient(to right, transparent 96%, rgba(148,163,184,.35) 96%)',
            backgroundSize: '24px 40px',
          }}
        />

        <div className="relative pt-20 md:pt-24 pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            {/* heading */}
            <div className="text-center sm:mx-auto sm:w-10/12 lg:mx-auto lg:w-4/5">
              <h1 className="text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.15]">
                {t.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-slate-600 dark:text-slate-300">
                {t.subtitle}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button
                  size="lg"
                  asChild
                  className="bg-[#013D5B] hover:bg-[#013D5B]/90 active:translate-y-[1px]"
                >
                  <Link href={t.toTherapists(locale)}>{t.ctaPrimary}</Link>
                </Button>

                <Button
                  size="lg"
                  asChild
                  className="bg-[#7ba5ab] text-white hover:bg-[#119f90] active:translate-y-[1px]
                             shadow-sm hover:shadow-[0_8px_30px_rgba(20,184,166,.35)]"
                >
                  <Link href={t.toTherapistLogin(locale)}>{t.ctaTherapist}</Link>
                </Button>
              </div>
            </div>

            {/* three highlight cards */}
            <div className="mx-auto mt-14 max-w-6xl">
              <ul className="grid gap-5 sm:grid-cols-3">
                {t.highlights.map(({ title, desc, icon: Icon }, i) => (
                  <li
                    key={i}
                    className="group relative rounded-2xl border bg-white/80 p-6 shadow-sm backdrop-blur
                               transition hover:-translate-y-1 hover:shadow-[0_16px_50px_-12px_rgba(1,61,91,.25)]
                               dark:bg-white/5 dark:border-white/10"
                  >
                    <div className="mb-4 inline-grid size-12 place-items-center rounded-xl border
                                    bg-white shadow-sm dark:bg-white/10 dark:border-white/10">
                      <Icon className="size-6 text-[#013D5B] dark:text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}