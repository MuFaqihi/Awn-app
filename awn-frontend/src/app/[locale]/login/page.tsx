import LoginPage from '@/components/login';
import type { Locale } from '@/lib/i18n';

export default function Page({ params }: { params: { locale: Locale } }) {
  return <LoginPage locale={params.locale} />;
}
