const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// أنظمة المصادقة المنفصلة
app.use('/api/auth/patients', require('./routes/auth-patients'));
app.use('/api/auth/specialists', require('./routes/auth-specialists'));

// بيانات المرضى المحمية
app.use('/api/patients', require('./routes/patients'));

// نظام الحجوزات
app.use('/api/bookings', require('./routes/bookings'));

// خطط العلاج
app.use('/api/treatment-plans', require('./routes/treatment-plans'));

// المختصين
app.use('/api/specialists', require('./routes/specialists'));

// التواصل
app.use('/api/contacts', require('./routes/contacts'));

// التقييمات
app.use('/api/ratings', require('./routes/ratings'));

// المفضلة
app.use('/api/favorites', require('./routes/favorites'));

// بيانات المعالجين (عام - بدون مصادقة)
app.get('/api/therapists', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { locale = 'ar' } = req.query;
    
    console.log('جلب المعالجين من Supabase...');

    const { data: therapists, error } = await supabase
      .from('therapists')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('خطأ في Supabase:', error);
      throw error;
    }

    console.log(`تم جلب ${therapists?.length || 0} معالج`);

    const formattedTherapists = therapists.map(therapist => ({
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
      avatar: therapist.avatar_url,
      bio: { 
        ar: therapist.bio_ar, 
        en: therapist.bio_en 
      },
      basePrice: therapist.base_price,
      experience: { 
        ar: therapist.experience_ar, 
        en: therapist.experience_en 
      },
      rating: therapist.rating,
      session: { 
        ar: therapist.session_type_ar, 
        en: therapist.session_type_en 
      }
    }));

    res.json({
      success: true,
      therapists: formattedTherapists
    });
    
  } catch (error) {
    console.error('خطأ في الخادم:', error);
    res.status(500).json({ 
      success: false,
      error: 'فشل في جلب بيانات المعالجين' 
    });
  }
});

// معالج محدد (عام - بدون مصادقة)
app.get('/api/therapists/:id', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { id } = req.params;
    const { locale = 'ar' } = req.query;
    
    console.log(`جلب المعالج بالـ UUID: ${id}`);

    const { data: therapist, error } = await supabase
      .from('therapists')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('خطأ في Supabase:', error);
      throw error;
    }

    if (!therapist) {
      return res.status(404).json({ 
        success: false,
        error: 'المعالج غير موجود' 
      });
    }

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
      avatar: therapist.avatar_url,
      bio: { 
        ar: therapist.bio_ar, 
        en: therapist.bio_en 
      },
      basePrice: therapist.base_price,
      experience: { 
        ar: therapist.experience_ar, 
        en: therapist.experience_en 
      },
      rating: therapist.rating,
      session: { 
        ar: therapist.session_type_ar, 
        en: therapist.session_type_en 
      }
    };

    res.json({
      success: true,
      therapist: formattedTherapist
    });
    
  } catch (error) {
    console.error('خطأ في الخادم:', error);
    res.status(500).json({ 
      success: false,
      error: 'فشل في جلب بيانات المعالج' 
    });
  }
});

app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: 'الباك إند يعمل بنظام الآمن!',
    version: '1.0 - نظام آمن',
    endpoints: {
      عامة: [
        'GET /api/therapists - قائمة المعالجين',
        'GET /api/therapists/:id - معالج محدد'
      ],
      مصادقة: [
        'POST /api/auth/patient/register - تسجيل مريض جديد',
        'POST /api/auth/patient/login - تسجيل دخول المريض'
      ],
      محمية: [
        'GET /api/patients/profile - بيانات المريض (محمي)',
        'GET /api/patients/bookings - حجوزات المريض (محمي)',
        'PUT /api/patients/profile - تحديث البيانات (محمي)'
      ],
      حجوزات: [
        'GET /api/bookings/availability - المواعيد المتاحة',
        'POST /api/bookings - إنشاء حجز',
        'PUT /api/bookings/:id/reschedule - إعادة جدولة'
      ]
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'حدث خطأ في الخادم!' 
  });
});

// Route not found - يجب أن يكون آخر شيء
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'الرابط غير موجود' 
  });
});

app.listen(PORT, () => {
  console.log(`الباك إند يعمل على http://localhost:${PORT}`);
  console.log(`نظام آمن - جاهز للطلبات!`);
  console.log(`استخدم GET /api لرؤية جميع الـ endpoints`);
});