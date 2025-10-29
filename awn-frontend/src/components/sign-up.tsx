'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatedOTPInput } from '@/components/ui/AnimatedOTPInput';

type Locale = 'ar' | 'en';

const AR = {
  title: 'إنشاء حساب في عون',
  subtitle: 'مرحبًا بك! أنشئ حسابك للبدء.',
  first: 'الاسم الأول',
  last: 'اسم العائلة',
  phone: 'رقم الجوال',
  password: 'كلمة المرور',
  signUp: 'إنشاء الحساب',
  haveAccount: 'لديك حساب مسبقًا؟',
  signIn: 'تسجيل الدخول',
  otpTitle:'أدخل رمز التحقق',
  otpHelp:'أرسلنا رمزًا مكوّنًا من 6 أرقام إلى جوالك.',
  resend:'إعادة الإرسال', back:'رجوع',
};
const EN = {
  title: 'Create your Awn account',
  subtitle: 'Welcome! Create an account to get started.',
  first: 'First name',
  last: 'Last name',
  phone: 'Phone number',
  password: 'Password',
  signUp: 'Sign Up',
  haveAccount: 'Already have an account?',
  signIn: 'Sign in',
  otpTitle:'Enter verification code',
  otpHelp:'We sent a 6-digit code to your phone.',
  resend:'Resend code', back:'Back',
};

export default function SignUpPage({ locale = 'ar' }: { locale?: Locale }) {
  const t = locale === 'ar' ? AR : EN;
  const isRTL = locale === 'ar';
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || `/${locale}/dashboard`;
  const [step, setStep] = React.useState<'form' | 'otp'>('form');
  const [otp, setOtp] = React.useState('');
  const [resendIn, setResendIn] = React.useState(0);

  React.useEffect(() => {
    if (step !== 'otp') return;
    setResendIn(30);
    const id = setInterval(() => setResendIn(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const phoneInput = form.querySelector<HTMLInputElement>('#phone');
    const phone = phoneInput?.value || '';

    router.push(`/${locale}/otp?next=${encodeURIComponent(next)}&phone=${encodeURIComponent(phone)}`);
  }
  
  function handleOtpComplete(code: string) {
    router.push(next);
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
      <form onSubmit={onSubmit} className="m-auto w-full max-w-[28rem] sm:max-w-md md:max-w-lg overflow-hidden rounded-2xl border bg-card shadow-md">
        <div className="bg-card -m-px rounded-2xl border p-8 sm:p-10">
          <div className="text-center">
            <Link href={`/${locale}`} aria-label="home" className="mx-auto block w-fit">
              <Logo />
            </Link>
            <h1 className="mb-1 mt-4 text-2xl font-semibold">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          {step === 'form' && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="block text-sm">{t.first}</Label>
                  <Input id="firstname" name="firstname" type="text" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">{t.last}</Label>
                  <Input id="lastname" name="lastname" type="text" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="block text-sm">{t.phone}</Label>
                <div className="flex">
                  <span className="inline-flex items-center justify-center rounded-s-md border bg-muted px-3 text-sm text-muted-foreground">+966</span>
                  <Input id="phone" name="phone" type="tel" required className="rounded-s-none" inputMode="tel" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm">{t.password}</Label>
                <Input id="password" name="password" type="password" required autoComplete="new-password" />
              </div>

              {/* Fixed: Moved submit button inside form section */}
              <Button type="submit" className="w-full h-11 text-base bg-[#013D5B] hover:bg-[#013D5B]/90">
                {t.signUp}
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="mt-8 space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold">{t.otpTitle}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t.otpHelp}</p>
              </div>
              <div className="flex justify-center">
                <AnimatedOTPInput value={otp} onChange={setOtp} onComplete={handleOtpComplete} maxLength={6} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setStep('form')} className="transition-colors text-muted-foreground hover:text-foreground">
                  {t.back}
                </button>
                <button
                  type="button"
                  disabled={resendIn > 0}
                  onClick={() => setResendIn(30)}
                  className="transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  {resendIn > 0 ? `${t.resend} (${resendIn})` : t.resend}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer link */}
        <div className="p-5">
          <p className="text-center text-sm text-accent-foreground">
            {t.haveAccount}{' '}
            <Link
              href={`/${locale}/login?next=${encodeURIComponent(next)}`}
              className="font-medium text-blue-600 transition-colors hover:text-blue-700 active:opacity-80"
            >
              {t.signIn}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}