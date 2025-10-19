'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CalendarCheck2,
  Bolt,
  Users,
  HeartPulse,
  PlayCircle,
  Rocket,
} from 'lucide-react';

type Locale = 'ar' | 'en';

const dicts = {
  ar: {
    title: 'احجز جلسة علاج طبيعي بسهولة وثقة',
    subtitle:
      'منصّة موثوقة تربطك بمعالجين مرخّصين في السعودية جلسات منزلية أو في العيادة، بمواعيد واضحة و مجدولة.',
    ctaPrimary: 'ابدأ الحجز الآن',
    ctaTherapist: 'سجّل كمعالج',
    features: [
      { label: 'مواعيد مجدولة', icon: CalendarCheck2 },
      { label: 'جلسات فورية', icon: Bolt },
      { label: 'مجموعات دعم', icon: Users },
      { label: 'برامج علاجية', icon: HeartPulse },
      { label: 'ندوات مسجّلة', icon: PlayCircle },
    ],
  },
  en: {
    title: 'Book trusted physiotherapy with ease',
    subtitle:
      'Connect with licensed therapists in KSA — at home or in clinics, with clear scheduling and real reviews.',
    ctaPrimary: 'Start Booking',
    ctaTherapist: 'Sign up as Therapist',
    features: [
      { label: 'Scheduled sessions', icon: CalendarCheck2 },
      { label: 'Instant sessions', icon: Bolt },
      { label: 'Support groups', icon: Users },
      { label: 'Therapy programs', icon: HeartPulse },
      { label: 'Recorded webinars', icon: PlayCircle },
    ],
  },
} as const;

export default function HeroSection({ locale = 'ar' }: { locale?: Locale }) {
  const t = dicts[locale];
  const isRTL = locale === 'ar';

  return (
    <main className="overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="relative">
        {/* Subtle hero grid background */}
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
            {/* Heading */}
            <div className="text-center sm:mx-auto sm:w-10/12 lg:mx-auto lg:w-4/5">
              <h1 className="text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.15]">
                {t.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-slate-600 dark:text-slate-300">
                {t.subtitle}
              </p>

              {/* CTAs (centered) */}
              <div className="mt-8 flex items-center justify-center gap-3">
                {/* Primary booking CTA (filled dark blue) */}
                <Button
                  size="lg"
                  asChild
                  className="bg-[#013D5B] hover:bg-[#013D5B]/90 active:translate-y-[1px]"
                >
                  <Link href={`/${locale}/book`}>
                    <Rocket className="size-4" />
                    <span className="text-nowrap">{t.ctaPrimary}</span>
                  </Link>
                </Button>

                {/* Therapist signup (FILLED, no lines showing) */}
                <Button
                  size="lg"
                  asChild
                  className="bg-[#7ba5ab] text-white hover:bg-[#119f90] active:translate-y-[1px]
                             shadow-sm hover:shadow-[0_8px_30px_rgba(20,184,166,.35)]"
                >
                  <Link href={`/${locale}/signup?role=therapist`}>{t.ctaTherapist}</Link>
                </Button>
              </div>
            </div>

            {/* Feature strip */}
            <div className="mx-auto mt-12 max-w-5xl">
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {t.features.map(({ label, icon: Icon }, i) => (
                  <li
                    key={i}
                    className="group flex flex-col items-center rounded-xl px-3 py-5 text-center transition
                               hover:-translate-y-1 hover:shadow-[0_12px_40px_-10px_rgba(1,61,91,.25)]
                               dark:hover:shadow-[0_12px_40px_-10px_rgba(255,255,255,.12)]"
                  >
                    {/* Glossy icon puck */}
                    <div className="relative mb-3 grid place-items-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/70 to-white/20 blur-sm dark:from-white/15 dark:to-transparent" />
                      <div className="relative grid size-14 place-items-center rounded-full border
                                      bg-gradient-to-b from-white to-white/70
                                      shadow-sm backdrop-blur
                                      dark:border-white/10 dark:from-white/10 dark:to-white/5">
                        <Icon className="size-6 text-[#013D5B] dark:text-white" />
                      </div>
                    </div>
                    <span className="text-sm">{label}</span>
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