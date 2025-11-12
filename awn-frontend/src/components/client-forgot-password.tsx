'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';

type Locale = 'ar' | 'en';

const AR = {
  title: 'استعادة كلمة المرور',
  subtitle: 'أدخل بريدك الإلكتروني لإرسال رابط الاستعادة.',
  email: 'البريد الإلكتروني',
  placeholder: 'example@email.com',
  send: 'إرسال رابط الاستعادة',
  note: 'سنرسل لك رابطًا لإعادة تعيين كلمة المرور.',
  remember: 'تذكّرت كلمة المرور؟',
  login: 'تسجيل الدخول',
  back: 'العودة لتسجيل الدخول',
  success: 'تم الإرسال!',
  successMessage: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
  checkEmail: 'تحقق من بريدك الإلكتروني واتبع التعليمات.',
};

const EN = {
  title: 'Recover Password',
  subtitle: 'Enter your email to receive a reset link.',
  email: 'Email address',
  placeholder: 'example@email.com',
  send: 'Send Reset Link',
  note: "We'll send you a link to reset your password.",
  remember: 'Remembered your password?',
  login: 'Sign in',
  back: 'Back to sign in',
  success: 'Email Sent!',
  successMessage: 'A password reset link has been sent to your email.',
  checkEmail: 'Check your email and follow the instructions.',
};

export default function ClientForgotPasswordPage({ 
  locale = 'ar',
  userType = 'patient' // 'patient' | 'therapist'
}: { 
  locale?: Locale;
  userType?: 'patient' | 'therapist';
}) {
  const t = locale === 'ar' ? AR : EN;
  const isRTL = locale === 'ar';
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || `/${locale}/${userType === 'therapist' ? 'therapist-dashboard' : 'dashboard'}`;

  const [step, setStep] = React.useState<'form' | 'success'>('form');
  const [email, setEmail] = React.useState('');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const emailInput = form.querySelector<HTMLInputElement>('#email');
    const emailValue = emailInput?.value || '';
    setEmail(emailValue);
    
    // TODO: Send reset email API call here
    setStep('success');
  }

  const loginPath = userType === 'therapist' 
    ? `/${locale}/therapist-login`
    : `/${locale}/login`;

  return (
    <section
      className="flex min-h-screen bg-gray-50 px-4 py-8 md:py-16 dark:bg-gray-900"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="m-auto w-full max-w-[28rem] md:max-w-[36rem] overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="bg-teal-600 px-8 py-6">
          <div className="text-center">
            <Link
              href={`/${locale}`}
              aria-label="home"
              className="mx-auto block w-fit"
            >
              <Logo className="text-white" />
            </Link>
            <h1 className="mb-2 mt-4 text-2xl font-bold text-white">
              {step === 'success' ? t.success : t.title}
            </h1>
            <p className="text-sm text-teal-100">
              {step === 'success' ? t.successMessage : t.subtitle}
            </p>
          </div>
        </div>

        <div className="px-8 py-8">
          {step === 'form' && (
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t.email}
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
                    placeholder={t.placeholder}
                    className="h-12 pl-10 rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Send Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all duration-200"
              >
                {t.send}
              </Button>

              {/* Note */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.note}</p>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-teal-600" />
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">{t.checkEmail}</p>
                {email && (
                  <p className="text-sm text-gray-500 break-words">
                    <span className="font-medium">{email}</span>
                  </p>
                )}
              </div>

              <Button
                onClick={() => router.push(loginPath)}
                className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </div>
          )}
        </div>

        {/* Footer link */}
        <div className="bg-gray-50 dark:bg-gray-700 px-8 py-6 border-t border-gray-100 dark:border-gray-600">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            {t.remember}{' '}
            <Link
              href={loginPath}
              className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}