 'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo} from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Locale = 'ar' | 'en';
const AR = {
  title: 'استعادة كلمة المرور',
  subtitle: 'أدخل بريدك الإلكتروني لإرسال رابط الاستعادة.',
  email: 'البريد الإلكتروني',
  placeholder: 'name@example.com',
  send: 'إرسال رابط الاستعادة',
  note: 'سنرسل لك رابطًا لإعادة تعيين كلمة المرور.',
  remember: 'تذكّرت كلمة المرور؟',
  login: 'تسجيل الدخول',
};
const EN = {
  title: 'Recover Password',
  subtitle: 'Enter your email to receive a reset link.',
  email: 'Email',
  placeholder: 'name@example.com',
  send: 'Send Reset Link',
  note: "We'll send you a link to reset your password.",
  remember: 'Remembered your password?',
  login: 'Log in',
};

export default function ForgotPasswordPage({ locale = 'ar' as Locale }) {
  const t = locale === 'ar' ? AR : EN;
  const isRTL = locale === 'ar';
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: send email
    router.push(`/${locale}/login?reset=sent`);
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
      <form onSubmit={onSubmit} className="m-auto h-fit w-full max-w-[28rem] sm:max-w-md md:max-w-lg overflow-hidden rounded-2xl border bg-card shadow-md">
        <div className="bg-card -m-px rounded-2xl border p-8 sm:p-10">
          <div className="text-center">
            <Link href={`/${locale}`} aria-label="go home" className="mx-auto block w-fit">
              <Logo/>
            </Link>
            <h1 className="mb-1 mt-4 text-2xl font-semibold">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">{t.email}</Label>
              <Input type="email" id="email" name="email" required placeholder={t.placeholder} />
            </div>
            <Button type="submit" className="w-full h-11">{t.send}</Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">{t.note}</p>
          </div>
        </div>

        <div className="p-5">
          <p className="text-center text-sm text-accent-foreground">
            {t.remember}{' '}
            <Link
              href={`/${locale}/login`}
              className="font-medium text-[oklch(45%_0.08_240)] transition-colors hover:text-[oklch(55%_0.1_240)] active:opacity-80"
            >
              {t.login}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}