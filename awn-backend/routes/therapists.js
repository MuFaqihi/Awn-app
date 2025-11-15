const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// GET /api/therapists - جلب جميع المعالجين
router.get('/', async (req, res) => {
  try {
    const { locale = 'en', city, specialization, mode } = req.query;
    
    console.log('  جلب المعالجين من قاعدة البيانات...');

    let query = supabase
      .from('therapists')
      .select('*')
      .eq('is_active', true);

    // تطبيق الفلاتر
    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (specialization) {
      query = query.ilike('specialization', `%${specialization}%`);
    }

    if (mode === 'online') {
      query = query.ilike('session_type_ar', '%أونلاين%');
    } else if (mode === 'home') {
      query = query.ilike('session_type_ar', '%منزل%');
    }

    const { data: therapists, error } = await query.order('name_en');

    if (error) {
      console.error(' خطأ في جلب المعالجين:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }

    // دالة مساعدة لتحويل languages إلى مصفوفة
    const parseLanguages = (languagesData) => {
      if (Array.isArray(languagesData)) {
        return languagesData;
      }
      
      if (typeof languagesData === 'string') {
        try {
          // محاولة تحليل JSON إذا كان النص بصيغة JSON
          const parsed = JSON.parse(languagesData);
          return Array.isArray(parsed) ? parsed : [languagesData];
        } catch {
          // إذا فشل التحليل، نفترض أنه نص مفصول بفاصلة
          return languagesData.split(',').map(lang => lang.trim()).filter(lang => lang);
        }
      }
      
      // القيمة الافتراضية إذا كانت languages غير محددة
      return ['arabic', 'english'];
    };

    // دالة مساعدة لتحويل أسماء اللغات
    const translateLanguages = (languagesArray, locale) => {
      const languageMap = {
        arabic: { en: 'Arabic', ar: 'العربية' },
        english: { en: 'English', ar: 'الإنجليزية' },
        french: { en: 'French', ar: 'الفرنسية' },
        spanish: { en: 'Spanish', ar: 'الإسبانية' }
      };

      return languagesArray.map(lang => {
        const normalizedLang = lang.toLowerCase().trim();
        if (languageMap[normalizedLang]) {
          return languageMap[normalizedLang][locale];
        }
        // إذا كانت اللغة غير معروفة في الخريطة، نعيدها كما هي
        return normalizedLang;
      });
    };

const formattedTherapists = therapists.map(therapist => ({
  id: therapist.id,
  slug: therapist.slug,
  name: {
    en: therapist.name_en,
    ar: therapist.name_ar
  },
  image: therapist.avatar_url || therapist.image || "/avatar-placeholder.jpg",
  specialties: {
    en: therapist.specialties ? 
      therapist.specialties.map(s => typeof s === 'string' ? s : String(s)) : 
      [therapist.role_en || "Physical Therapy"],
    ar: therapist.specialties ? 
      therapist.specialties.map(s => typeof s === 'string' ? s : String(s)) : 
      [therapist.role_ar || "العلاج الطبيعي"]
  },
  experience: therapist.years_experience || 5,
  languages: therapist.languages ? 
    therapist.languages.map(lang => 
      lang === 'arabic' ? 'العربية' : 
      lang === 'english' ? 'English' : String(lang)
    ) : ["العربية", "English"],
  city: therapist.city || "Riyadh",
  basePrice: therapist.base_price || therapist.hourly_rate || 150,
  credentials: {
    scfhsVerified: therapist.scfhs_verified || therapist.is_verified || false,
    yearsExperience: therapist.years_experience || 5
  },
  modes: therapist.modes || (therapist.session_type_ar ?
    (therapist.session_type_ar.includes('أونلاين') ? ['online'] :
     therapist.session_type_ar.includes('منزلية') ? ['home'] :
     ['online', 'home']) :
    ['online', 'home']),
  nextAvailable: therapist.next_available || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  gender: therapist.gender || (therapist.name_ar && therapist.name_ar.includes('ة') ? 'female' : 'male'),
  bio: {
    en: therapist.bio_en || "Qualified physical therapy specialist",
    ar: therapist.bio_ar || "أخصائي علاج طبيعي مؤهل"
  },
  rating: therapist.rating || 4.5
}));
  

    console.log(`  تم جلب ${formattedTherapists.length} معالج بنجاح`);
    
    res.json({
      success: true,
      data: formattedTherapists,
      count: formattedTherapists.length,
      message: locale === 'ar' ? 'تم جلب بيانات المعالجين بنجاح' : 'Therapists data fetched successfully'
    });

  } catch (error) {
    console.error(' خطأ غير متوقع:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

module.exports = router;