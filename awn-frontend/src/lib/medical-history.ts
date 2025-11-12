export type AuthoredBy = 'user' | 'therapist';

export interface Snapshot {
  primaryConcern: string;
  onsetType: 'acute' | 'gradual' | 'insidious' | null;
  onsetDate?: string;
  mechanism?: string;
  painScore: number;
  functionalLimits: string[];
  precautions: string[];
  // Add missing properties
  personalInfo?: {
    fullName?: string;
    dateOfBirth?: string;
    age?: number;
    height?: number;
    weight?: number;
    bloodType?: string;
    gender?: 'male' | 'female' | 'other';
    phone?: string;
    email?: string;
    address?: string;
    occupation?: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface ConditionItem {
  id: string;
  name: string;
  category: 'chronic' | 'msk' | 'neuro' | 'cardio' | 'metabolic' | 'mental';
  diagnosedYear?: number;
  notes?: string;
  // Add missing properties
  severity?: 'mild' | 'moderate' | 'severe';
  status?: 'active' | 'resolved' | 'managed' | 'improving';
  authoredBy: AuthoredBy;
}

export interface SurgeryItem {
  id: string;
  procedure: string;
  side?: 'left' | 'right' | 'bilateral';
  date?: string;
  facility?: string;
  restrictions?: string;
  authoredBy: AuthoredBy;
}

export interface MedicationItem {
  id: string;
  name: string;
  dose?: string;
  frequency?: string;
  purpose?: string;
  startDate?: string;
  anticoagulant?: boolean;
  // Add missing properties
  notes?: string;
  authoredBy: AuthoredBy;
}

export interface AllergyItem {
  id: string;
  type: 'drug' | 'food' | 'latex' | 'adhesive' | 'other';
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  // Add missing properties
  notes?: string;
  authoredBy: AuthoredBy;
}

export interface ImagingItem {
  id: string;
  type: 'xray' | 'mri' | 'ct' | 'ultrasound' | 'emg' | 'dexa' | 'other';
  date?: string;
  findings?: string;
  attachmentId?: string;
  authoredBy: AuthoredBy;
}

export interface Vitals {
  bp?: string;
  hr?: number;
  spo2?: number;
  bmi?: number;
  fallsRisk?: boolean;
  lastFallDate?: string;
  redFlags?: string[];
}

export interface Lifestyle {
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'vigorous';
  sports?: string[];
  workType?: 'desk' | 'manual' | 'standing' | 'mixed' | 'retired';
  workErgonomics?: string;
  sleepQuality?: 'poor' | 'fair' | 'good';
  smoking?: boolean;
  postpartumDate?: string;
  assistiveDevices?: string[];
  homeSetup?: string;
}

export interface WomensHealth {
  show: boolean;
  pregnancyStatus?: 'not_pregnant' | 'pregnant' | 'postpartum';
  trimester?: 1 | 2 | 3;
  pelvicFloorSymptoms?: string[];
  contraindications?: string[];
}

export interface Goals {
  shortTerm: string[];
  longTerm: string[];
  functionalGoals: string[];
  sessionPreference?: 'online' | 'clinic' | 'home';
  therapistGender?: 'female' | 'male';
}

export interface Contraindications {
  absolute: string[];
  relative: string[];
}

export interface Consent {
  consentToTreatment: boolean;
  consentDate?: string;
  informedOfRisks: boolean;
  shareWithAssignedTherapist: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface AttachmentItem {
  id: string;
  name: string;
  mime?: string;
  type: 'medical_report' | 'lab_result' | 'referral' | 'other';
  uploadDate: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'appointment' | 'assessment' | 'treatment' | 'note';
  title: string;
  description?: string;
  tags?: string[];
  authoredBy: AuthoredBy;
}

export interface MedicalHistory {
  id?: string;
  snapshot: Snapshot;
  conditions: ConditionItem[];
  surgeries: SurgeryItem[];
  medications: MedicationItem[];
  allergies: AllergyItem[];
  imaging: ImagingItem[];
  vitals: Vitals;
  lifestyle: Lifestyle;
  womensHealth: WomensHealth;
  goals: Goals;
  contraindications: Contraindications;
  consent: Consent;
  attachments: AttachmentItem[];
  timeline: TimelineEvent[];
  isComplete?: boolean;
  lastUpdated?: string;
  // Add missing property
  createdAt?: string;
}

// Legacy type aliases for compatibility
export type PhysioSnapshot = Snapshot;
export type PhysioCondition = ConditionItem;
export type PhysioMedication = MedicationItem;
export type PhysioAllergy = AllergyItem;
export type PhysioSurgery = SurgeryItem;
export type PhysioVitals = Vitals;
export type PhysioLifestyle = Lifestyle;
export type RehabGoals = Goals;
export type PhysioContraindications = Contraindications;
export type PhysioConsent = Consent;