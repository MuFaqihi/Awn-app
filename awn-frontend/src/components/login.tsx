'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatedOTPInput } from '@/components/ui/AnimatedOTPInput';

const BRAND = '#013D5B';

type Locale = 'ar' | 'en';
type Dict = {
  title: string; subtitle: string;
  phoneLabel: string; phonePlaceholder: string;
  passwordLabel: string; forgot: string; signIn: string;
  noAccount: string; create: string;
  otpTitle: string; otpHelp: string; resend: string; back: string;
};

const AR: Dict = {
  title:'تسجيل الدخول إلى عون',
  subtitle:'مرحبًا بعودتك! سجّل دخولك للمتابعة.',
  phoneLabel:'رقم الجوال', phonePlaceholder:'55x xxx xxxx',
  passwordLabel:'كلمة المرور', forgot:'نسيت كلمة المرور؟', signIn:'تسجيل الدخول',
  noAccount:'ليس لديك حساب؟', create:'إنشاء حساب',
  otpTitle:'أدخل رمز التحقق',
  otpHelp:'أرسلنا رمزًا مكوّنًا من 6 أرقام إلى جوالك.',
  resend:'إعادة الإرسال', back:'رجوع',
};
const EN: Dict = {
  title:'Sign in to Awn',
  subtitle:'Welcome back! Sign in to continue.',
  phoneLabel:'Phone number', phonePlaceholder:'55x xxx xxxx',
  passwordLabel:'Password', forgot:'Forgot your password?', signIn:'Sign in',
  noAccount:"Don't have an account?", create:'Create account',
  otpTitle:'Enter verification code',
  otpHelp:'We sent a 6-digit code to your phone.',
  resend:'Resend code', back:'Back',
};

export default function LoginPage({
  locale = 'ar',
  dict,
  inline = false, // Add this prop
  onSuccess, // Add this prop too
}: { 
  locale?: Locale; 
  dict?: Partial<Dict>;
  inline?: boolean; // Add this type
  onSuccess?: () => void; // Add this type
}) {
  const t: Dict = { ...(locale === 'ar' ? AR : EN), ...(dict || {}) };
  const isRTL = locale === 'ar';
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || `/${locale}/dashboard`;

  const [step, setStep] = React.useState<'form' | 'otp'>('form');
  const [otp, setOtp] = React.useState('');
  const [resendIn, setResendIn] = React.useState(0);
  const canVerify = /^\d{6}$/.test(otp);


  React.useEffect(() => {
    if (step !== 'otp') return;
    setResendIn(30);
    const id = setInterval(() => setResendIn(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step]);

function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (inline) { onSuccess?.(); return; }

  const form = e.currentTarget as HTMLFormElement;
  const phoneInput = form.querySelector<HTMLInputElement>('#phone'); // adjust id if different
  const phone = phoneInput?.value || '';
  router.push(`/${locale}/otp?next=${encodeURIComponent(next)}&phone=${encodeURIComponent(phone)}`);
}

function handleOtpComplete(v: string) {
  // TODO: verify OTP server-side if needed
  router.push(next);
}

  return (
    <section dir={isRTL ? 'rtl' : 'ltr'} className="flex min-h-screen bg-zinc-50 dark:bg-transparent px-4 py-16 md:py-24">
      <form
        onSubmit={onSubmit}
        className="m-auto w-full max-w-[28rem] sm:max-w-md md:max-w-lg overflow-hidden rounded-2xl border bg-card shadow-md"
      >
        <div className="bg-card -m-px rounded-2xl border p-8 sm:p-10">
          <div className="text-center">
            <Link href={`/${locale}`} aria-label="home" className="mx-auto block w-fit">
              <Logo />
            </Link>
            <h1 className="mt-2 text-2xl font-semibold">{t.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          {step === 'form' && (
            <div className="mt-8 space-y-6">
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="block text-sm">{t.phoneLabel}</Label>
                <div className="flex">
                  <span className="inline-flex items-center justify-center rounded-s-md border bg-muted px-3 text-sm text-muted-foreground">+966</span>
                  <Input id="phone" name="phone" type="tel" required className="rounded-s-none" placeholder={t.phonePlaceholder} autoComplete="username" inputMode="tel" />
                </div>
              </div>

              {/* Password + Forgot under field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">{t.passwordLabel}</Label>
                <Input id="password" name="password" type="password" required autoComplete="current-password" />
                <div className="mt-1 flex">
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="ms-auto text-xs text-muted-foreground transition-colors hover:text-foreground active:opacity-80"
                  >
                    {t.forgot}
                  </Link>
                </div>
              </div>

              {/* Primary submit */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                style={{ backgroundColor: BRAND }}
              >
                {t.signIn}
              </Button>

              {/* Secondary: Create account (button) */}
              <Button asChild variant="outline" className="w-full h-11 text-base">
                <Link href={`/${locale}/signup?next=${encodeURIComponent(next)}`}>{t.create}</Link>
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

        {/* Footer link kept for familiarity */}
        <div className="p-5">
          <p className="text-center text-sm text-accent-foreground">
            {t.noAccount}{' '}
            <Link
              href={`/${locale}/signup?next=${encodeURIComponent(next)}`}
              className="font-medium text-[oklch(45%_0.08_240)] transition-colors hover:text-[oklch(55%_0.1_240)] active:opacity-80"
            >
              {t.create}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}