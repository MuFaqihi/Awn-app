import { use } from 'react';
import LoginPage from '@/components/login';
import type { Locale } from '@/lib/i18n';

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  return <LoginPage locale={locale} />;
}