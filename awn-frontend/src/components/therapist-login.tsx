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
  title: 'تسجيل دخول الأخصائي',
  subtitle: 'مرحبًا بك! سجّل دخولك لإدارة ملفك المهني.',
  emailLabel: 'البريد الإلكتروني',
  emailPlaceholder: 'example@email.com',
  passwordLabel: 'كلمة المرور',
  forgot: 'نسيت كلمة المرور؟',
  signIn: 'تسجيل الدخول',
  noAccount: 'ليس لديك حساب؟',
  create: 'التسجيل كأخصائي',
};

const EN: Dict = {
  title: 'Therapist Sign In',
  subtitle: 'Welcome back! Sign in to manage your professional profile.',
  emailLabel: 'Email address',
  emailPlaceholder: 'example@email.com',
  passwordLabel: 'Password',
  forgot: 'Forgot your password?',
  signIn: 'Sign in',
  noAccount: "Don't have an account?",
  create: 'Register as Therapist',
};

export default function TherapistLoginPage({
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

  // Final redirect
  const next = sp.get('next') || `/${locale}/therapist-dashboard`;

  const [showPassword, setShowPassword] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Save login credentials
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("authToken", "therapist_token_" + Date.now());
    localStorage.setItem("userType", "therapist");

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
        {/* Header Section */}
        <div className="bg-primary/65 backdrop-blur-md border-b border-primary/25 dark:bg-primary/70 dark:border-primary/30 px-8 py-6">
          <div className="text-center">
            <Link href={`/${locale}`} aria-label="home" className="mx-auto block w-fit">
              <Logo className="text-white" />
            </Link>
            <h1 className="mb-2 mt-4 text-2xl font-bold text-white">{t.title}</h1>
            <p className="text-sm text-primary-foreground/90">{t.subtitle}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-8 py-8">
          <div className="space-y-6">

            {/* Email */}
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
                />
              </div>
            </div>

            {/* Password */}
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
                  href={`/${locale}/therapist/forgot-password`}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  {t.forgot}
                </Link>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 text-base border-2 border-primary text-primary hover:bg-primary/10 rounded-xl transition-all duration-200"
            >
              {t.signIn}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-8 py-6 border-t border-gray-100 dark:border-gray-600">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            {t.noAccount}{' '}
            <Link
              href={`/${locale}/job-listing`}
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