import { Locale } from "@/lib/i18n";
import DashboardLayout from "@/components/DashboardLayout";
import SettingsClient from "./SettingsClient";

interface SettingsPageProps {
  params: {
    locale: Locale;
  };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  return (
    <DashboardLayout locale={params.locale}>
      <SettingsClient locale={params.locale} />
    </DashboardLayout>
  );
}