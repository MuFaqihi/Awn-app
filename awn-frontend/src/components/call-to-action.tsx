 // src/components/call-to-action.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Locale = 'ar' | 'en'

export default function CallToAction({ locale = 'ar' }: { locale?: Locale }) {
  const isAr = locale === 'ar'
  const dir = isAr ? 'rtl' : 'ltr'

  return (
    <section className="py-16 md:py-32" dir={dir}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            {isAr ? 'ابدأ رحلتك العلاجية مع عون' : 'Start your wellness journey with Awn'}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {isAr
              ? 'احجز جلستك مع أخصائي علاج طبيعي موثّق بسهولة وأمان.'
              : 'Book a session with a verified physiotherapist—safe, simple, and accessible.'}
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href={isAr ? '/ar/book' : '/en/book'}>
                <span>{isAr ? 'احجز الآن' : 'Book Now'}</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href={isAr ? '/ar/join' : '/en/join'}>
                <span>{isAr ? 'انضم كأخصائي' : 'Join as Therapist'}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}