'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/types';

interface SectionNavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  locale: Locale;
}

const sections = [
  { id: 'snapshot', en: 'Snapshot', ar: 'لمحة عامة' },
  { id: 'conditions', en: 'Conditions', ar: 'الحالات المرضية' },
  { id: 'medications', en: 'Medications', ar: 'الأدوية' },
  { id: 'allergies', en: 'Allergies', ar: 'الحساسية' },
  { id: 'vitals', en: 'Vitals', ar: 'العلامات الحيوية' },
  { id: 'consent', en: 'Consent', ar: 'الموافقة' },
];

export default function SectionNavigation({ currentSection, onNavigate, locale }: SectionNavigationProps) {
  const ar = locale === 'ar';

  return (
    <nav className="sticky top-0 z-10 bg-white border border-gray-200 rounded-lg p-2">
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onNavigate(section.id)}
            className={cn(
              "w-full px-3 py-2 text-sm font-medium rounded-md text-left transition-colors",
              currentSection === section.id
                ? "bg-teal-100 text-teal-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            {ar ? section.ar : section.en}
          </button>
        ))}
      </div>
    </nav>
  );
}