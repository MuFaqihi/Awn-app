// routes/auth-verify.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { generateToken, verifyToken } = require('../utils/jwt');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /api/auth/verify-otp - التحقق من رمز OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, role } = req.body;
    const authHeader = req.headers.authorization;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'البريد الإلكتروني ورمز التحقق مطلوبان'
      });
    }

    // التحقق من الـ token المؤقت
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'token مطلوب'
      });
    }

    const tempToken = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyToken(tempToken);
      
      if (decoded.email !== email) {
        throw new Error('Token غير صالح');
      }
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        error: 'Token منتهي أو غير صالح'
      });
    }

    // البحث عن المريض والتحقق من OTP
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !patient) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود'
      });
    }

    // التحقق من صحة رمز OTP
    if (!patient.otp_code || patient.otp_code !== otp) {
      return res.status(400).json({
        success: false,
        error: 'رمز التحقق غير صحيح'
      });
    }

    // التحقق من انتهاء صلاحية OTP
    if (!patient.otp_expires_at || new Date() > new Date(patient.otp_expires_at)) {
      return res.status(400).json({
        success: false,
        error: 'رمز التحقق منتهي الصلاحية'
      });
    }

    // تحديث حالة التحقق وحذف OTP
    await supabase
      .from('patients')
      .update({
        email_verified: true,
        otp_code: null,
        otp_expires_at: null,
        last_login: new Date()
      })
      .eq('id', patient.id);

    // إنشاء token نهائي
    const finalToken = generateToken({ 
      patientId: patient.id,
      email: patient.email,
      type: 'patient',
      verified: true
    }, '7d'); // صالح لـ 7 أيام

    console.log('تم التحقق بنجاح:', patient.id);

    res.json({
      success: true,
      message: 'تم التحقق بنجاح',
      token: finalToken,
      accessToken: finalToken, // للتوافق مع الواجهة الأمامية
      user: {
        id: patient.id,
        email: patient.email,
        firstName: patient.first_name,
        lastName: patient.last_name,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('خطأ في التحقق من OTP:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في التحقق من رمز التحقق'
    });
  }
});

// POST /api/auth/resend-otp - إعادة إرسال رمز التحقق
router.post('/resend-otp', async (req, res) => {
  try {
    const { email, role } = req.body;
    const authHeader = req.headers.authorization;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'البريد الإلكتروني مطلوب'
      });
    }

    // التحقق من الـ token المؤقت
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const tempToken = authHeader.split(' ')[1];
      
      try {
        const decoded = verifyToken(tempToken);
        if (decoded.email !== email) {
          throw new Error('Token غير صالح');
        }
      } catch (tokenError) {
        return res.status(401).json({
          success: false,
          error: 'Token منتهي أو غير صالح'
        });
      }
    }

    // البحث عن المريض
    const { data: patient, error } = await supabase
      .from('patients')
      .select('id, email, first_name')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !patient) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود'
      });
    }

    // إنشاء رمز تحقق جديد
    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await supabase
      .from('patients')
      .update({
        otp_code: newOtpCode,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 دقائق
      })
      .eq('id', patient.id);

    console.log('تم إعادة إرسال OTP للمريض:', patient.id);

    res.json({
      success: true,
      message: 'تم إعادة إرسال رمز التحقق',
      // في الإنتاج، لا ترسل OTP في الاستجابة
      otp: newOtpCode // فقط للتطوير
    });

  } catch (error) {
    console.error('خطأ في إعادة إرسال OTP:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في إعادة إرسال رمز التحقق'
    });
  }
});

module.exports = router;
