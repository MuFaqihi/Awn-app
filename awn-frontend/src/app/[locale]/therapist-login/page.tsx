import { use } from 'react';
import TherapistLoginPage from '@/components/therapist-login';
import type { Locale } from '@/lib/i18n';

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  return <TherapistLoginPage locale={locale} />;
}