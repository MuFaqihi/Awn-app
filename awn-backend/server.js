const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false,
      error: 'Invalid or expired token' 
    });
  }
};

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes الأساسية
app.use('/api/therapists', require('./routes/therapists'));
app.use('/api/therapist', require('./routes/therapist'));
app.use('/api/booking', require('./routes/booking'));

//   AUTH - تسجيل الدخول والتسجيل
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;
    
    console.log('  تسجيل مريض جديد:', { first_name, email });

    // إنشاء مريض في قاعدة البيانات
    const { data: patient, error } = await supabase
      .from('patients')
      .insert([
        {
          first_name,
          last_name, 
          email,
          phone,
          national_id: 'TEMP_' + Date.now(),
          password_hash: password
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(' خطأ في إنشاء المريض:', error);
      return res.status(500).json({
        success: false,
        error: 'فشل في إنشاء الحساب'
      });
    }

    // إنشاء token
    const token = jwt.sign(
      {
        id: patient.id,
        email: patient.email,
        first_name: patient.first_name,
        last_name: patient.last_name, 
        role: 'patient'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('  تم إنشاء المريض بنجاح:', patient.id);
    
    res.json({
      success: true,
      token: token,
      user: {
        id: patient.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        role: 'patient'
      }
    });

  } catch (error) {
    console.error(' خطأ غير متوقع في التسجيل:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('  محاولة تسجيل دخول:', email);

    // البحث عن المريض
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !patient) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // تحقق من كلمة المرور (مبسط)
    if (patient.password_hash !== password) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // إنشاء token
    const token = jwt.sign(
      {
        id: patient.id,
        email: patient.email,
        first_name: patient.first_name,
        last_name: patient.last_name,
        role: 'patient'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('  تسجيل دخول ناجح:', patient.id);
    
    res.json({
      success: true,
      token: token,
      user: {
        id: patient.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        role: 'patient'
      }
    });

  } catch (error) {
    console.error(' خطأ في تسجيل الدخول:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

//   APPOINTMENTS - إدارة المواعيد
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const patientId = req.user.id;
    console.log('  جلب مواعيد المريض:', patientId);

    // البحث في appointments
    const { data: appointments, error: aptError } = await supabase
      .from('appointments')
      .select(`
        id,
        patient_id,
        therapist_id, 
        date,
        time,
        kind,
        status,
        patient_notes,
        meet_link,
        created_at,
        therapists (
          name_ar,
          name_en,
          avatar_url
        )
      `)
      .eq('patient_id', patientId)
      .order('date', { ascending: true });

    if (aptError) {
      console.error(' خطأ في appointments:', aptError);
    }

    // البحث في bookings
    const { data: bookings, error: bookError } = await supabase
      .from('bookings')
      .select(`
        id,
        therapist_id,
        user_name,
        user_email,
        booking_date,
        booking_time, 
        session_type,
        status,
        notes,
        created_at,
        therapists (
          name_ar, 
          name_en,
          avatar_url
        )
      `)
      .eq('user_email', req.user.email)
      .order('booking_date', { ascending: true });

    if (bookError) {
      console.error(' خطأ في bookings:', bookError);
    }

    // دمج النتائج
    const allAppointments = [
      ...(appointments || []).map(apt => ({
        ...apt,
        source: 'appointments'
      })),
      ...(bookings || []).map(book => ({
        id: book.id,
        therapist_id: book.therapist_id,
        date: book.booking_date,
        time: book.booking_time,
        kind: book.session_type,
        status: book.status,
        note: book.notes,
        created_at: book.created_at,
        therapists: book.therapists,
        source: 'bookings'
      }))
    ];

    console.log(`  تم جلب ${allAppointments.length} موعد/حجز`);
    
    res.json({
      success: true,
      data: allAppointments,
      count: allAppointments.length
    });

  } catch (error) {
    console.error(' خطأ غير متوقع:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const patientId = req.user.id;
    const { therapistId, date, time, kind, note } = req.body;

    console.log('  إنشاء موعد جديد:', { patientId, therapistId, date, time, kind });

    // إنشاء الحجز في bookings
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([
        {
          therapist_id: therapistId,
          user_email: req.user.email,
          user_name: `${req.user.first_name} ${req.user.last_name}`,
          booking_date: date,
          booking_time: time,
          session_type: kind,
          notes: note,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(' خطأ في إنشاء الحجز:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log('  تم إنشاء الحجز بنجاح:', booking.id);
    
    res.status(201).json({
      success: true,
      data: {
        id: booking.id,
        therapist_id: booking.therapist_id,
        date: booking.booking_date,
        time: booking.booking_time,
        kind: booking.session_type,
        status: booking.status,
        note: booking.notes,
        source: 'bookings'
      },
      message: 'تم إنشاء الحجز بنجاح وجاري انتظار الموافقة'
    });

  } catch (error) {
    console.error(' خطأ غير متوقع:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

//   HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'الباك إند يعمل!',
    timestamp: new Date().toISOString()
  });
});

//   DEBUG ENDPOINTS
app.get('/api/debug/patients', async (req, res) => {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('id, first_name, last_name, email')
      .limit(5);

    res.json({
      success: true,
      data: patients || [],
      count: patients?.length || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/debug/appointments', async (req, res) => {
  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('id, patient_id, date, status')
      .limit(10);

    res.json({
      success: true,
      data: appointments || [],
      count: appointments?.length || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(` الباك إند الشامل شغال على port ${PORT}`);
  console.log(` جاهز للاتصال مع الفرونت إند`);
  console.log(`   POST /api/auth/signup - تسجيل جديد`);
  console.log(`   POST /api/auth/login - تسجيل دخول`);
  console.log(`   GET  /api/appointments - جلب المواعيد`);
  console.log(`   POST /api/appointments - إنشاء موعد`);
  console.log(`   GET  /api/health - فحص الحالة`);
});