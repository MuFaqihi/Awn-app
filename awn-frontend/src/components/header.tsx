'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export type Locale = 'ar' | 'en';

const NAV_AR = [
  { name: 'الرئيسية', path: '' },
  { name: 'المختصّين', path: 'therapists' },
  { name: 'انضم كمختص', path: 'signup?role=therapist' },
  { name: 'تواصل', path: 'contact' },
  { name: 'الأسئلة الشائعة', path: 'faq' }, // FAQ instead of Features
];

const NAV_EN = [
  { name: 'Home', path: '' },
  { name: 'Therapists', path: 'therapists' },
  { name: 'Join as Therapist', path: 'signup?role=therapist' },
  { name: 'Contact', path: 'contact' },
  { name: 'FAQ', path: 'faq' },
];

// swap /ar/... <-> /en/...
function swapLocale(path: string, to: Locale) {
  const parts = path.split('/');
  if (parts[1] === 'ar' || parts[1] === 'en') parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join('/');
}

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// active check based on path segment after locale
function isActive(pathname: string, locale: Locale, itemPath: string) {
  const clean = pathname.replace(/^\/(ar|en)(\/|$)/, '');
  const current = clean.replace(/^\//, '').split('?')[0];
  const target = itemPath.replace(/^\//, '').split('?')[0];
  if (target === '') return current === '';
  return current === target;
}

export default function SiteHeader({ locale = 'ar' }: { locale?: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  const isRTL = locale === 'ar';
  const nav = isRTL ? NAV_AR : NAV_EN;
  const [open, setOpen] = React.useState(false);

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const otherLocale: Locale = locale === 'ar' ? 'en' : 'ar';
  const langHref = swapLocale(pathname, otherLocale);

  const linkBase =
    'text-primary-foreground/90 transition-colors hover:text-link-hover dark:hover:text-white relative underline-offset-8 decoration-2 decoration-link-hover/30 hover:underline';

  return (
    <header dir={isRTL ? 'rtl' : 'ltr'}>
      <nav
        className={cx(
          'fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md',
          'bg-primary/65 border-primary/25 dark:bg-primary/70 dark:border-primary/30'
        )}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* right: logo + pages */}
            <div className="flex items-center gap-6">
  {/* ✅ Only the header wraps in Link */}
  <Link href={`/${locale}`} aria-label="home" className="flex items-center">
    <Logo />
              </Link>

              <ul className="hidden lg:flex items-center gap-6 text-sm">
                {nav.map((item) => {
                  const active = isActive(pathname, locale, item.path);
                  const href = `/${locale}/${item.path}`.replace(/\/+$/, '') || `/${locale}`;
                  return (
                    <li key={item.name}>
                      <Link
                        href={href}
                        className={cx(linkBase, active && 'text-link-hover dark:text-white underline')}
                        aria-current={active ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* left: actions (CTA + lang + theme) */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Per your new flow: header CTA is Login */}
              <Button
                asChild
                size="sm"
                className={cx(
                  'font-medium',
                  'bg-[var(--cta,#013D5B)] text-[var(--cta-foreground,#fff)]',
                  'transition-all duration-200',
                  'hover:bg-[#013D5B]/90 active:bg-[#013D5B]',
                  'hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
                  'rounded-md'
                )}
              >
                <Link href={`/${locale}/login`}>{isRTL ? 'تسجيل الدخول' : 'Log in'}</Link>
              </Button>

              {/* Language */}
              <Link
                href={langHref}
                className={cx(
                  'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm',
                  'border border-white/40 dark:border-white/15',
                  'bg-white/15 dark:bg-white/10',
                  'backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_2px_8px_rgba(0,0,0,.08)]',
                  'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
                  'text-primary-foreground/90'
                )}
                title={isRTL ? 'تغيير اللغة' : 'Change language'}
              >
                {otherLocale.toUpperCase()}
              </Link>

              {/* Theme */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={isRTL ? 'تبديل المظهر' : 'Toggle theme'}
                title={isRTL ? 'تبديل المظهر' : 'Toggle theme'}
                className={cx(
                  'inline-flex h-9 w-9 items-center justify-center rounded-md',
                  'border border-white/40 dark:border-white/15',
                  'bg-white/15 dark:bg-white/10',
                  'backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_2px_8px_rgba(0,0,0,.08)]',
                  'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
                  'text-primary-foreground'
                )}
              >
                <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>
            </div>

            {/* mobile toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 -m-2 text-primary-foreground"
              aria-label={open ? (isRTL ? 'إغلاق القائمة' : 'Close menu') : (isRTL ? 'فتح القائمة' : 'Open menu')}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* mobile panel */}
        {open && (
          <div className="lg:hidden border-t border-primary/25 bg-primary/65 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6 py-4 space-y-4">
              <ul className="space-y-4 text-base">
                {nav.map((item) => {
                  const active = isActive(pathname, locale, item.path);
                  const href = `/${locale}/${item.path}`.replace(/\/+$/, '') || `/${locale}`;
                  return (
                    <li key={item.name}>
                      <Link
                        href={href}
                        className={cx(
                          'block py-1 transition-colors',
                          active
                            ? 'text-white underline underline-offset-8 decoration-2 decoration-link-hover/30'
                            : 'text-primary-foreground hover:text-white'
                        )}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  className="font-medium bg-[#013D5B] text-white hover:bg-[#013D5B]/90 transition-all"
                >
                  <Link href={`/${locale}/login`} onClick={() => setOpen(false)}>
                    {isRTL ? 'تسجيل الدخول' : 'Log in'}
                  </Link>
                </Button>

                <Link
                  href={langHref}
                  onClick={() => setOpen(false)}
                  className={cx(
                    'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm',
                    'border border-white/40 dark:border-white/15',
                    'bg-white/15 dark:bg-white/10',
                    'backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_2px_8px_rgba(0,0,0,.08)]',
                    'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
                    'text-primary-foreground/90'
                  )}
                >
                  {otherLocale.toUpperCase()}
                </Link>

                <button
                  onClick={() => {
                    setTheme(isDark ? 'light' : 'dark');
                    setOpen(false);
                  }}
                  aria-label={isRTL ? 'تبديل المظهر' : 'Toggle theme'}
                  className={cx(
                    'inline-flex h-9 w-9 items-center justify-center rounded-md',
                    'border border-white/40 dark:border-white/15',
                    'bg-white/15 dark:bg-white/10',
                    'backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_2px_8px_rgba(0,0,0,.08)]',
                    'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
                    'text-primary-foreground'
                  )}
                >
                  <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* spacer below fixed nav */}
      <div className="h-16 md:h-[4.5rem]" />
    </header>
  );
}