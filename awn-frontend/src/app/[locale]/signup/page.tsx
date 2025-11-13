import { use } from 'react';
import SignUpPage from '@/components/sign-up';
import type { Locale } from '@/lib/i18n';

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  return <SignUpPage locale={locale} />;
}