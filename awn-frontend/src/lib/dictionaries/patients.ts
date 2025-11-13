export type Patient = {
  id: string;
  name: string;
  nameAr: string;
  gender: "male" | "female";
  age: number;
  avatar: string;
  condition: string;
  conditionAr: string;
  city: string;
  cityAr: string;
  phone: string;
  email: string;
  ongoingTreatment: boolean;
  lastVisit: string;
  notes?: string;
  notesAr?: string;
};
