import type { Locale } from "@/lib/i18n";
import DashboardTherapistsLayout from "@/components/DashboardTherapistsLayout";
import PerformanceTherapist from "./PerformanceTherapist";

export default function Page({ params }: { params: { locale: Locale } }) {
  return (
    <DashboardTherapistsLayout locale={params.locale}>
      <PerformanceTherapist locale={params.locale} />
    </DashboardTherapistsLayout>
  );
}
