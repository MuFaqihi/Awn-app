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
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = req.body;

    console.log('محاولة تسجيل مريض جديد:', !email);

    // التحقق من البيانات المطلوبة
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'بيانات ناقصة',
        details: 'الرقم الوطني، الاسم، البريد، الهاتف، وكلمة المرور مطلوبة'
      });
    }

    // التحقق من عدم وجود مريض مسجل مسبقاً
   // const { data: existingPatient, error: checkError } = await supabase
    //  .from('patients')
    //  .select('national_id')
    //  .eq('national_id', national_id)
    //  .single();

   // if (existingPatient) {
   //   return res.status(409).json({
      //  success: false,
       // error: 'الرقم الوطني مسجل مسبقاً'
     // });
   // }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // تسجيل المريض الجديد
    const { data: patient, error } = await supabase
      .from('patients')
      .insert([
        {
         
          firstName,
          lastName,
          email,
          password_hash: hashedPassword,
          login_attempts: 0,
          account_locked: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('خطأ في تسجيل المريض:', error);
      throw error;
    }

    // إنشاء token
    const token = generateToken({ 
      patientId: patient.national_id,
      type: 'patient'
    });

    console.log('تم تسجيل المريض بنجاح:', patient.national_id);

    res.status(201).json({
      success: true,
      message: 'تم تسجيل حسابك بنجاح',
      token,
      patient: {
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email
      }
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

    // البحث عن المريض بالبريد الإلكتروني
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
        .eq('national_id', patient.email);

      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        remaining_attempts: 5 - newAttempts,
        account_locked: shouldLockAccount
      });
    }

    // تسجيل الدخول الناجح - إعادة تعيين المحاولات
    await supabase
      .from('patients')
      .update({
        login_attempts: 0,
        last_login: new Date()
      })
      .eq('national_id', patient.email);

    // إنشاء token
    const token = generateToken({ 
      patientId: patient.email,
      type: 'patient'
    });

    console.log('تم تسجيل الدخول بنجاح:', patient.email);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      patient: {
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
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

// POST /api/auth/patients/forgot-password - نسيان كلمة المرور
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body; 
    const { data: patient, error } = await supabase
      .from('patients')
      .select('national_id, first_name, email')
      .eq('email', email)
      .single();

    if (error || !patient) {
      return res.status(404).json({
        success: false,
        error: 'لا يوجد حساب مرتبط بالبريد الإلكتروني المدخل'
      });
    }

    // إنشاء token لإعادة تعيين كلمة المرور (مبسط)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await supabase
      .from('patients')
      .update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry
      })
      .eq('email', email);

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
