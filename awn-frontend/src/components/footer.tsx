// src/components/footer.tsx
'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';

type Locale = 'ar' | 'en';

export default function Footer({ locale = 'ar' }: { locale?: Locale }) {
  const isAr = locale === 'ar';
  const base = `/${locale}`;
  const dir = isAr ? 'rtl' : 'ltr';

  const links = isAr
    ? [
        { title: 'الأسئلة الشائعة', href: `${base}/faq` },
        { title: 'المختصّون', href: `${base}/therapists` },
        { title: 'عن عون', href: `${base}/about` },
        { title: 'تواصل', href: `${base}/contact` },
      ]
    : [
        { title: 'FAQ', href: `${base}/faq` },
        { title: 'Therapists', href: `${base}/therapists` },
        { title: 'About', href: `${base}/about` },
        { title: 'Contact', href: `${base}/contact` },
      ];

  const socials = [
    {
      label: 'X',
      href: 'https://x.com/Awn1065172',
      icon: (
        <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M10.49 14.65L15.25 21h7l-7.86-10.48L20.93 3h-2.65l-5.12 5.89L8.75 3h-7l7.51 10.02L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"/>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/awn1065172/',
      icon: (
        <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m8.6 2H7.6A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4m.85 1.5a1.25 1.25 0 1 1 0 2.5a1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6"/>
        </svg>
      ),
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@awn388?is_from_webapp=1&sender_device=pc',
      icon: (
        <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12.45 3h3.09a4.28 4.28 0 0 0 1.06 2.82c.82.94 1.77 1.55 2.98 1.78V9a7.35 7.35 0 0 1-4.3-1.38v6.29c0 3.15-2.55 5.7-5.69 5.7c-2.93 0-5.69-2.37-5.69-5.7c0-3.42 3.02-6.1 6.47-5.64v3.36c-1.71-.53-3.37.76-3.37 2.48c0 1.44 1.18 2.6 2.6 2.6a2.59 2.59 0 0 0 2.59-2.5z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer dir={dir} className="mt-16 border-t">
      <div className="mx-auto max-w-6xl px-6">
        {/* tighter spacer below divider */}
        <div className="pt-6" />

        {/* Brand */}
        <Link href={base} aria-label={isAr ? 'الصفحة الرئيسية' : 'Home'} className="mx-auto block size-fit">
          <Logo />
        </Link>

        {/* Links */}
        <nav className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted-foreground transition-colors hover:text-[#013D5B]"
            >
              {l.title}
            </Link>
          ))}
        </nav>

        {/* Socials */}
        <div className="mt-5 flex justify-center gap-5 text-muted-foreground">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="rounded-md p-2 transition-colors hover:text-[#013D5B] active:opacity-80"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="mt-5 pb-10 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Awn — {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
        </p>
      </div>
    </footer>
  );
}