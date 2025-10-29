import ForgotPasswordPage from '@/components/forgot-password';
import type { Locale } from '@/lib/i18n';

export default function Page({ params }: { params: { locale: Locale } }) {
  return <ForgotPasswordPage locale={params.locale} />;
}