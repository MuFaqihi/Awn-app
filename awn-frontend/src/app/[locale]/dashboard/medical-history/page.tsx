// src/app/[locale]/dashboard/medical-history/page.tsx
import { use } from "react";
import type { Locale } from "@/lib/types";
import DashboardLayout from "@/components/DashboardLayout";
import MedicalHistoryClient from "./MedicalHistoryClient";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default function MedicalHistoryPage({ params }: Props) {
  const { locale } = use(params);
  
  return (
    <DashboardLayout locale={locale}>
      <MedicalHistoryClient locale={locale} />
    </DashboardLayout>
  );
}