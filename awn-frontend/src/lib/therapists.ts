import type { Therapist } from './types';

// Mock physiotherapy data - replace this with your real source (DB/API/JSON)
const therapists: Therapist[] = [
  {
    id: "t_dr_mona",
    name: "Dr. Mona Ahmed",
    nameAr: "د. منى أحمد",
    specialty: "Sports Physiotherapy",
    specialtyAr: "العلاج الطبيعي الرياضي",
    avatar: "/avatars/dr-mona.jpg",
    rating: 4.8,
    experience: 8,
    location: "Riyadh",
    locationAr: "الرياض",
    bio: "Specialized in sports injuries and rehabilitation",
    bioAr: "متخصصة في إصابات الرياضة والتأهيل",
    price: 200,
    currency: "SAR",
    isOnline: true,
    isClinic: true,
    languages: ["Arabic", "English"],
    education: ["DPT - King Saud University", "MSc Sports Medicine"],
    certifications: ["Licensed Physiotherapist", "Sports Injury Specialist"],
  },
  {
    id: "t_dr_basel",
    name: "Dr. Basel Hassan",
    nameAr: "د. باسل حسان",
    specialty: "Orthopedic Physiotherapy",
    specialtyAr: "العلاج الطبيعي العظمي",
    avatar: "/avatars/dr-basel.jpg",
    rating: 4.9,
    experience: 12,
    location: "Riyadh",
    locationAr: "الرياض",
    bio: "Expert in post-surgical rehabilitation and manual therapy",
    bioAr: "خبير في التأهيل بعد العمليات والعلاج اليدوي",
    price: 250,
    currency: "SAR",
    isOnline: true,
    isClinic: true,
    languages: ["Arabic", "English"],
    education: ["DPT - University of Toronto", "Fellowship in Manual Therapy"],
    certifications: ["Licensed Physiotherapist", "Manual Therapy Specialist", "Orthopedic Clinical Specialist"],
  },
  {
    id: "t_dr_sara",
    name: "Dr. Sara Al-Mansouri",
    nameAr: "د. سارة المنصوري",
    specialty: "Neurological Physiotherapy",
    specialtyAr: "العلاج الطبيعي العصبي",
    avatar: "/avatars/dr-sara.jpg",
    rating: 4.7,
    experience: 10,
    location: "Jeddah",
    locationAr: "جدة",
    bio: "Specialized in stroke recovery and neurological conditions",
    bioAr: "متخصصة في التعافي من السكتة الدماغية والحالات العصبية",
    price: 220,
    currency: "SAR",
    isOnline: true,
    isClinic: true,
    languages: ["Arabic", "English"],
    education: ["DPT - King Abdulaziz University", "MSc Neurological Rehabilitation"],
    certifications: ["Licensed Physiotherapist", "Neurological Clinical Specialist"],
  },
  {
    id: "t_dr_ahmed",
    name: "Dr. Ahmed Al-Rashid",
    nameAr: "د. أحمد الراشد",
    specialty: "Pediatric Physiotherapy",
    specialtyAr: "العلاج الطبيعي للأطفال",
    avatar: "/avatars/dr-ahmed.jpg",
    rating: 4.6,
    experience: 7,
    location: "Dammam",
    locationAr: "الدمام",
    bio: "Specialized in developmental delays and pediatric conditions",
    bioAr: "متخصص في تأخر النمو وحالات الأطفال",
    price: 180,
    currency: "SAR",
    isOnline: false,
    isClinic: true,
    languages: ["Arabic", "English"],
    education: ["DPT - Imam Abdulrahman University", "Pediatric Physiotherapy Certificate"],
    certifications: ["Licensed Physiotherapist", "Pediatric Clinical Specialist"],
  },
];

export function getTherapistById(id: string): Therapist | undefined {
  return therapists.find(t => t.id === id);
}

export function getAllTherapists(): Therapist[] {
  return therapists;
}

export function getTherapistsBySpecialty(specialty: string): Therapist[] {
  return therapists.filter(t => 
    t.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
    t.specialtyAr.includes(specialty)
  );
}

export function searchTherapists(query: string): Therapist[] {
  const lowercaseQuery = query.toLowerCase();
  return therapists.filter(t => 
    t.name.toLowerCase().includes(lowercaseQuery) ||
    t.nameAr.includes(query) ||
    t.specialty.toLowerCase().includes(lowercaseQuery) ||
    t.specialtyAr.includes(query)
  );
}

export function getTherapistsByLocation(location: string): Therapist[] {
  return therapists.filter(t => 
    t.location.toLowerCase().includes(location.toLowerCase()) ||
    t.locationAr.includes(location)
  );
}

export function getOnlineTherapists(): Therapist[] {
  return therapists.filter(t => t.isOnline);
}

export function getClinicTherapists(): Therapist[] {
  return therapists.filter(t => t.isClinic);
}