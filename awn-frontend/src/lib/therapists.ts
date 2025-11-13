
const therapists = [
 {
  id: "thamer-alshahrani",
  name: {
    en: "Thamer Alshahrani",
    ar: "ثامر الشهراني"
  },
  specialties: ["Musculoskeletal Physiotherapy", "العلاج الطبيعي العضلي الهيكلي"],
  image: "/thamir.png",
  rating: 4.8,
  experience: 5,
  location: {
    en: "Riyadh",
    ar: "الرياض"
  },
  bio: {
    en: "Musculoskeletal physiotherapy and sports injuries.",
    ar: "العلاج الطبيعي العضلي الهيكلي والإصابات الرياضية."
  },
  price: 200,
  currency: "SAR",
  availability: {
    online: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    home: []
  },
  languages: ["Arabic"],
  education: ["Bachelor of Physiotherapy"],
  certifications: ["SCFHS Licensed"],
},

{
  id: "khaled-habib",
  name: {
    en: "Khaled Habib",
    ar: "خالد حبيب"
  },
  specialties: ["Orthopedic Physiotherapy", "العلاج الطبيعي العظمي"],
  image: "/khalid.jpg",
  rating: 4.8,
  experience: 6,
  location: {
    en: "Riyadh",
    ar: "الرياض"
  },
  bio: {
    en: "Muscle and skeletal disorders, advanced manual therapy.",
    ar: "مشاكل العضلات، العظام، والعلاج اليدوي المتقدم."
  },
  price: 200,
  currency: "SAR",
  availability: {
    online: [],
    home: ["09:00", "11:00", "14:00", "15:00"]
  },
  languages: ["Arabic"],
  education: ["Bachelor of Physiotherapy"],
  certifications: ["SCFHS Licensed"],
},

 {
  id: "ayman-alsaadi",
  name: {
    en: "Ayman Alsaadi",
    ar: "أيمن الصاعدي"
  },
  specialties: ["General Physiotherapy", "العلاج الطبيعي العام"],
  image: "/Ayman.jpg",
  rating: 4.7,
  experience: 4,
  location: {
    en: "Riyadh",
    ar: "الرياض"
  },
  bio: {
    en: "General physical therapy and rehabilitation.",
    ar: "إعادة التأهيل والعلاج الطبيعي العام."
  },
  price: 200,
  currency: "SAR",
  availability: {
    online: [],
    home: ["09:00", "10:00", "14:00"]
  },
  languages: ["Arabic"],
  education: ["Bachelor of Physiotherapy"],
  certifications: ["SCFHS Licensed"],
},

{
  id: "abdullah-alshahrani",
  name: {
    en: "Abdullah Alshahrani",
    ar: "عبدالله الشهراني"
  },
  specialties: ["Orthopedic", "Sports","إصابات العظام، الإصابات الرياضية، والعلاج اليدوي ."],
  image: "/abdullah.jpg",
  rating: 4.9,
  experience: 5,
  location: {
    en: "Riyadh",
    ar: "الرياض"
  },
  bio: {
    en: "Orthopedic injuries, sports injuries, and manual therapy.",
    ar: "إصابات العظام، الإصابات الرياضية، والعلاج اليدوي."
  },
  price: 200,
  currency: "SAR",
  availability: {
    online: ["09:00", "10:00", "11:00", "15:00"],
    home: []
  },
  languages: ["Arabic"],
  education: ["Bachelor of Physiotherapy"],
  certifications: ["SCFHS Licensed"],
},

{
  id: "nismah-alalshi",
  name: {
    en: "Nismah Alalshi",
    ar: "نسمة العلشي"
  },
  specialties: ["Women Physiotherapy", "العلاج الطبيعي للنساء"],
  image: "/Nismah.jpg",
  rating: 4.9,
  experience: 5,
  location: {
    en: "Riyadh",
    ar: "الرياض"
  },
  bio: {
    en: "Women’s health & postpartum rehabilitation specialist.",
    ar: "ضعف عضلات قاع الحوض وآلام ما بعد الولادة."
  },
  price: 200,
  currency: "SAR",
  availability: {
    online: [],
    home: ["09:00", "10:00", "14:00"]
  },
  languages: ["Arabic"],
  education: ["Bachelor of Physiotherapy"],
  certifications: ["SCFHS Licensed"],
},

{
  id: "alaa-ahmed",
  name: {
    en: "Alaa Ahmed",
    ar: "الاء أحمد"
  },
  specialties: ["Geriatrics", "العلاج الطبيعي للمسنين"],
  image: "/Alaa.png",
  rating: 4.8,
  experience: 4,
  location: {
    en: "Riyadh",
    ar: "الرياض"
  },
  bio: {
    en: "Geriatric physical therapist.",
    ar: "أخصائية علاج طبيعي للمسنين."
  },
  price: 200,
  currency: "SAR",
  availability: {
    online: ["09:00", "10:00", "11:00", "15:00"],
    home: []
  },
  languages: ["Arabic"],
  education: ["Bachelor of Physiotherapy"],
  certifications: ["SCFHS Licensed"],
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