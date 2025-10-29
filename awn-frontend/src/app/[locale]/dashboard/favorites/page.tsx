import { use } from "react";
import type { Locale } from "@/lib/i18n";
import DashboardLayout from "@/components/DashboardLayout";
import FavoritesClient from "./FavoritesClient";

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  
  return (
    <DashboardLayout locale={locale}>
      <FavoritesClient locale={locale} />
    </DashboardLayout>
  );
}