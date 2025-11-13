'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
};

export default function LoginPage({
  locale = 'ar',
  dict,
}: { 
  locale?: Locale; 
  dict?: Partial<Dict>;
}) {
  const t: Dict = { ...(locale === 'ar' ? AR : EN), ...(dict || {}) };
  const isRTL = locale === 'ar';
  const router = useRouter();
  const sp = useSearchParams();

  const role = sp.get('role') || 'patient';

  const next =
    sp.get('next') ||
    (role === 'therapist'
      ? `/${locale}/therapist-dashboard`
      : `/${locale}/dashboard`);

  const [showPassword, setShowPassword] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Save login token
    localStorage.setItem('authToken', 'client_token_' + Date.now());
    localStorage.setItem('isLoggedIn', 'true');

    // Redirect directly to dashboard
    router.push(next);
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
        <div className="bg-primary/65 border-b border-primary/25 px-8 py-6">
          <div className="text-center">
            <Link href={`/${locale}`} aria-label="home" className="mx-auto block w-fit">
              <Logo className="text-white" />
            </Link>
            <h1 className="mb-2 mt-4 text-2xl font-bold text-white">{t.title}</h1>
            <p className="text-sm text-primary-foreground/90">{t.subtitle}</p>
          </div>
        </div>

        <div className="px-8 py-8">
          <div className="space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
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
                  className="h-12 pl-10 rounded-xl"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t.passwordLabel}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="h-12 pr-10 rounded-xl"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  href={`/${locale}/forgot-password`}
                  className="text-sm text-primary"
                >
                  {t.forgot}
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full h-12 text-base border-2 border-primary text-primary">
              {t.signIn}
            </Button>
          </div>
        </div>

        <div className="p-5">
          <p className="text-center text-sm">
            {t.noAccount}{' '}
            <Link
              href={`/${locale}/signup?next=${encodeURIComponent(next)}`}
              className="font-medium text-blue-600"
            >
              {t.create}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}