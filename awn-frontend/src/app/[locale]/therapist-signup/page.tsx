import { use } from 'react';
import TherapistSignUpPage from '@/components/therapist-signup';
import type { Locale } from '@/lib/i18n';

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  return <TherapistSignUpPage locale={locale} />;
}