const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const { generateToken, authenticateToken } = require('../utils/jwt'); // استيراد صحيح

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /api/auth/signup - تسجيل مستخدم جديد
router.post('/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, password, role = 'patient' } = req.body;

    console.log('📧 بيانات التسجيل المستلمة:', req.body);

    // التحقق من البيانات
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'الاسم الأول، اسم العائلة، البريد الإلكتروني، وكلمة المرور مطلوبة'
      });
    }

    // التحقق من البريد الإلكتروني
    const { data: existingUser, error: checkError } = await supabase
      .from('patients')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'البريد الإلكتروني مسجل مسبقاً'
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);
    const national_id = `PAT_${Date.now()}`;

    // إدراج المستخدم الجديد
    const { data: user, error } = await supabase
      .from('patients')
      .insert([{
        national_id,
        first_name,
        last_name,
        email,
        phone: '0500000000',
        password_hash: hashedPassword,
        city: 'Riyadh',
        gender: 'male',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error(' خطأ في Supabase:', error);
      return res.status(500).json({
        success: false,
        error: 'فشل في تسجيل المستخدم',
        details: error.message
      });
    }

    // إنشاء token
    const token = generateToken({ 
      userId: user.national_id,
      email: user.email 
    });

    console.log('  تم تسجيل المستخدم بنجاح:', user.email);

    res.status(201).json({
      success: true,
      message: 'تم تسجيل حسابك بنجاح',
      token,
      user: {
        id: user.national_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: 'patient'
      }
    });

  } catch (error) {
    console.error(' خطأ في تسجيل المستخدم:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في تسجيل المستخدم',
      details: error.message
    });
  }
});

// POST /api/auth/login - تسجيل دخول
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('  محاولة تسجيل دخول:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      });
    }

    // البحث عن المستخدم
    const { data: user, error } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // تحديث آخر تسجيل دخول
    await supabase
      .from('patients')
      .update({
        last_login: new Date().toISOString()
      })
      .eq('national_id', user.national_id);

    // إنشاء token
    const token = generateToken({ 
      userId: user.national_id,
      email: user.email 
    });

    console.log('  تم تسجيل الدخول بنجاح:', user.email);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user.national_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: 'patient'
      }
    });
// POST /api/auth/therapist/login
router.post('/therapist/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن المعالج في قاعدة البيانات
    const { data: therapist, error } = await supabase
      .from('therapists')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !therapist) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // التحقق من كلمة المرور (يجب أن تكون مشفرة)
    // const isValidPassword = await bcrypt.compare(password, therapist.password_hash);
    // إذا كنت تستخدم كلمات مرور مشفرة

    // مؤقتاً: تحقق بسيط (في production استخدم bcrypt)
    if (password !== therapist.password) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // إنشاء token (يمكن استخدام jwt)
    const token = `th_${Math.random().toString(36).substr(2)}_${therapist.id}`;

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        token,
        therapist: {
          id: therapist.id,
          name_ar: therapist.name_ar,
          name_en: therapist.name_en,
          email: therapist.email,
          specialty: therapist.specialty
        }
      }
    });

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في تسجيل الدخول'
    });
  }
});
  } catch (error) {
    console.error(' خطأ في تسجيل الدخول:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في تسجيل الدخول'
    });
  }
});

// GET /api/auth/verify - التحقق من التوكن
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Token is valid',
    user: req.user 
  });
});

module.exports = router;