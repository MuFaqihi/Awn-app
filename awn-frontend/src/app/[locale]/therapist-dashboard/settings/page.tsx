import type { Locale } from "@/lib/i18n";
import DashboardTherapistsLayout from "@/components/DashboardTherapistsLayout";
import SettingsTherapists from "./SettingsTherapists";

interface SettingsPageProps {
  params: {
    locale: Locale;
  };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  return (
    <DashboardTherapistsLayout locale={params.locale}>
      <SettingsTherapists locale={params.locale} />
    </DashboardTherapistsLayout>
  );
}
