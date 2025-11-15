const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// GET /api/therapist/:id - جلب بيانات معالج محدد
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { locale = 'en' } = req.query;

    console.log('  جلب بيانات المعالج بالـ UUID:', id);

    //   البحث بالـ ID (UUID) فقط - إزالة البحث بالـ slug
    const { data: therapist, error } = await supabase
      .from('therapists')
      .select('*')
      .eq('id', id)  //   بحث بالـ UUID فقط
      .eq('is_active', true)
      .single();

    if (error || !therapist) {
      console.error(' المعالج غير موجود بالـ UUID:', id);
      return res.status(404).json({
        success: false,
        error: 'Therapist not found'
      });
    }

    console.log('  تم العثور على المعالج:', therapist.name_ar);

    // تنسيق البيانات لتتوافق مع هيكل الفرونت إند
    const formattedTherapist = {
      id: therapist.id,
      slug: therapist.slug,
      name: {
        ar: therapist.name_ar,
        en: therapist.name_en
      },
      role: {
        ar: therapist.role_ar,
        en: therapist.role_en
      },
      avatar: therapist.avatar_url || therapist.image,
      bio: {
        ar: therapist.bio_ar,
        en: therapist.bio_en
      },
      basePrice: therapist.base_price || therapist.hourly_rate || 150,
      experience: {
        ar: therapist.experience_ar || `${therapist.years_experience || 5} سنوات`,
        en: therapist.experience_en || `${therapist.years_experience || 5} years`
      },
      rating: therapist.rating || 4.5,
      session: {
        ar: therapist.session_type_ar || "جلسة أونلاين",
        en: therapist.session_type_en || "Online Session"
      },
      // بيانات إضافية من الجدول
      specialties: therapist.specialties || [therapist.role_ar, therapist.role_en],
      expertise: therapist.expertise || therapist.specialties || [therapist.role_ar, therapist.role_en],
      credentials: {
        yearsExperience: therapist.years_experience || 5,
        scfhsVerified: therapist.scfhs_verified || therapist.is_verified || false,
        education: therapist.education ? [therapist.education] : ["بكالوريوس علاج طبيعي"],
        certificates: therapist.certificates || ["رخصة هيئة التخصصات الصحية"]
      },
      languages: therapist.languages ? 
        therapist.languages.map(lang => 
          lang === 'arabic' ? 'العربية' : 
          lang === 'english' ? 'English' : lang
        ) : ["العربية", "English"],
      city: therapist.city || "الرياض",
      modes: therapist.modes || (therapist.session_type_ar ?
        (therapist.session_type_ar.includes('أونلاين') ? ['online'] :
         therapist.session_type_ar.includes('منزلية') ? ['home'] :
         ['online', 'home']) :
        ['online', 'home']),
      homeVisitFee: therapist.home_visit_fee || 100,
      nextAvailable: therapist.next_available || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      gender: therapist.gender || (therapist.name_ar && therapist.name_ar.includes('ة') ? 'female' : 'male'),
      approach: {
        ar: therapist.approach_ar || therapist.bio_ar,
        en: therapist.approach_en || therapist.bio_en
      },
      reviewCount: therapist.review_count || 0,
      availability: generateAvailability(therapist.available_days, therapist.available_times)
    };

    res.json({
      success: true,
      data: formattedTherapist,
      message: locale === 'ar' ? 'تم جلب بيانات المعالج بنجاح' : 'Therapist data fetched successfully'
    });

  } catch (error) {
    console.error('  خطأ في الخادم:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch therapist',
      details: error.message
    });
  }
});

// دالة لإنشاء بيانات التوفر
function generateAvailability(availableDays = [], availableTimes = []) {
  const availability = {};
  const days = availableDays.length > 0 ? availableDays : ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
  const times = availableTimes.length > 0 ? availableTimes : ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  
  // إنشاء توفر للأسبوع القادم
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
    
    if (days.includes(dayName)) {
      availability[dateString] = {
        home: times,
        online: times
      };
    }
  }
  
  return availability;
}

module.exports = router;