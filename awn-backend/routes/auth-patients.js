// Full backend route file implementing register, login, verify-otp, resend-otp
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const { generateToken, verifyToken } = require('../utils/jwt');
const { sendOtpEmail } = require('../utils/sendEmail');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase URL or Key missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY).');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
 * create patient + send OTP
 */
router.post('/register', async (req, res) => {
  try {
    let { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'بيانات ناقصة',
        details: 'الاسم الأول، اسم العائلة، البريد، وكلمة المرور مطلوبة'
      });
    }

    email = (email || '').toLowerCase();

    // check existing
    const { data: existingPatient, error: existingError } = await supabase
      .from('patients')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingError) {
      console.error('Supabase error checking existing patient:', existingError);
      return res.status(500).json({ success: false, error: 'Database error' });
    }

    if (existingPatient) {
      return res.status(409).json({ success: false, error: 'البريد الإلكتروني مسجل مسبقاً' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: patient, error: insertError } = await supabase
      .from('patients')
      .insert([
        {
          first_name,
          last_name,
          email,
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

    // create + store OTP
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
      return res.status(500).json({ success: false, error: 'فشل في إعداد رمز التحقق' });
    }

    // send OTP by email (best-effort)
    try {
      await sendOtpEmail(patient.email, otpCode);
    } catch (e) {
      console.warn('Failed sending OTP email:', e);
    }

    // temporary token used for verify route
    const tempToken = generateToken(
      { patientId: patient.id, email: patient.email, type: 'patient', verified: false, context: 'register' },
      '15m'
    );

    return res.status(201).json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      tempToken,
      email: patient.email,
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
 * verify credentials, create OTP and tempToken
 */
router.post('/login', async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = (rawEmail || '').toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
    }

    const { data: patient, error: fetchError } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !patient) {
      return res.status(401).json({ success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    if (patient.account_locked) {
      return res.status(423).json({ success: false, error: 'الحساب مغلق مؤقتاً', details: 'يرجى التواصل مع الدعم الفني' });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password_hash);
    if (!isPasswordValid) {
      const newAttempts = (patient.login_attempts || 0) + 1;
      const shouldLockAccount = newAttempts >= 5;

      await supabase
        .from('patients')
        .update({ login_attempts: newAttempts, account_locked: shouldLockAccount })
        .eq('id', patient.id);

      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        remaining_attempts: Math.max(5 - newAttempts, 0),
        account_locked: shouldLockAccount
      });
    }

    // create OTP and save
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
      return res.status(500).json({ success: false, error: 'فشل في إعداد رمز التحقق' });
    }

    try {
      await sendOtpEmail(patient.email, otpCode);
    } catch (e) {
      console.warn('Failed sending OTP email:', e);
    }

    const tempToken = generateToken(
      { patientId: patient.id, email: patient.email, type: 'patient', verified: false, context: 'login' },
      '15m'
    );

    return res.json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      tempToken,
      email: patient.email,
    });
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    return res.status(500).json({ success: false, error: 'فشل في تسجيل الدخول' });
  }
});

/**
 * POST /api/auth/patient/verify-otp
 * Body: { otp: "123456" }
 * Header: Authorization: Bearer <tempToken>
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;
    const authHeader = req.headers.authorization || '';

    if (!otp) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال رمز التحقق' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'رمز مؤقت مفقود أو غير صالح' });
    }

    const tempToken = authHeader.replace('Bearer ', '').trim();
    const decoded = verifyToken(tempToken);

    if (!decoded || !decoded.patientId) {
      return res.status(401).json({ success: false, error: 'رمز مؤقت غير صالح أو منتهي الصلاحية' });
    }

    const patientId = decoded.patientId;

    const { data: patient, error: fetchError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (fetchError || !patient) {
      return res.status(404).json({ success: false, error: 'الحساب غير موجود' });
    }

    if (!patient.otp_code || !patient.otp_expires_at) {
      return res.status(400).json({ success: false, error: 'لا يوجد رمز تحقق نشط، يرجى إعادة الإرسال' });
    }

    const now = new Date();
    const expiresAt = new Date(patient.otp_expires_at);

    if (now > expiresAt) {
      return res.status(400).json({ success: false, error: 'انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد' });
    }

    if (patient.otp_code !== otp) {
      return res.status(400).json({ success: false, error: 'رمز التحقق غير صحيح' });
    }

    // OTP correct: update state. Only set email_verified for register flow.
    const shouldVerifyEmail = decoded.context === 'register';

    const updatePayload = {
      otp_code: null,
      otp_expires_at: null,
      updated_at: new Date()
    };

    if (shouldVerifyEmail && !patient.email_verified) {
      updatePayload.email_verified = true;
    }

    const { error: updateError } = await supabase
      .from('patients')
      .update(updatePayload)
      .eq('id', patient.id);

    if (updateError) {
      console.error('خطأ في تحديث حالة المريض بعد التحقق من OTP:', updateError);
      return res.status(500).json({ success: false, error: 'فشل في تحديث حالة الحساب بعد التحقق' });
    }

    // final access token for client (7d)
    const accessToken = generateToken(
      { patientId: patient.id, email: patient.email, type: 'patient', verified: patient.email_verified || shouldVerifyEmail },
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
        email_verified: patient.email_verified || shouldVerifyEmail
      }
    });
  } catch (error) {
    console.error('خطأ في التحقق من OTP:', error);
    return res.status(500).json({ success: false, error: 'فشل في التحقق من الرمز' });
  }
});

/**
 * POST /api/auth/patient/resend-otp
 * Resend current/new OTP. Requires tempToken in Authorization.
 * (Use to throttle/resend OTP)
 */
router.post('/resend-otp', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'رمز مؤقت مفقود أو غير صالح' });
    }

    const tempToken = authHeader.replace('Bearer ', '').trim();
    const decoded = verifyToken(tempToken);

    if (!decoded || !decoded.patientId) {
      return res.status(401).json({ success: false, error: 'رمز مؤقت غير صالح أو منتهي الصلاحية' });
    }

    const patientId = decoded.patientId;

    // generate new OTP
    const otpCode = createOtp();
    const expiresAt = otpExpiryDate();

    const { data: patient, error: fetchError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (fetchError || !patient) {
      return res.status(404).json({ success: false, error: 'الحساب غير موجود' });
    }

    const { error: updateError } = await supabase
      .from('patients')
      .update({
        otp_code: otpCode,
        otp_expires_at: expiresAt,
        updated_at: new Date()
      })
      .eq('id', patientId);

    if (updateError) {
      console.error('خطأ في حفظ OTP عند إعادة الإرسال:', updateError);
      return res.status(500).json({ success: false, error: 'فشل في إعداد رمز التحقق' });
    }

    try {
      await sendOtpEmail(patient.email, otpCode);
    } catch (e) {
      console.warn('Failed sending OTP email:', e);
    }

    return res.json({ success: true, message: 'تم إعادة إرسال رمز التحقق' });
  } catch (error) {
    console.error('خطأ في إعادة إرسال OTP:', error);
    return res.status(500).json({ success: false, error: 'فشل في إعادة إرسال رمز التحقق' });
  }
});

module.exports = router;
