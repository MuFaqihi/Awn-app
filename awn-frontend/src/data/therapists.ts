// Define the Therapist type
export type Therapist = {
  id: string;
  name: { ar: string; en: string };
  image: string;
  specialties: string[];
  rating?: number;
  reviewCount?: number;
  credentials: {
    yearsExperience: number;
    scfhsVerified: boolean;
    education: string[];
    certificates: string[];
  };
  languages: string[];
  bio: { ar: string; en: string };
  approach: { ar: string; en: string };
  expertise: string[];
  city: string;
  gender: "male" | "female";
  modes: Array<"home" | "online">; // Only home and online
  durations: number[];
  basePrice: number;
  homeVisitFee: number;
  nextAvailable: string;
  availability: Record<string, Record<"home" | "online", string[]>>;
  reviews: any[]; // You can define a proper Review type later
};

// Helper function to create realistic availability patterns
const createAvailabilityPattern = (
  therapistType: 'busy' | 'moderate' | 'available', 
  modes: ('online' | 'home')[],
  workingDaysPerWeek: 3 | 4 | 5 = 5
): Record<string, Record<"home" | "online", string[]>> => {
  const availability: Record<string, Record<"home" | "online", string[]>> = {}

  // Define working days based on therapist preference
  const getWorkingDays = () => {
    switch (workingDaysPerWeek) {
      case 3: return [1, 2, 3] // Monday, Tuesday, Wednesday
      case 4: return [0, 1, 2, 3] // Sunday, Monday, Tuesday, Wednesday
      case 5: return [0, 1, 2, 3, 4] // Sunday through Thursday
      default: return [0, 1, 2, 3, 4]
    }
  }

  const workingDays = getWorkingDays()

  // November 2024 - Limited availability (from Nov 1st onwards)
  const getNovemberSlots = () => {
    const availableDates = []
    // Start from November 1st, 2024
    for (let day = 1; day <= 30; day++) {
      const date = new Date(2024, 10, day) // November 2024
      const dayOfWeek = date.getDay()
      
      // Only include working days and exclude some dates based on therapist type
      if (workingDays.includes(dayOfWeek)) {
        switch (therapistType) {
          case 'busy':
            // Only available 2-3 days per week
            if (day % 3 === 0 || day % 7 === 0) {
              availableDates.push(date.toISOString().split('T')[0])
            }
            break
          case 'moderate':
            // Available 3-4 days per week
            if (day % 2 === 0) {
              availableDates.push(date.toISOString().split('T')[0])
            }
            break
          case 'available':
            // Available most working days
            availableDates.push(date.toISOString().split('T')[0])
            break
        }
      }
    }

    return {
      dates: availableDates,
      online: therapistType === 'busy' ? ["14:00", "15:00"] : 
              therapistType === 'moderate' ? ["09:00", "10:00", "14:00", "15:00"] :
              ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      home: therapistType === 'busy' ? ["14:00"] :
            therapistType === 'moderate' ? ["09:00", "15:00"] :
            ["09:00", "10:00", "14:00", "15:00"]
    }
  }

  // December 2024 - Holiday season, even more limited
  const getDecemberSlots = () => {
    const availableDates = []
    for (let day = 1; day <= 31; day++) {
      const date = new Date(2024, 11, day) // December 2024
      const dayOfWeek = date.getDay()
      
      // Skip holidays and only work half the normal schedule
      if (workingDays.includes(dayOfWeek) && day < 20) { // Stop before holidays
        switch (therapistType) {
          case 'busy':
            if (day % 5 === 0) {
              availableDates.push(date.toISOString().split('T')[0])
            }
            break
          case 'moderate':
            if (day % 3 === 0) {
              availableDates.push(date.toISOString().split('T')[0])
            }
            break
          case 'available':
            if (day % 2 === 0) {
              availableDates.push(date.toISOString().split('T')[0])
            }
            break
        }
      }
    }

    return {
      dates: availableDates,
      online: therapistType === 'busy' ? ["15:00", "16:00"] :
              therapistType === 'moderate' ? ["09:00", "10:00", "15:00", "16:00"] :
              ["09:00", "10:00", "14:00", "15:00", "16:00"],
      home: therapistType === 'busy' ? ["15:00"] :
            therapistType === 'moderate' ? ["10:00", "15:00"] :
            ["09:00", "14:00", "15:00"]
    }
  }

  // Apply November 2024
  const novSlots = getNovemberSlots()
  novSlots.dates.forEach(date => {
    availability[date] = {
      online: modes.includes('online') ? novSlots.online : [],
      home: modes.includes('home') ? novSlots.home : []
    }
  })

  // Apply December 2024
  const decSlots = getDecemberSlots()
  decSlots.dates.forEach(date => {
    availability[date] = {
      online: modes.includes('online') ? decSlots.online : [],
      home: modes.includes('home') ? decSlots.home : []
    }
  })

  // 2025 - Full year availability based on working days
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2025, month + 1, 0).getDate()
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2025, month, day)
      const dayOfWeek = date.getDay()
      
      // Only include working days
      if (workingDays.includes(dayOfWeek)) {
        const dateStr = date.toISOString().split('T')[0]
        
        availability[dateStr] = {
          online: modes.includes('online') ? 
            ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"] : 
            [],
          home: modes.includes('home') ? 
            ["09:00", "10:00", "14:00", "15:00", "16:00"] : 
            []
        }
      }
    }
  }

  // 2026 - Even more availability (new year, fresh start)
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2026, month + 1, 0).getDate()
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2026, month, day)
      const dayOfWeek = date.getDay()
      
      // Only include working days
      if (workingDays.includes(dayOfWeek)) {
        const dateStr = date.toISOString().split('T')[0]
        
        availability[dateStr] = {
          online: modes.includes('online') ? 
            ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"] : 
            [],
          home: modes.includes('home') ? 
            ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"] : 
            []
        }
      }
    }
  }
  
  return availability
}

export const therapists: Therapist[] = [
  {
    id: "ahmed-alotaibi",
    name: { ar: "أحمد العتيبي", en: "Ahmed Al-Otaibi" },
    specialties: ["Pediatric", "Developmental"],
    reviewCount: 42,
    basePrice: 200,
    languages: ["Arabic", "English"],
    modes: ["online", "home"],
    durations: [30, 45, 60, 90, 120],
    bio: {
      ar: "يؤمن بأن اللعب والتفاعل الإيجابي أساس نجاح جلسات الأطفال.",
      en: "Believes play and positive interaction are key to children's progress."
    },
    approach: {
      ar: "نهج تفاعلي يركز على اللعب والأنشطة المحفزة للأطفال",
      en: "Interactive approach focusing on play and engaging activities for children"
    },
    credentials: {
      scfhsVerified: true,
      yearsExperience: 10,
      education: ["DPT - King Saud University", "Pediatric Physiotherapy Certificate"],
      certificates: ["SCFHS Licensed", "Pediatric Clinical Specialist"]
    },
    expertise: ["Motor Development", "Cerebral Palsy", "Autism Support", "Balance Training"],
    homeVisitFee: 100,
    nextAvailable: "2024-11-03", // First available date in November
    city: "Riyadh",
    gender: "male",
    image: "/Ahmed.png",
    availability: createAvailabilityPattern('moderate', ['online', 'home'], 5), // Works 5 days a week
    reviews: []
  },
  {
    id: "sarah-alshahri",
    name: { ar: "سارة الشهري", en: "Sarah Al-Shahri" },
    specialties: ["Women's Health", "Postpartum"],
    reviewCount: 38,
    basePrice: 200,
    languages: ["Arabic", "English"],
    modes: ["home", "online"],
    durations: [45, 60, 90, 120],
    bio: {
      ar: "تركّز على صحة المرأة بشكل متكامل وتساعد في استعادة التوازن بعد الحمل والولادة.",
      en: "Focuses on holistic women's health and recovery after childbirth."
    },
    approach: {
      ar: "نهج شامل يركز على احتياجات المرأة الخاصة",
      en: "Comprehensive approach focusing on women's specific needs"
    },
    credentials: {
      scfhsVerified: true,
      yearsExperience: 8,
      education: ["DPT - King Abdulaziz University", "Women's Health Specialist"],
      certificates: ["SCFHS Licensed", "Women's Health Specialist", "Prenatal/Postnatal Therapy"]
    },
    expertise: ["Pregnancy Care", "Postpartum Recovery", "Pelvic Floor", "Diastasis Recti"],
    homeVisitFee: 100,
    nextAvailable: "2024-11-06", // Busy therapist, later availability
    city: "Riyadh",
    gender: "female",
    image: "/Sarah.png",
    availability: createAvailabilityPattern('busy', ['home', 'online'], 3), // Works only 3 days a week
    reviews: []
  },
  {
    id: "mohammed-alghamdi",
    name: { ar: "محمد الغامدي", en: "Mohammed Al-Ghamdi" },
    specialties: ["Sports", "Rehabilitation"],
    reviewCount: 67,
    basePrice: 200,
    languages: ["Arabic", "English"],
    modes: ["home", "online"],
    durations: [45, 60, 90, 120],
    bio: {
      ar: "يساعد الرياضيين على استعادة لياقتهم بسرعة وأمان باستخدام أحدث طرق العلاج.",
      en: "Helps athletes recover safely and efficiently with modern techniques."
    },
    approach: {
      ar: "نهج متخصص في إعادة تأهيل الرياضيين",
      en: "Specialized approach in athletic rehabilitation"
    },
    credentials: {
      scfhsVerified: true,
      yearsExperience: 7,
      education: ["DPT - Imam University", "Sports Medicine Certificate"],
      certificates: ["SCFHS Licensed", "Sports Rehabilitation Specialist"]
    },
    expertise: ["Sports Injuries", "ACL Recovery", "Shoulder Rehab", "Performance Enhancement"],
    homeVisitFee: 100,
    nextAvailable: "2024-11-02", // Very available
    city: "Riyadh",
    gender: "male",
    image: "/Mohammed.png",
    availability: createAvailabilityPattern('available', ['home', 'online'], 5), // Works 5 days a week
    reviews: []
  },
  {
    id: "huda-alqahtani",
    name: { ar: "هدى القحطاني", en: "Huda Al-Qahtani" },
    specialties: ["Neurological", "Stroke Recovery"],
    reviewCount: 29,
    basePrice: 200,
    languages: ["Arabic", "English"],
    modes: ["online"],
    durations: [45, 60, 90, 120],
    bio: {
      ar: "متخصصة في إعادة التأهيل العصبي والتعافي من السكتة الدماغية",
      en: "Specialized in neurological rehabilitation and stroke recovery"
    },
    approach: {
      ar: "نهج متدرج يركز على استعادة الوظائف العصبية",
      en: "Progressive approach focusing on neurological function restoration"
    },
    credentials: {
      scfhsVerified: true,
      yearsExperience: 9,
      education: ["DPT - Princess Nourah University", "Neuro Rehab Specialist"],
      certificates: ["SCFHS Licensed", "Neurological Rehabilitation Specialist"]
    },
    expertise: ["Stroke Recovery", "Parkinson's", "Multiple Sclerosis", "Brain Injury"],
    homeVisitFee: 0,
    nextAvailable: "2024-11-04",
    city: "Riyadh",
    gender: "female",
    image: "/Huda.png",
    availability: createAvailabilityPattern('moderate', ['online'], 4), // Works 4 days a week, online only
    reviews: []
  },
  {
    id: "faisal-alharbi",
    name: { ar: "فيصل الحربي", en: "Faisal Al-Harbi" },
    specialties: ["Orthopedic", "Manual Therapy"],
    reviewCount: 54,
    basePrice: 200,
    languages: ["Arabic"],
    modes: ["home", "online"],
    durations: [60, 90, 120],
    bio: {
      ar: "خبير في العلاج اليدوي وإصابات العظام والمفاصل",
      en: "Expert in manual therapy and orthopedic injuries"
    },
    approach: {
      ar: "نهج يدوي متخصص في علاج آلام المفاصل",
      en: "Manual therapy approach specialized in joint pain treatment"
    },
    credentials: {
      scfhsVerified: true,
      yearsExperience: 12,
      education: ["DPT - King Fahd University", "Manual Therapy Certification"],
      certificates: ["SCFHS Licensed", "Orthopedic Manual Therapy Specialist"]
    },
    expertise: ["Back Pain", "Joint Mobilization", "Posture Correction", "Manual Therapy"],
    homeVisitFee: 100,
    nextAvailable: "2024-11-05",
    city: "Riyadh",
    gender: "male",
    image: "/Faisal.png",
    availability: createAvailabilityPattern('busy', ['home', 'online'], 3), // Works 3 days a week
    reviews: []
  },
  {
    id: "amani-aldosari",
    name: { ar: "أماني الدوسري", en: "Amani Al-Dosari" },
    specialties: ["Geriatric", "Elderly Care"],
    reviewCount: 31,
    basePrice: 200,
    languages: ["Arabic", "English"],
    modes: ["online", "home"],
    durations: [45, 60, 90],
    bio: {
      ar: "متخصصة في العلاج الطبيعي للمسنين وتحسين جودة الحياة",
      en: "Specialized in geriatric physiotherapy and improving quality of life"
    },
    approach: {
      ar: "نهج لطيف ومتدرج مناسب لكبار السن",
      en: "Gentle, progressive approach suitable for elderly patients"
    },
    credentials: {
      scfhsVerified: true,
      yearsExperience: 6,
      education: ["DPT - King Saud University", "Geriatric Care Certificate"],
      certificates: ["SCFHS Licensed", "Geriatric Physiotherapy Specialist"]
    },
    expertise: ["Fall Prevention", "Mobility Training", "Arthritis Care", "Balance Training"],
    homeVisitFee: 100,
    nextAvailable: "2024-11-02",
    city: "Riyadh",
    gender: "female",
    image: "/Amani.png",
    availability: createAvailabilityPattern('available', ['online', 'home'], 5), // Works 5 days a week
    reviews: []
  }
]