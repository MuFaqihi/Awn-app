'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedOTPInput } from '@/components/ui/AnimatedOTPInput';

export default function OtpPage() {
  const params = useParams<{ locale: Locale }>();
  const locale = params.locale;
  const isAr = locale === 'ar';

  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || `/${locale}/dashboard`;
  const phone = sp.get('phone') || '';

  const [otp, setOtp] = React.useState('');
  const [verifying, setVerifying] = React.useState(false);

  const handleComplete = (fullCode: string) => {
    setVerifying(true);
    // TODO: replace with real verification
    setTimeout(() => {
      router.replace(next);
    }, 500);
  };

  const digitsFilled = otp && !otp.includes('_') && otp.length >= 6;

  return (
    <section
      dir={isAr ? 'rtl' : 'ltr'}
      className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-transparent"
    >
      <Card className="w-full max-w-md p-6 sm:p-8">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">{isAr ? 'تحقق من الرمز' : 'Verify the code'}</h1>
          <p className="text-sm text-muted-foreground">
            {isAr ? 'أدخل الرمز المكوّن من 6 أرقام المرسل إلى جوالك' : 'Enter the 6-digit code sent to your phone'}
            {phone ? ` (${phone})` : null}
          </p>
        </header>

        <div className="mt-6 flex justify-center">
          <AnimatedOTPInput value={otp} onChange={setOtp} onComplete={handleComplete} maxLength={6} />
        </div>

        <div className="mt-6 grid gap-3">
          <Button className="h-11" disabled={!digitsFilled || verifying} onClick={() => handleComplete(otp)}>
            {verifying ? (isAr ? 'جاري التحقق…' : 'Verifying…') : (isAr ? 'تأكيد' : 'Confirm')}
          </Button>
          <Button variant="outline" className="h-11" type="button">
            {isAr ? 'إعادة إرسال الرمز' : 'Resend code'}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isAr ? 'أدخلت رقمًا خاطئًا؟' : 'Used the wrong number?'}{' '}
          <Link href={`/${locale}/login`} className="font-medium text-primary transition-colors hover:opacity-90 active:opacity-80">
            {isAr ? 'العودة لتسجيل الدخول' : 'Back to login'}
          </Link>
        </p>
      </Card>
    </section>
  );
}