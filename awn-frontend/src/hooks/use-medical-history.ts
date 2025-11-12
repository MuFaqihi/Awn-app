
import { useState, useEffect } from 'react';
import type { MedicalHistory } from '@/lib/types';

const createInitialHistory = (): MedicalHistory => ({
  snapshot: {
    primaryConcern: '',
    onsetType: null,
    painScore: 0,
    functionalLimits: [],
    precautions: []
  },
  conditions: [],
  surgeries: [],
  medications: [],
  allergies: [],
  imaging: [],
  vitals: {},
  lifestyle: {},
  womensHealth: {
    show: false
  },
  goals: {
    shortTerm: [],
    longTerm: [],
    functionalGoals: []
  },
  contraindications: {
    absolute: [],
    relative: []
  },
  consent: {
    consentToTreatment: false,
    informedOfRisks: false,
    shareWithAssignedTherapist: false
  },
  attachments: [],
  timeline: [],
  isComplete: false
});

export function useMedicalHistory() {
  const [history, setHistory] = useState<MedicalHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Simulate loading initial data
    setTimeout(() => {
      setHistory(createInitialHistory());
      setIsLoading(false);
    }, 500);
  }, []);

  const updateHistory = (updates: Partial<MedicalHistory>) => {
    setHistory(prev => {
      if (!prev) return null;
      const updated = { 
        ...prev, 
        ...updates, 
        lastUpdated: new Date().toISOString() 
      };
      setIsDirty(true);
      return updated;
    });
  };

  const saveNow = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsDirty(false);
      console.log('Medical history saved');
    } catch (error) {
      console.error('Failed to save:', error);
      throw error;
    }
  };

  const isSetupComplete = history ? (
    history.snapshot.primaryConcern.length > 0 &&
    history.consent.consentToTreatment &&
    history.consent.informedOfRisks
  ) : false;

  return {
    history,
    isLoading,
    isDirty,
    isSetupComplete,
    updateHistory,
    saveNow
  };
}