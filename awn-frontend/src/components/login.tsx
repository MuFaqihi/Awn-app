'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatedOTPInput } from '@/components/ui/AnimatedOTPInput';
import { Mail, Eye, EyeOff } from 'lucide-react';

type Locale = 'ar' | 'en';
type Dict = {
  title: string; 
  subtitle: string;
  emailLabel: string; 
  emailPlaceholder: string;
  passwordLabel: string; 
  forgot: string; 
  signIn: string;
  noAccount: string; 
  create: string;
  otpTitle: string; 
  otpHelp: string; 
  resend: string; 
  back: string;
};

const AR: Dict = {
  title: 'تسجيل الدخول إلى عون',
  subtitle: 'مرحبًا بعودتك! سجّل دخولك للمتابعة.',
  emailLabel: 'البريد الإلكتروني', 
  emailPlaceholder: 'example@email.com',
  passwordLabel: 'كلمة المرور', 
  forgot: 'نسيت كلمة المرور؟', 
  signIn: 'تسجيل الدخول',
  noAccount: 'ليس لديك حساب؟', 
  create: 'إنشاء حساب',
  otpTitle: 'أدخل رمز التحقق',
  otpHelp: 'أرسلنا رمزًا مكوّنًا من 6 أرقام إلى بريدك الإلكتروني.',
  resend: 'إعادة الإرسال', 
  back: 'رجوع',
};

const EN: Dict = {
  title: 'Sign in to Awn',
  subtitle: 'Welcome back! Sign in to continue.',
  emailLabel: 'Email address', 
  emailPlaceholder: 'example@email.com',
  passwordLabel: 'Password', 
  forgot: 'Forgot your password?', 
  signIn: 'Sign in',
  noAccount: "Don't have an account?", 
  create: 'Create account',
  otpTitle: 'Enter verification code',
  otpHelp: 'We sent a 6-digit code to your email.',
  resend: 'Resend code', 
  back: 'Back',
};

export default function LoginPage({
  locale = 'ar',
  dict,
  inline = false,
  onSuccess,
}: { 
  locale?: Locale; 
  dict?: Partial<Dict>;
  inline?: boolean;
  onSuccess?: () => void;
}) {
  const t: Dict = { ...(locale === 'ar' ? AR : EN), ...(dict || {}) };
  const isRTL = locale === 'ar';
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || `/${locale}/dashboard`;

  const [step, setStep] = React.useState<'form' | 'otp'>('form');
  const [otp, setOtp] = React.useState('');
  const [resendIn, setResendIn] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');

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
    const emailInput = form.querySelector<HTMLInputElement>('#email');
    const emailValue = emailInput?.value || '';
    setEmail(emailValue);
    
    // Store auth data temporarily
    localStorage.setItem('userEmail', emailValue);
    localStorage.setItem('userType', 'client');
    
    // Move to OTP step instead of redirecting
    setStep('otp');
  }

  function handleOtpComplete(code: string) {
    // Store auth token (in real app, verify OTP first)
    localStorage.setItem('authToken', 'client_token_' + Date.now());
    
    // Navigate to dashboard
    router.push(next);
  }

  function handleResendOtp() {
    setResendIn(30);
    // TODO: Call API to resend OTP to email
    console.log('Resending OTP to:', email);
  }

  return (
    <section 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className="flex min-h-screen bg-gray-50 px-4 py-8 md:py-16 dark:bg-gray-900"
    >
      <form
        onSubmit={onSubmit}
        className="m-auto w-full max-w-[28rem] md:max-w-[36rem] overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="bg-primary/65 backdrop-blur-md border-b border-primary/25 dark:bg-primary/70 dark:border-primary/30 px-8 py-6">
          <div className="text-center">
            <Link href={`/${locale}`} aria-label="home" className="mx-auto block w-fit">
              <Logo className="text-white" />
            </Link>
            <h1 className="mb-2 mt-4 text-2xl font-bold text-white">{t.title}</h1>
            <p className="text-sm text-primary-foreground/90">{t.subtitle}</p>
          </div>
        </div>

        <div className="px-8 py-8">
          {step === 'form' && (
            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t.emailLabel}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={t.emailPlaceholder}
                    className="h-12 pl-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-600"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t.passwordLabel}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="h-12 pr-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-600"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {t.forgot}
                  </Link>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md transition-all duration-200"
              >
                {t.signIn}
              </Button>

              {/* Create Account Button */}
              <Button 
                asChild 
                variant="outline" 
                className="w-full h-12 text-base border-2 border-primary text-primary hover:bg-primary/10 rounded-xl transition-all duration-200"
              >
                <Link href={`/${locale}/signup?next=${encodeURIComponent(next)}`}>
                  {t.create}
                </Link>
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.otpTitle}</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t.otpHelp}</p>
                {email && (
                  <p className="mt-1 text-sm text-gray-500 break-words">
                    <span className="font-medium">{email}</span>
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <AnimatedOTPInput 
                  value={otp} 
                  onChange={setOtp} 
                  onComplete={handleOtpComplete} 
                  maxLength={6} 
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <button 
                  type="button" 
                  onClick={() => setStep('form')} 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  disabled={resendIn > 0}
                  onClick={handleResendOtp}
                  className="text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendIn > 0 ? `${t.resend} (${resendIn})` : t.resend}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer link */}
        <div className="bg-gray-50 dark:bg-gray-700 px-8 py-6 border-t border-gray-100 dark:border-gray-600">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            {t.noAccount}{' '}
            <Link
              href={`/${locale}/signup?next=${encodeURIComponent(next)}`}
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {t.create}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}