import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

type Locale = 'ar' | 'en';

export default function ContentSection({ locale = 'ar' }: { locale?: Locale }) {
  const isArabic = locale === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';
  const base = `/${locale}`;

  return (
    <section className="py-16 md:py-32" dir={dir}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-3xl font-semibold md:text-4xl">
            {isArabic
              ? 'عون تربط بين الأخصائيين والمرضى عبر منظومة موثوقة ومتكاملة.'
              : 'Awn connects therapists and patients through a trusted, integrated ecosystem.'}
          </h2>

        <div className="space-y-6 text-muted-foreground">
            <p>
              {isArabic
                ? 'عوْن ليست مجرد نظام حجز، بل منظومة رقمية تساعد الأخصائيين على إدارة جلساتهم وتساعد المرضى على إيجاد العلاج المناسب بسهولة وأمان.'
                : 'Awn is more than a booking system — it’s a digital ecosystem that helps therapists manage sessions and patients find trusted care easily and securely.'}
            </p>

            <p>
              {isArabic ? (
                <>
                  تدعم المنصة <span className="font-bold">التحقق من الترخيص</span>،{" "}
                  <span className="font-bold">تقويم ذكي للمواعيد</span>، ومحتوى{" "}
                  <span className="font-bold">توعوي</span> عن العلاج الطبيعي في السعودية.
                </>
              ) : (
                <>
                  The platform supports <span className="font-bold">license verification</span>,
                  a <span className="font-bold">smart scheduling calendar</span>, and{" "}
                  <span className="font-bold">educational content</span> to raise physiotherapy awareness in KSA.
                </>
              )}
            </p>

            <Button asChild variant="outline" size="sm" className="gap-1 pr-1.5">
              <Link href={`${base}/about#how-it-works`}>
                <span>{isArabic ? 'كيف تعمل عون؟' : 'How Awn Works'}</span>
                <ChevronRight className="size-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}