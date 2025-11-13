import { use } from "react";
import type { Locale } from "@/lib/i18n";
import DashboardTherapistsLayout from "@/components/DashboardTherapistsLayout";
import DashboardTherapists from "./DashboardTherapists";

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  
  return (
    <DashboardTherapistsLayout locale={locale}>
      <DashboardTherapists locale={locale} />
    </DashboardTherapistsLayout>
  );
}
