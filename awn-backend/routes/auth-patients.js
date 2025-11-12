const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const { generateToken } = require('../utils/jwt');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /api/auth/patients/register - تسجيل مريض جديد
router.post('/register', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role
    } = req.body;

    console.log('محاولة تسجيل مريض جديد:', email);

    // التحقق من البيانات المطلوبة
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'بيانات ناقصة',
        details: 'الاسم الأول، اسم العائلة، البريد، وكلمة المرور مطلوبة'
      });
    }

    // التحقق من عدم وجود مريض مسجل مسبقاً
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        error: 'البريد الإلكتروني مسجل مسبقاً'
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // تسجيل المريض الجديد
    const { data: patient, error } = await supabase
      .from('patients')
      .insert([
        {
          first_name,
          last_name,
          email: email.toLowerCase(),
          password_hash: hashedPassword,
          login_attempts: 0,
          account_locked: false,
          email_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('خطأ في تسجيل المريض:', error);
      return res.status(500).json({
        success: false,
        error: 'فشل في إنشاء الحساب',
        details: error.message
      });
    }

    // إنشاء OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // حفظ OTP
    await supabase
      .from('patients')
      .update({
        otp_code: otpCode,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 دقائق
      })
      .eq('id', patient.id);

    // إنشاء token مؤقت - استخدام patient.id بدلاً من national_id
    const tempToken = generateToken({ 
      patientId: patient.id,        // ✅ استخدام patient.id
      email: patient.email,
      type: 'patient',
      verified: false
    }, '15m');

    console.log('تم تسجيل المريض بنجاح:', patient.id);

    res.status(201).json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      tempToken,
      email: patient.email,
      otp: otpCode // للتطوير فقط
    });

  } catch (error) {
    console.error('خطأ في تسجيل المريض:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في تسجيل المريض',
      details: error.message || 'حدث خطأ غير متوقع'
    });
  }
});

// POST /api/auth/patients/login - تسجيل دخول المريض
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('محاولة تسجيل دخول مريض:', email);

    // البحث عن المريض بالبريد الإلكتروني
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !patient) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // التحقق من حالة الحساب
    if (patient.account_locked) {
      return res.status(423).json({
        success: false,
        error: 'الحساب مغلق مؤقتاً',
        details: 'يرجى التواصل مع الدعم الفني'
      });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, patient.password_hash);

    if (!isPasswordValid) {
      // زيادة عدد محاولات الدخول الفاشلة
      const newAttempts = (patient.login_attempts || 0) + 1;
      const shouldLockAccount = newAttempts >= 5;

      await supabase
        .from('patients')
        .update({
          login_attempts: newAttempts,
          account_locked: shouldLockAccount
        })
        .eq('id', patient.id); // ✅ استخدام patient.id بدلاً من national_id

      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        remaining_attempts: 5 - newAttempts,
        account_locked: shouldLockAccount
      });
    }

    // إنشاء OTP للدخول
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // تحديث OTP وإعادة تعيين المحاولات
    await supabase
      .from('patients')
      .update({
        login_attempts: 0,
        last_login: new Date(),
        otp_code: otpCode,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000)
      })
      .eq('id', patient.id); // ✅ استخدام patient.id بدلاً من national_id

    // إنشاء token مؤقت - استخدام patient.id بدلاً من national_id
    const tempToken = generateToken({ 
      patientId: patient.id,        // ✅ استخدام patient.id
      email: patient.email,
      type: 'patient',
      verified: false
    }, '15m');

    console.log('تم إرسال رمز التحقق للمريض:', patient.id);

    res.json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      tempToken,
      email: patient.email,
      otp: otpCode // للتطوير فقط
    });

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في تسجيل الدخول'
    });
  }
});

// POST /api/auth/patients/forgot-password - نسيان كلمة المرور
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body; 
    const { data: patient, error } = await supabase
      .from('patients')
      .select('id, first_name, email') // ✅ استخدام id بدلاً من national_id
      .eq('email', email.toLowerCase())
      .single();

    if (error || !patient) {
      return res.status(404).json({
        success: false,
        error: 'لا يوجد حساب مرتبط بالبريد الإلكتروني المدخل'
      });
    }

    // إنشاء token لإعادة تعيين كلمة المرور
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await supabase
      .from('patients')
      .update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry
      })
      .eq('id', patient.id); // ✅ استخدام patient.id بدلاً من email

    res.json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
      reset_token: resetToken 
    });

  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ 
      success: false,
      error: 'فشل في عملية إعادة تعيين كلمة المرور' 
    });
  }
});

module.exports = router;
