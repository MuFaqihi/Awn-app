// src/components/call-to-action.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ShieldCheck,
  CalendarCheck2,
  Home,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'

type Locale = 'ar' | 'en';

export default function CallToAction({ locale = 'ar' }: { locale?: Locale }) {
  const isAr = locale === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const base = `/${locale}`;

  const t = isAr
    ? {
        title: 'ابدأ رحلتك العلاجية بثقة',
        subtitle:
          'ابحث عن الأخصائي المرخّص المناسب لك واحجز موعدك بسهولة — في العيادة، بالمنزل، أو أونلاين.',
        primary: 'ابدأ الحجز الآن',
        secondary: 'تسجيل دخول المختصّين',
        fine: 'لا حاجة لتطبيق — كل شيء من متصفحك.',
      }
    : {
        title: 'Start your care with confidence',
        subtitle:
          'Find a licensed therapist and book in minutes — in-clinic, at home, or online.',
        primary: 'Start booking',
        secondary: 'Therapist sign-in',
        fine: 'No app required — everything in your browser.',
      };

  return (
    <section dir={dir} className="relative overflow-hidden py-16 md:py-28">
      {/* soft gradient bg */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(65%_50%_at_50%_0%,rgba(1,61,91,0.12),transparent_70%)]"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold leading-tight md:text-5xl">{t.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{t.subtitle}</p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[#013D5B] hover:bg-[#013D5B]/90 active:translate-y-px"
            >
              <Link href={`${base}/therapists`}>
                <span>{t.primary}</span>
                {isAr ? (
                  <ChevronLeft className="ms-1 size-4" />
                ) : (
                  <ChevronRight className="ms-1 size-4" />
                )}
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="backdrop-blur-sm"
              title={t.secondary}
            >
              <Link href={`${base}/login?role=therapist`}>{t.secondary}</Link>
            </Button>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">{t.fine}</p>
        </div>
      </div>
    </section>
  );
}
