const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

//  Routes الأساسية
app.use('/api/therapists', require('./routes/therapists'));

//  أنظمة المصادقة المنفصلة (الحقيقية)
app.use('/api/auth/patients', require('./routes/auth-patients'));
app.use('/api/auth/specialists', require('./routes/auth-specialists'));

//  بيانات المرضى المحمية
app.use('/api/patients', require('./routes/patients'));

//  نظام الحجوزات
app.use('/api/bookings', require('./routes/bookings'));

//  خطط العلاج
app.use('/api/treatment-plans', require('./routes/treatment-plans'));

// المختصين
app.use('/api/specialists', require('./routes/specialists'));

// التواصل
app.use('/api/contacts', require('./routes/contacts'));

//  التقييمات
app.use('/api/ratings', require('./routes/ratings'));

app.use('/api/favorites', require('./routes/favorites'));
app.post('/api/auth/signup', (req, res) => {
  console.log('تسجيل جديد سريع:', req.body);
  res.json({
    success: true,
    token: 'real-token-' + Date.now(),
    user: {
      id: 'PAT_' + Date.now(),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      role: 'patient'
    }
  });
});

// 🔧 Appointments routes سريعة
app.get('/api/appointments', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'قائمة المواعيد جاهزة'
  });
});

app.post('/api/appointments', (req, res) => {
  console.log(' حجز موعد سريع:', req.body);
  res.status(201).json({
    success: true,
    data: {
      id: 'appt-' + Date.now(),
      therapistId: req.body.therapistId,
      date: req.body.date,
      time: req.body.time,
      kind: req.body.kind,
      status: 'upcoming',
      note: req.body.note
    },
    message: 'تم الحجز بنجاح'
  });
});

// 🔧 بيانات المعالجين (من الإصدار الثاني)
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

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'الباك إند يعمل!',
    timestamp: new Date().toISOString()
  });
});

// 🔧 Debug endpoint (من الإصدار الأول)
app.get('/api/debug', (req, res) => {
  res.json({
    success: true,
    endpoints: [
      'GET /api/health',
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET /api/therapists', 
      'GET /api/therapists/:id',
      'GET /api/appointments',
      'POST /api/appointments',
      'GET /api/bookings',
      'POST /api/bookings',
      'GET /api/patients/profile',
      'GET /api/specialists'
    ]
  });
});

// 🔧 Endpoint الرئيسي (من الإصدار الثاني)
app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: 'الباك إند يعمل بنظام متكامل!',
    version: '2.0 - نظام متكامل',
    timestamp: new Date().toISOString(),
    endpoints: {
      عامة: [
        'GET /api/health - فحص الحالة',
        'GET /api/debug - قائمة النقاط',
        'GET /api/therapists - قائمة المعالجين',
        'GET /api/therapists/:id - معالج محدد'
      ],
      مصادقة: [
        'POST /api/auth/patients/register - تسجيل مريض جديد',
        'POST /api/auth/patients/login - تسجيل دخول المريض',
        'POST /api/auth/signup - تسجيل سريع (اختبار)',
        'POST /api/auth/login - تسجيل دخول سريع (اختبار)'
      ],
      محمية: [
        'GET /api/patients/profile - بيانات المريض',
        'PUT /api/patients/profile - تحديث البيانات',
        'GET /api/patients/bookings - حجوزات المريض'
      ],
      حجوزات: [
        'GET /api/bookings - الحجوزات',
        'POST /api/bookings - إنشاء حجز',
        'GET /api/appointments - المواعيد (سريع)',
        'POST /api/appointments - حجز موعد (سريع)'
      ],
      إضافية: [
        'GET /api/specialists - المختصين',
        'GET /api/treatment-plans - خطط العلاج',
        'GET /api/ratings - التقييمات',
        'GET /api/favorites - المفضلة'
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
  console.log(`الباك إند المتكامل شغال على port ${PORT}`);
  console.log(` جاهز للاتصال مع الفرونت إند`);
  console.log(`النظام يحتوي على:`);
  console.log(`  نظام مصادقة كامل (مرضى + مختصين)`);
  console.log(` إدارة المرضى والمختصين`);
  console.log(`  نظام حجوزات متكامل`);
  console.log   (` خطط العلاج والمتابعة`);
  console.log(`  نظام التقييمات والمفضلة`);
  console.log(`  routes سريعة للاختبار`);
});
