'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { toastManager } from '@/hooks/use-toast';
import { Check, X, Eye, EyeOff, Mail } from 'lucide-react';

type Locale = 'ar' | 'en';

const AR = {
  title: 'إنشاء حساب في عون',
  subtitle: 'مرحبًا بك! أنشئ حسابك للبدء.',
  first: 'الاسم الأول',
  last: 'اسم العائلة',
  email: 'البريد الإلكتروني',
  emailPlaceholder: 'example@email.com',
  password: 'كلمة المرور',
  confirmPassword: 'تأكيد كلمة المرور',
  passwordRulesTitle: 'متطلبات كلمة المرور:',
  passwordRules: {
    length: 'على الأقل 8 أحرف',
    uppercase: 'حرف كبير واحد على الأقل',
    lowercase: 'حرف صغير واحد على الأقل',
    number: 'رقم واحد على الأقل',
    special: 'رمز خاص واحد على الأقل (!@#$%^&*)',
    match: 'كلمات المرور متطابقة'
  },
  signUp: 'إنشاء الحساب',
  haveAccount: 'لديك حساب مسبقًا؟',
  
signIn: 'تسجيل الدخول',
  passwordError: 'يرجى استيفاء جميع متطلبات كلمة المرور'
};

const EN = {
  title: 'Create your Awn account',
  subtitle: 'Welcome! Create an account to get started.',
  first: 'First name',
  last: 'Last name',
  email: 'Email address',
  emailPlaceholder: 'example@email.com',
  password: 'Password',
  confirmPassword: 'Confirm password',
  passwordRulesTitle: 'Password requirements:',
  passwordRules: {
    length: 'At least 8 characters',
    uppercase: 'One uppercase letter',
    lowercase: 'One lowercase letter',
    number: 'One number',
    special: 'One special character (!@#$%^&*)',
    match: 'Passwords match'
  },
  signUp: 'Sign Up',
  haveAccount: 'Already have an account?',
  
signIn: 'Sign in',
  passwordError: 'Please meet all password requirements'
};

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  match: boolean;
}

export default function SignUpPage({ locale = 'ar' }: { locale?: Locale }) {
  const t = locale === 'ar' ? AR : EN;
  const isRTL = locale === 'ar';
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || `/${locale}/dashboard`;


  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordTouched, setPasswordTouched] = React.useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = React.useState(false);

  const passwordValidation: PasswordValidation = React.useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && confirmPassword !== ''
    };
  }, [password, confirmPassword]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);



  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isPasswordValid) {
      toastManager.add({
        title: t.passwordError,
        description: '',
      });
      return;
    }

    // Save auth + create session
    localStorage.setItem('authToken', 'client_token_' + Date.now());
    localStorage.setItem('isLoggedIn', 'true');

    // Go directly to dashboard (NO OTP)
    router.push(next);
  }

  const RuleIcon = ({ isValid, touched }: { isValid: boolean; touched: boolean }) => {
    if (!touched) return null;
    return isValid ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <X className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <section
      className="flex min-h-screen bg-gray-50 px-4 py-8 md:py-16 dark:bg-gray-900"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <form
        onSubmit={onSubmit}
        className="m-auto w-full max-w-[28rem] md:max-w-[36rem] overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="bg-primary/65 backdrop-blur-md border-b border-primary/25 px-8 py-6">
          <div className="text-center">
            <Link href={`/${locale}`} aria-label="home" className="mx-auto block w-fit">
              <Logo className="text-white" />
            </Link>
            <h1 className="mt-4 mb-2 text-2xl font-bold text-white">{t.title}</h1>
            <p className="text-sm text-white/80">{t.subtitle}</p>
          </div>
        </div>

        <div className="px-8 py-8">

          <div className="space-y-6">

            {/* First + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.first}</Label>
                <Input required className="h-12 rounded-xl" />
      
            </div>
              <div className="space-y-2">
                <Label>{t.last}</Label>
                <Input required className="h-12 rounded-xl" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>{t.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  className="h-12 pl-10 rounded-xl"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>{t.password}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordTouched(true);
                  }}
                  className="h-12 pr-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label>{t.confirmPassword}</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordTouched(true);
                  }}
                  className="h-12 pr-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Password Rules */}
            {passwordTouched && (
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <h4 className="text-sm font-medium">{t.passwordRulesTitle}</h4>

                {Object.entries(passwordValidation).map(([key, valid]) => (
                  key !== 'match' || confirmPasswordTouched ? (
                    <div className="flex justify-between text-sm" key={key}>
                      <span className={valid ? 'text-green-600' : 'text-gray-600'}>
                        {t.passwordRules[key as keyof typeof t.passwordRules]}
                      </span>
                      <RuleIcon isValid={valid} touched={key === 'match' ? confirmPasswordTouched : passwordTouched} />
                    </div>
                  ) : null
                ))}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 font-semibold bg-primary text-white rounded-xl hover:bg-primary/90"
            >
              {t.signUp}
            </Button>

          </div>
        </div>

        <div className="p-5 text-center text-sm">
          {t.haveAccount}{' '}
          <Link
            href={`/${locale}/login?next=${encodeURIComponent(next)}`}
            className="font-semibold text-primary"
          >
            {t.signIn}
          </Link>
        </div>

      </form>
    </section>
  );
}