'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ShieldCheck,
  CalendarCheck2,
  Video,
  Users,
  MessageSquareHeart,
  ChevronRight,
  BadgeCheck,
  MapPin,
  Lock,
} from 'lucide-react';

type Locale = 'ar' | 'en';

export default function ContentSection({ locale = 'ar' }: { locale?: Locale }) {
  const isAr = locale === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const base = `/${locale}`;

  const t = isAr
    ? {
        title: 'منظومة موثوقة تربطك بالعلاج الطبيعي المناسب',
        subtitle:
          'عوْن تساعدك على إيجاد الأخصائي المرخّص، حجز موعد يناسبك، ومعرفة تفاصيل الجلسة بوضوح — في العيادة، بالمنزل، أو أونلاين.',
        ctas: { primary: 'تصفّح الأخصائيين', secondary: 'تواصل معنا' },
        cards: [
          {
            icon: ShieldCheck,
            title: 'توثيق وترخيص موثوق',
            body: 'نُظهر فقط الأخصائيين المرخّصين ونبرز بياناتهم المهنية بوضوح.',
          },
          {
            icon: CalendarCheck2,
            title: 'مواعيد ذكية ومرنة',
            body: 'احجز وعدّل الموعد بسهولة من نفس المكان وبدون تعقيد.',
          },
          {
            icon: Video,
            title: 'جلسات واضحة الأنواع',
            body: 'في العيادة، منزلية، أو أونلاين مع تفاصيل المكان والمدة والسعر التقديري.',
          },
        ],
        badges: [
          { icon: BadgeCheck, label: 'مرخّصون ومُتحقَّق منهم' },
          { icon: MapPin, label: 'تغطية تتوسّع تدريجيًا في السعودية' },
          { icon: Lock, label: 'حجز آمن وتجربة واضحة' },
        ],
        cols: {
          patientsTitle: 'للمرضى',
          patients: [
            'بحث حسب الحالة والموقع والتفضيلات.',
            'مراجعات وتجارب مستخدمين حقيقية.',
            'تذكيرات وإشعارات بكل جديد.',
          ],
          therapistsTitle: 'للمختصّين',
          therapists: [
            'تقويم مدمج وإدارة مواعيد سهلة.',
            'صفحة تعريف مهنية تُبرز خبراتك.',
            'طلبات حجز واضحة ورسائل إرشادية.',
          ],
        },
        learnMore: 'اعرف أكثر عن عوْن',
      }
    : {
        title: 'A trusted way to access the right physiotherapy',
        subtitle:
          'Awn helps you discover licensed therapists, book at a time that suits you, and see session details upfront — at home visits, or online.',
        ctas: { primary: 'Browse Therapists', secondary: 'Contact Us' },
        cards: [
          {
            icon: ShieldCheck,
            title: 'Verified & licensed',
            body: 'Only licensed practitioners with transparent professional profiles.',
          },
          {
            icon: CalendarCheck2,
            title: 'Smart, flexible scheduling',
            body: 'Book and reschedule from one clean, simple interface.',
          },
          {
            icon: Video,
            title: 'Flexible session options',
            body: 'Choose between home visits and online consultations with transparent pricing and scheduling.',
          },
        ],
        badges: [
          { icon: BadgeCheck, label: 'Verified professionals' },
          { icon: MapPin, label: 'KSA coverage expanding' },
          { icon: Lock, label: 'Secure booking' },
        ],
        cols: {
          patientsTitle: 'For Patients',
          patients: [
            'Search by condition, location, and preferences.',
            'Authentic reviews and experiences.',
            'Reminders and updates for every step.',
          ],
          therapistsTitle: 'For Therapists',
          therapists: [
            'Built-in calendar and simple scheduling.',
            'Professional profile to showcase expertise.',
            'Clear booking requests and helpful guidance.',
          ],
        },
        learnMore: 'Learn more about Awn',
      };

  return (
    <section className="py-18 md:py-28" dir={dir}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">{t.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.subtitle}</p>

          {/* CTAs */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-[#013D5B] hover:bg-[#013D5B]/90">
              <Link href={`${base}/therapists`}>
                <Users className="size-4" />
                <span>{t.ctas.primary}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`${base}/contact`}>
                <MessageSquareHeart className="size-4" />
                <span>{t.ctas.secondary}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-3">
          {t.cards.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card
                key={i}
                className="group relative overflow-hidden border p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#013D5B] to-[#7ba5ab] opacity-70" />
                <div className="flex items-start gap-3">
                  <span className="grid size-10 place-items-center rounded-lg border bg-background">
                    <Icon className="size-5 text-[#013D5B]" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Trust badges (MVP-safe, no numbers) */}
        <div className="mt-10 grid gap-3 rounded-xl border bg-card/50 p-4 sm:grid-cols-3">
          {t.badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm"
              >
                <Icon className="size-4 text-[#013D5B]" />
                <span className="font-medium">{b.label}</span>
              </div>
            );
          })}
        </div>

        {/* Two columns: Patients / Therapists */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Patients */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold">{t.cols.patientsTitle}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {t.cols.patients.map((li, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-1.5 rounded-full bg-[#013D5B]" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Button asChild variant="ghost" className="gap-1 px-0">
                <Link href={`${base}/about#how-it-works`}>
                  {t.learnMore}
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Therapists */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold">{t.cols.therapistsTitle}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {t.cols.therapists.map((li, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-1.5 rounded-full bg-[#7ba5ab]" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Button asChild className="bg-[#7ba5ab] hover:bg-[#119f90]">
                  <Link href={`${base}/job-listing`}>
                    {isAr ? 'انضم كمختص' : 'Join as Therapist'}
                  </Link>
                </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}