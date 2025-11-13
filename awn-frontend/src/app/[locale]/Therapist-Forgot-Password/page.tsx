import { use } from 'react';
import TherapistForgotPasswordPage from '@/components/therapist-forgot-password';
import type { Locale } from '@/lib/i18n';

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  
  return <TherapistForgotPasswordPage locale={locale} />;
}