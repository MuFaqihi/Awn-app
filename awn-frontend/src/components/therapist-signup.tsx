'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatedOTPInput } from '@/components/ui/AnimatedOTPInput';
import { toastManager } from '@/hooks/use-toast';
import { Check, X, Eye, EyeOff, Mail } from 'lucide-react';

type Locale = 'ar' | 'en';

const AR = {
  title: 'التسجيل كأخصائي في عون',
  subtitle: 'انضم لفريق أخصائيي العلاج الطبيعي المعتمدين.',
  first: 'الاسم الأول',
  last: 'اسم العائلة',
  email: 'البريد الإلكتروني',
  emailPlaceholder: 'example@email.com',
  specialty: 'التخصص',
  specialtyPlaceholder: 'اختر تخصصك',
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
  otpTitle: 'أدخل رمز التحقق',
  otpHelp: 'أرسلنا رمزًا مكوّنًا من 6 أرقام إلى بريدك الإلكتروني.',
  resend: 'إعادة الإرسال',
  back: 'رجوع',
  passwordError: 'يرجى استيفاء جميع متطلبات كلمة المرور'
};

const EN = {
  title: 'Join Awn as a Therapist',
  subtitle: 'Join our team of certified physiotherapists.',
  first: 'First name',
  last: 'Last name',
  email: 'Email address',
  emailPlaceholder: 'example@email.com',
  specialty: 'Specialty',
  specialtyPlaceholder: 'Select your specialty',
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
  otpTitle: 'Enter verification code',
  otpHelp: 'We sent a 6-digit code to your email.',
  resend: 'Resend code',
  back: 'Back',
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

export default function TherapistSignUpPage({ locale = 'ar' }: { locale?: Locale }) {
  const t = locale === 'ar' ? AR : EN;
  const isRTL = locale === 'ar';
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || `/${locale}/therapist-dashboard`;

  const [step, setStep] = React.useState<'form' | 'otp'>('form');
  const [otp, setOtp] = React.useState('');
  const [resendIn, setResendIn] = React.useState(0);
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

  React.useEffect(() => {
    if (step !== 'otp') return;
    setResendIn(30);
    const id = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isPasswordValid) {
      toastManager.add({
        title: t.passwordError,
        description: '',
      });
      return;
    }

    const form = e.currentTarget as HTMLFormElement;
    const emailInput = form.querySelector<HTMLInputElement>('#email');
    const email = emailInput?.value || '';

    router.push(
      `/${locale}/otp?next=${encodeURIComponent(next)}&email=${encodeURIComponent(email)}&role=therapist`
    );
  }


  function handleOtpComplete(code: string) {
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
        <div className="bg-primary/65 backdrop-blur-md border-b border-primary/25 dark:bg-primary/70 dark:border-primary/30 px-8 py-6">
          <div className="text-center">
            <Link
              href={`/${locale}`}
              aria-label="home"
              className="mx-auto block w-fit"
            >
              <Logo className="text-white" />
            </Link>
            <h1 className="mb-2 mt-4 text-2xl font-bold text-white">{t.title}</h1>
            <p className="text-sm text-primary-foreground/90">{t.subtitle}</p>
          </div>
        </div>

        <div className="px-8 py-8">
          {step === 'form' && (
            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.first}
                  </Label>
                  <Input 
                    id="firstname" 
                    name="firstname" 
                    type="text" 
                    required 
                    className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.last}
                  </Label>
                  <Input 
                    id="lastname" 
                    name="lastname" 
                    type="text" 
                    required 
                    className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-600"
                  />
                </div>
              </div>

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
                    placeholder={t.emailPlaceholder}
                    className="h-12 pl-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Specialty Field */}
              <div className="space-y-2">
                <Label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t.specialty}
                </Label>
                <select
                  id="specialty"
                  name="specialty"
                  required
                  className="w-full h-12 px-4 border border-gray-200 bg-white rounded-xl text-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">{t.specialtyPlaceholder}</option>
                  {locale === 'ar' ? (
                    <>
                      <option value="children">علاج طبيعي للأطفال</option>
                      <option value="women">علاج طبيعي للنساء</option>
                      <option value="sports">تأهيل الإصابات الرياضية</option>
                      <option value="neuro">علاج طبيعي عصبي</option>
                      <option value="bones">علاج طبيعي عظام</option>
                      <option value="geriatrics">علاج طبيعي للمسنين</option>
                    </>
                  ) : (
                    <>
                      <option value="children">Pediatric Physiotherapy</option>
                      <option value="women">Women's Physiotherapy</option>
                      <option value="sports">Sports Rehabilitation</option>
                      <option value="neuro">Neurological Physiotherapy</option>
                      <option value="bones">Orthopedic Physiotherapy</option>
                      <option value="geriatrics">Geriatric Physiotherapy</option>
                    </>
                  )}
                </select>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordTouched(true);
                    }}
                    className="h-12 pr-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-600"
                    autoComplete="new-password"
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
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t.confirmPassword}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordTouched(true);
                    }}
                    className="h-12 pr-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-600"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Rules */}
              {passwordTouched && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t.passwordRulesTitle}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={passwordValidation.length ? 'text-green-600' : 'text-gray-600'}>
                        {t.passwordRules.length}
                      </span>
                      <RuleIcon isValid={passwordValidation.length} touched={passwordTouched} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={passwordValidation.uppercase ? 'text-green-600' : 'text-gray-600'}>
                        {t.passwordRules.uppercase}
                      </span>
                      <RuleIcon isValid={passwordValidation.uppercase} touched={passwordTouched} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={passwordValidation.lowercase ? 'text-green-600' : 'text-gray-600'}>
                        {t.passwordRules.lowercase}
                      </span>
                      <RuleIcon isValid={passwordValidation.lowercase} touched={passwordTouched} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={passwordValidation.number ? 'text-green-600' : 'text-gray-600'}>
                        {t.passwordRules.number}
                      </span>
                      <RuleIcon isValid={passwordValidation.number} touched={passwordTouched} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={passwordValidation.special ? 'text-green-600' : 'text-gray-600'}>
                        {t.passwordRules.special}
                      </span>
                      <RuleIcon isValid={passwordValidation.special} touched={passwordTouched} />
                    </div>
                    {confirmPasswordTouched && (
                      <div className="flex items-center justify-between text-sm">
                        <span className={passwordValidation.match ? 'text-green-600' : 'text-gray-600'}>
                          {t.passwordRules.match}
                        </span>
                        <RuleIcon isValid={passwordValidation.match} touched={confirmPasswordTouched} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md transition-all duration-200"
              >
                {t.signUp}
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
                  onClick={() => setResendIn(30)}
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
            {t.haveAccount}{' '}
            <Link
              href={`/${locale}/therapist-login?next=${encodeURIComponent(next)}`}
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {t.signIn}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}