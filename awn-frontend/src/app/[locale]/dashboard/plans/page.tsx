import { use } from "react";
import type { Locale } from "@/lib/i18n";
import DashboardLayout from "@/components/DashboardLayout";
import PlansClient from "./PlansClient";

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  
  return (
    <DashboardLayout locale={locale}>
      <PlansClient locale={locale} />
    </DashboardLayout>
  );
}