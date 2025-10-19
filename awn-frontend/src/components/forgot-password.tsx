'use client';

import Link from 'next/link';
import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Locale = 'ar' | 'en';
type Dict = {
  title: string;
  subtitle: string;
  email: string;
  placeholder: string;
  send: string;
  note: string;
  remember: string;
  login: string;
};

const AR: Dict = {
  title: 'استعادة كلمة المرور',
  subtitle: 'أدخل بريدك الإلكتروني لإرسال رابط الاستعادة.',
  email: 'البريد الإلكتروني',
  placeholder: 'name@example.com',
  send: 'إرسال رابط الاستعادة',
  note: 'سنرسل لك رابطًا لإعادة تعيين كلمة المرور.',
  remember: 'تذكّرت كلمة المرور؟',
  login: 'تسجيل الدخول',
};

const EN: Dict = {
  title: 'Recover Password',
  subtitle: 'Enter your email to receive a reset link.',
  email: 'Email',
  placeholder: 'name@example.com',
  send: 'Send Reset Link',
  note: "We'll send you a link to reset your password.",
  remember: 'Remembered your password?',
  login: 'Log in',
};

export default function ForgotPasswordPage({
  locale = 'ar',
  dict,
}: {
  locale?: Locale;
  dict?: Partial<Dict>;
}) {
  const t: Dict = { ...(locale === 'ar' ? AR : EN), ...(dict || {}) };
  const isRTL = locale === 'ar';

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
      <form
        action=""
        className="m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border bg-muted shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href={`/${locale}`} aria-label="go home" className="mx-auto block w-fit">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">{t.email}</Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder={t.placeholder}
              />
            </div>

            <Button className="w-full">{t.send}</Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">{t.note}</p>
          </div>
        </div>

        <div className="p-3">
          <p className="text-center text-sm text-accent-foreground">
            {t.remember}{' '}
            <Button asChild variant="link" className="px-1">
              <Link href={`/${locale}/login`}>{t.login}</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}