const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const { generateToken, verifyToken } = require('../utils/jwt');
const { sendOtpEmail } = require('../utils/sendEmail');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// helper: generate 6-digit OTP
function createOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// helper: 10 minutes expiry
function otpExpiryDate() {
  return new Date(Date.now() + 10 * 60 * 1000);
}

/**
 * POST /api/auth/patient/register
 * إنشاء حساب مريض جديد + إرسال OTP
 */
router.post('/register', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
    } = req.body;

    console.log('محاولة تسجيل مريض جديد:', email);

    if (!first_name⠞⠵⠟⠵⠞⠟⠞⠞⠟⠵⠞⠟⠞⠺!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'بيانات ناقصة',
        details: 'الاسم الأول، اسم العائلة، البريد، وكلمة المرور مطلوبة'
      });
    }

    // هل البريد مستخدم بالفعل؟
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        error: 'البريد الإلكتروني مسجل مسبقاً'
      });
    }

    // هاش كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء المريض
    const { data: patient, error: insertError } = await supabase
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
          updated_at: new Date(),
        }
      ])
      .select()
      .single();

    if (insertError || !patient) {
      console.error('خطأ في تسجيل المريض:', insertError);
      return res.status(500).json({
        success: false,
        error: 'فشل في إنشاء الحساب',
        details: insertError?.message || 'خطأ غير متوقع'
      });
    }

    // إنشاء وحفظ OTP
    const otpCode = createOtp();
    const expiresAt = otpExpiryDate();

    const { error: otpError } = await supabase
      .from('patients')
      .update({
        otp_code: otpCode,
        otp_expires_at: expiresAt
      })
      .eq('id', patient.id);

    if (otpError) {
      console.error('خطأ في حفظ OTP:', otpError);
      return res.status(500).json({
        success: false,
        error: 'فشل في إعداد رمز التحقق'
      });
    }

    // إرسال OTP بالبريد (Resend)
    const emailSent = await sendOtpEmail(patient.email, otpCode);
    if (!emailSent) {
      // تقنياً الحساب مخلوق، لكن فشل الإرسال
      console.warn('تم إنشاء الحساب لكن فشل إرسال البريد للـ OTP');
    }

    // token مؤقت لاستخدامه في /verify-otp
    const tempToken = generateToken(
      {
        patientId: patient.id,
        email: patient.email,
        type: 'patient',
        verified: false,
        context: 'register'
      },
      '15m'
    );

    console.log('تم تسجيل المريض بنجاح:', patient.id);

    return res.status(201).json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      tempToken,
      email: patient.email,
      // otp: otpCode // ⚠️ فقط للتطوير/اللوكال، احذفها في الإنتاج
    });
  } catch (error) {
    console.error('خطأ في تسجيل المريض:', error);
    return res.status(500).json({
      success: false,
      error: 'فشل في تسجيل المريض',
      details: error.message || 'حدث خطأ غير متوقع'
    });
  }
});

/**
 * POST /api/auth/patient/login
 * تسجيل دخول + إرسال OTP
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('محاولة تسجيل دخول مريض:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور'
      });
    }

    const { data: patient, error: fetchError } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !patient) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    if (patient.account_locked) {
      return res.status(423).json({
        success: false,
        error: 'الحساب مغلق مؤقتاً',
        details: 'يرجى التواصل مع الدعم الفني'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password_hash);
    if (!isPasswordValid) {
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
        remaining_attempts: Math.max(5 - newAttempts, 0),
        account_locked: shouldLockAccount
      });
    }

    // كلمة المرور صحيحة → إنشاء OTP جديد
    const otpCode = createOtp();
    const expiresAt = otpExpiryDate();

    const { error: otpError } = await supabase
      .from('patients')
      .update({
        otp_code: otpCode,
        otp_expires_at: expiresAt,
        login_attempts: 0,
        last_login: new Date()
      })
      .eq('id', patient.id);

    if (otpError) {
      console.error('خطأ في إعداد OTP:', otpError);
      return res.status(500).json({
        success: false,
        error: 'فشل في إعداد رمز التحقق'
      });
    }

    // إرسال OTP بالبريد
    const emailSent = await sendOtpEmail(patient.email, otpCode);
    if (!emailSent) {
      console.warn('فشل إرسال البريد الإلكتروني للـ OTP للمريض:', patient.id);
      // ممكن ترجع 500 أو تستمر حسب قرارك
    }

    // token مؤقت لخطوة التحقق من OTP
    const tempToken = generateToken(
      {
        patientId: patient.id,
        email: patient.email,
        type: 'patient',
        verified: false,
        context: 'login'
      },
      '15m'
    );

    console.log('تم إرسال رمز التحقق للمريض:', patient.id);

    return res.json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      tempToken,
      email: patient.email,
      // otp: otpCode // ⚠️ فقط للتطوير لو حابة تشوفيه بالـ Network
    });
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    return res.status(500).json({
      success: false,
      error: 'فشل في تسجيل الدخول'
    });
  }
});

/**
 * POST /api/auth/patient/verify-otp
 * التحقق من OTP (بعد register أو login) + إصدار access token نهائي
 *
 * Expected:
 *  Header: Authorization: Bearer <tempToken>
 *  Body: { otp: "123456" }
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;
    const authHeader = req.headers.authorization || '';

    if (!otp) {
      return res.status(400).json({
        success: false,
        error: 'يرجى إدخال رمز التحقق'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'رمز مؤقت مفقود أو غير صالح'
      });
    }

    const tempToken = authHeader.replace('Bearer ', '').trim();
    const decoded = verifyToken(tempToken);

    if (!decoded || !decoded.patientId) {
      return res.status(401).json({
        success: false,
        error: 'رمز مؤقت غير صالح أو منتهي الصلاحية'
      });
    }

    const patientId = decoded.patientId;

    const { data: patient, error: fetchError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (fetchError || !patient) {
      return res.status(404).json({
        success: false,
        error: 'الحساب غير موجود'
      });
    }

    // التحقق من OTP
    if (!patient.otp_code || !patient.otp_expires_at) {
      return res.status(400).json({
        success: false,
        error: 'لا يوجد رمز تحقق نشط، يرجى إعادة الإرسال'
      });
    }

    const now = new Date();
    const expiresAt = new Date(patient.otp_expires_at);

    if (now > expiresAt) {
      return res.status(400).json({
        success: false,
        error: 'انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد'
      });
    }

    if (patient.otp_code !== otp) {
      return res.status(400).json({
        success: false,
        error: 'رمز التحقق غير صحيح'
      });
    }

    // OTP صحيح → تحديث حالة المريض
    const { error: updateError } = await supabase
      .from('patients')
      .update({
        email_verified: true,
        otp_code: null,
        otp_expires_at: null,
        updated_at: new Date()
      })
      .eq('id', patient.id);

    if (updateError) {
      console.error('خطأ في تحديث حالة المريض بعد التحقق من OTP:', updateError);
      return res.status(500).json({
        success: false,
        error: 'فشل في تحديث حالة الحساب بعد التحقق'
      });
    }

    // إصدار access token نهائي
    const accessToken = generateToken(
      {
        patientId: patient.id,
        email: patient.email,
        type: 'patient',
        verified: true
      },
      '7d'
    );

    return res.json({
      success: true,
      message: 'تم التحقق من الرمز بنجاح',
      token: accessToken,
      patient: {
        id: patient.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        email_verified: true
      }
    });
  } catch (error) {
    console.error('خطأ في التحقق من OTP:', error);
    return res.status(500).json({
      success: false,
      error: 'فشل في التحقق من الرمز'
    });
  }
});

module.exports = router;
