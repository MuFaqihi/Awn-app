"use client";
import React from 'react';
import type { Locale } from '@/lib/types';
import DashboardLayout from '@/components/DashboardLayout';
import MedicalHistorySummary from '@/components/medical-history/MedicalHistorySummary';

interface Props {
  params: Promise<{
    locale: Locale;
  }>;
}

export default function MedicalHistorySummaryPage({ params }: Props) {
  const resolvedParams = React.use(params);
  
  return (
    <DashboardLayout locale={resolvedParams.locale}>
      <MedicalHistorySummary locale={resolvedParams.locale} />
    </DashboardLayout>
  );
}