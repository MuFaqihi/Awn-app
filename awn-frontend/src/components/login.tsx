'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as React from 'react';

type Locale = 'ar' | 'en';
type Dict = {
  title: string; subtitle: string; phoneLabel: string; phonePlaceholder: string;
  passwordLabel: string; forgot: string; signIn: string; orContinue: string;
  google: string; microsoft: string; noAccount: string; create: string;
};

const AR: Dict = { /* …exactly as you have… */ 
  title:'تسجيل الدخول إلى عون', subtitle:'مرحبًا بعودتك! سجّل دخولك للمتابعة.',
  phoneLabel:'رقم الجوال', phonePlaceholder:'555 111 2222',
  passwordLabel:'كلمة المرور', forgot:'نسيت كلمة المرور؟', signIn:'تسجيل الدخول',
  orContinue:'أو المتابعة عبر', google:'Google', microsoft:'Microsoft',
  noAccount:'ليس لديك حساب؟', create:'إنشاء حساب'
};
const EN: Dict = { /* …exactly as you have… */
  title:'Sign in to Awn', subtitle:'Welcome back! Sign in to continue.',
  phoneLabel:'Phone number', phonePlaceholder:'555 111 2222',
  passwordLabel:'Password', forgot:'Forgot your password?', signIn:'Sign In',
  orContinue:'Or continue with', google:'Google', microsoft:'Microsoft',
  noAccount:"Don't have an account?", create:'Create account'
};

export default function LoginPage({
  locale = 'ar',
  dict,
}: { locale?: Locale; dict?: Partial<Dict> }) {
  const t: Dict = { ...(locale === 'ar' ? AR : EN), ...(dict || {}) };
  const isRTL = locale === 'ar';
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || `/${locale}/book`; // default back to booking

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: replace with real auth; for now just redirect back
    router.push(next);
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
      <form
        onSubmit={onSubmit}
        className="m-auto w-full max-w-sm overflow-hidden rounded-xl border bg-muted shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-xl border p-8 pb-6">
          <div className="text-center">
            <Link href={`/${locale}`} aria-label="home" className="mx-auto block w-fit">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="block text-sm">{t.phoneLabel}</Label>
              <Input id="phone" name="phone" type="text" required placeholder={t.phonePlaceholder} autoComplete="username" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">{t.passwordLabel}</Label>
                <Button asChild variant="link" size="sm" className="px-0">
                  <Link href={`/${locale}/forgot-password`}>{t.forgot}</Link>
                </Button>
              </div>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>

            <Button type="submit" className="w-full">{t.signIn}</Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-xs text-muted-foreground">{t.orContinue}</span>
            <hr className="border-dashed" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" className="gap-2">
              {/* Google icon … */}
              <span>{t.google}</span>
            </Button>
            <Button type="button" variant="outline" className="gap-2">
              {/* Microsoft icon … */}
              <span>{t.microsoft}</span>
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-center text-sm text-accent-foreground">
            {t.noAccount}{" "}
            <Button asChild variant="link" className="px-1">
              <Link href={`/${locale}/signup?next=${encodeURIComponent(next)}`}>{t.create}</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}