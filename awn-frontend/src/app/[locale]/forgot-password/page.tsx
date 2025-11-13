import { use } from 'react';
import ClientForgotPasswordPage from '@/components/client-forgot-password';
import type { Locale } from '@/lib/i18n';

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  
  return <ClientForgotPasswordPage locale={locale} />;
}