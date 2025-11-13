import { useState, useEffect } from 'react';
import type { Locale } from '@/lib/types';

interface MedicalHistorySummary {
  precautions: string[];
  conditions: string[];
  medications: string[];
  allergies: string[];
  hasAnticoagulant: boolean;
  hasRiskFactors: boolean;
}

interface MedicalHistoryStatus {
  isComplete: boolean;
  lastUpdated?: string;
  summary: MedicalHistorySummary;
}

export function useMedicalHistoryStatus(): MedicalHistoryStatus {
  const [status, setStatus] = useState<MedicalHistoryStatus>({
    isComplete: true, // Mock as complete for demo
    lastUpdated: "2025-11-06",
    summary: {
      precautions: ["Anticoagulant use", "Pacemaker"],
      conditions: ["Shoulder injury", "Lower back pain"],
      medications: ["Warfarin", "Ibuprofen"],
      allergies: ["Penicillin"],
      hasAnticoagulant: true,
      hasRiskFactors: true
    }
  });

  return status;
}

export function getMedicalHistoryLabels(locale: Locale) {
  const ar = locale === 'ar';
  
  return {
    title: ar ? "التاريخ الطبي" : "Medical History",
    complete: ar ? "مكتمل" : "Complete",
    incomplete: ar ? "غير مكتمل — مطلوب الإعداد" : "Incomplete — Setup Required",
    lastUpdated: ar ? "آخر تحديث:" : "Last updated:",
    review: ar ? "مراجعة" : "Review",
    completeSetup: ar ? "إكمال الإعداد" : "Complete Setup",
    updateHistory: ar ? "تحديث التاريخ" : "Update History",
    viewBackground: ar ? "عرض خلفيتك الطبية" : "View your Medical Background",
    safetyPrompt: ar ? "من أجل سلامتك، يرجى إكمال تاريخك الطبي قبل حجز جلستك الأولى." : "For your safety, please complete your Medical History before booking your first session.",
    therapistReviews: ar ? "يراجع معالجك تاريخك الطبي قبل كل جلسة." : "Your therapist reviews your Medical History before every session.",
    anyChanges: ar ? "أي تغييرات في صحتك منذ الجلسة الأخيرة؟" : "Any changes in your health since last session?",
    basedOnHistory: ar ? "بناءً على تاريخك الطبي:" : "Based on your Medical History:",
    mayNotBeSuitable: ar ? "قد لا تكون مناسبة لحالتك الطبية" : "May not be suitable for your medical condition",
    therapistWillReview: ar ? "سيراجع معالجك تاريخك الطبي قبل تأكيد جلستك الأولى." : "Your therapist will review your Medical History before confirming your first session."
  };
}