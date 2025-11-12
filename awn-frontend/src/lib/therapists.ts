// Updated therapist data with correct availability structure
const therapists = [
  {
    id: "ahmed-alotaibi",
    name: {
      en: "Dr. Ahmed Al-Otaibi",
      ar: "د. أحمد العتيبي"
    },
    specialties: ["Sports Physiotherapy", "العلاج الطبيعي الرياضي"],
    image: "/Ahmed.png",
    rating: 4.8,
    experience: 8,
    location: {
      en: "Riyadh",
      ar: "الرياض"
    },
    bio: {
      en: "Specialized in sports injuries and rehabilitation",
      ar: "متخصص في إصابات الرياضة والتأهيل"
    },
    price: 200,
    currency: "SAR",
    availability: {
      online: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      home: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    },
    languages: ["Arabic", "English"],
    education: ["DPT - King Saud University", "MSc Sports Medicine"],
    certifications: ["Licensed Physiotherapist", "Sports Injury Specialist"],
  },
  {
    id: "sarah-alshahri",
    name: {
      en: "Dr. Sarah Al-Shahri",
      ar: "د. سارة الشهري"
    },
    specialties: ["Orthopedic Physiotherapy", "العلاج الطبيعي العظمي"],
    image: "/Amani.png",
    rating: 4.9,
    experience: 12,
    location: {
      en: "Riyadh",
      ar: "الرياض"
    },
    bio: {
      en: "Expert in post-surgical rehabilitation and manual therapy",
      ar: "خبيرة في التأهيل بعد العمليات والعلاج اليدوي"
    },
    price: 250,
    currency: "SAR",
    availability: {
      online: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      home: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    },
    languages: ["Arabic", "English"],
    education: ["DPT - University of Toronto", "Fellowship in Manual Therapy"],
    certifications: ["Licensed Physiotherapist", "Manual Therapy Specialist", "Orthopedic Clinical Specialist"],
  },
  {
    id: "faisal-almutairi",
    name: {
      en: "Dr. Faisal Al-Mutairi",
      ar: "د. فيصل المطيري"
    },
    specialties: ["Neurological Physiotherapy", "العلاج الطبيعي العصبي"],
    image: "/Faisal.png",
    rating: 4.7,
    experience: 10,
    location: {
      en: "Jeddah",
      ar: "جدة"
    },
    bio: {
      en: "Specialized in stroke recovery and neurological conditions",
      ar: "متخصص في التعافي من السكتة الدماغية والحالات العصبية"
    },
    price: 220,
    currency: "SAR",
    availability: {
      online: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      home: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    },
    languages: ["Arabic", "English"],
    education: ["DPT - King Abdulaziz University", "MSc Neurological Rehabilitation"],
    certifications: ["Licensed Physiotherapist", "Neurological Clinical Specialist"],
  },
];

export function getTherapistById(id: string) {
  return therapists.find(t => t.id === id) || null;
}

export function getAllTherapists() {
  return therapists;
}

export function getTherapistsBySpecialty(specialty: string) {
  return therapists.filter(t => 
    t.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
  );
}

export function searchTherapists(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return therapists.filter(t => 
    t.name.en.toLowerCase().includes(lowercaseQuery) ||
    t.name.ar.includes(query) ||
    t.specialties.some(s => s.toLowerCase().includes(lowercaseQuery))
  );
}

export function getTherapistsByLocation(location: string) {
  return therapists.filter(t => 
    t.location.en.toLowerCase().includes(location.toLowerCase()) ||
    t.location.ar.includes(location)
  );
}

export function getOnlineTherapists() {
  return therapists.filter(t => t.availability.online && t.availability.online.length > 0);
}

export function getHomeVisitTherapists() {
  return therapists.filter(t => t.availability.home && t.availability.home.length > 0);
}