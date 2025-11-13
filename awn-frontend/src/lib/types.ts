// Therapist type
export interface Therapist {
  id: string;
  name: string;
  nameAr: string;
  specialty: string;
  specialtyAr: string;
  avatar: string;
  rating: number;
  experience: number;
  location: string;
  locationAr: string;
  bio: string;
  bioAr: string;
  price: number;
  currency: string;
  isOnline: boolean;
  isClinic: boolean;
  languages: string[];
  education: string[];
  certifications: string[];
}

// Appointment type (for patients)
export interface Appointment {
  id: string;
  therapistId: string;
  date: string;
  time: string;
  kind: 'online' | 'home';
  status: 'upcoming' | 'completed' | 'cancelled';

  place?: string;
  meetLink?: string;
}

export type TherapistAppointment = {
  id: string;
  patientName: string;
  patientNameEn: string;
  date: string;
  time: string;
  kind: "online" | "Home" | "home";
  status: "upcoming" | "completed" | "pending" | "completed";
  place?: string;
  meetLink?: string;
  cancelReason?: string ;
}

// Treatment plan type
export interface TreatmentPlan {
  id: string;
  therapistId: string;
  title: string;
  steps: string[];
  createdAt: string;
  status:
    | "proposed"
    | "pending"
    | "accepted"
    | "declined"
    | "in-progress"
    | "completed"
    | "cancelled";
  completedSteps?: number;
}

export type Locale = 'ar' | 'en';
export type AuthoredBy = 'user' | 'therapist';


export * from '@/lib/medical-history';
