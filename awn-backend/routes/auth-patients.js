// routes/auth-patients.js
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
      firstName,  // Changed from first_name
      lastName,   // Changed from last_name
      email,
      password,
      role
    } = req.body;

    console.log('محاولة تسجيل مريض جديد:', email);

    // التحقق من البيانات المطلوبة
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'بيانات ناقصة',
        details: 'الاسم الأول، اسم العائلة، البريد، وكلمة المرور مطلوبة'
      });
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'بريد إلكتروني غير صالح'
      });
    }

    // التحقق من عدم وجود مريض مسجل مسبقاً
    const { data: existingPatient, error: checkError } = await supabase
      .from('patients')
      .select('id')
      .eq('email', email)
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
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase(),
          password_hash: hashedPassword,
          login_attempts: 0,
          account_locked: false,
          email_verified: false, // Add email verification
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('خطأ في تسجيل المريض:', error);
      throw error;
    }

    // إنشاء token مؤقت للتحقق من البريد الإلكتروني
    const tempToken = generateToken({ 
      patientId: patient.id,
      email: patient.email,
      type: 'patient',
      verified: false
    }, '15m'); // صالح لـ 15 دقيقة فقط

    console.log('تم تسجيل المريض بنجاح:', patient.id);

    // إرسال رمز التحقق (محاكاة)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // حفظ رمز التحقق في قاعدة البيانات
    await supabase
      .from('patients')
      .update({
        otp_code: otpCode,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 دقائق
      })
      .eq('id', patient.id);

    res.status(201).json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      tempToken, // Token مؤقت للتحقق من OTP
      email: patient.email,
      // في الإنتاج، لا ترسل OTP في الاستجابة
      otp: otpCode // فقط للتطوير
    });

  } catch (error) {
    console.error('خطأ في تسجيل المريض:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في تسجيل المريض',
      details: 'حدث خطأ غير متوقع'
    });
  }
});

// POST /api/auth/patients/login - تسجيل دخول المريض
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('محاولة تسجيل دخول مريض:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      });
    }

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
        .eq('id', patient.id);

      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        remaining_attempts: 5 - newAttempts,
        account_locked: shouldLockAccount
      });
    }

    // إنشاء رمز التحقق للدخول
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // حفظ رمز التحقق
    await supabase
      .from('patients')
      .update({
        otp_code: otpCode,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000),
        login_attempts: 0 // إعادة تعيين المحاولات عند كلمة مرور صحيحة
      })
      .eq('id', patient.id);

    // إنشاء token مؤقت
    const tempToken = generateToken({ 
      patientId: patient.id,
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
      // في الإنتاج، لا ترسل OTP في الاستجابة
      otp: otpCode // فقط للتطوير
    });

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في تسجيل الدخول'
    });
  }
});

module.exports = router;
