const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// GET /api/therapists
router.get('/', async (req, res) => {
  try {
    console.log(' جلب المعالجين من قاعدة البيانات...');

    const { data: therapists, error } = await supabase
      .from('therapists')
      .select('*')
      .eq('is_active', true)
      .order('name_en');

    if (error) {
      console.error('خطأ في جلب المعالجين:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }

    // تحويل البيانات لتتوافق مع هيكل الفرونت إند
// في routes/therapists.js - استبدل جزء formattedTherapists بهذا:
const formattedTherapists = therapists.map(therapist => ({
  id: therapist.id,
  name: {
    en: therapist.name_en || "Therapist",
    ar: therapist.name_ar || "معالج"
  },
  image: therapist.avatar_url || "/avatar-placeholder.jpg",
  specialties: {
    en: therapist.specialization ? 
      therapist.specialization.split(',').map(s => s.trim()).filter(s => s) : 
      ['Physical Therapy'],
    ar: therapist.specialization ? 
      therapist.specialization.split(',').map(s => s.trim()).filter(s => s) : 
      ['العلاج الطبيعي']
  },
  experience: therapist.years_experience || 5,
  languages: {
    en: (therapist.languages || ['arabic', 'english']).map(lang => 
      lang === 'arabic' ? 'Arabic' : 
      lang === 'english' ? 'English' : lang
    ),
    ar: (therapist.languages || ['arabic', 'english']).map(lang => 
      lang === 'arabic' ? 'العربية' : 
      lang === 'english' ? 'الإنجليزية' : lang
    )
  },
  city: therapist.city || "Riyadh",
  basePrice: therapist.base_price || therapist.hourly_rate || 150,
  credentials: {
    scfhsVerified: therapist.is_verified || false,
    yearsExperience: therapist.years_experience || 5
  },
  modes: therapist.session_type_ar ? 
    (therapist.session_type_ar.includes('أونلاين') ? ['online'] : 
     therapist.session_type_ar.includes('منزلية') ? ['home'] : 
     ['online', 'home']) : 
    ['online', 'home'],
  nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  gender: therapist.gender || (therapist.name_ar && therapist.name_ar.includes('ة') ? 'female' : 'male'),
  bio: {
    en: therapist.bio_en || "Qualified physical therapy specialist",
    ar: therapist.bio_ar || "أخصائي علاج طبيعي مؤهل"
  },
  rating: therapist.rating || 4.5
}));

    console.log(` تم جلب ${formattedTherapists.length} معالج بنجاح`);
    
    res.json({
      success: true,
      data: formattedTherapists,
      count: formattedTherapists.length
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
