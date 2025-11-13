import { use } from "react";
import type { Locale } from "@/lib/i18n";
import DashboardLayout from "@/components/DashboardLayout";
import ApptsClient from "./ApptsClient";

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  
  return (
    <DashboardLayout locale={locale}>
      <ApptsClient locale={locale} />
    </DashboardLayout>
  );
}