const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /api/auth/specialists/register - تسجيل أخصائي جديد
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      phone,
      license_number,
      license_expiry,
      specialization,
      education,
      years_experience,
      hourly_rate,
      available_days,
      available_times,
      documents_urls
    } = req.body;

    console.log('محاولة تسجيل مختص جديد:', email);

    // التحقق من البيانات المطلوبة
    if (!email || !password || !phone || !license_number || !license_expiry || !specialization || !education || !years_experience || !hourly_rate) {
      return res.status(400).json({
        success: false,
        error: 'بيانات ناقصة',
        details: 'جميع الحقول المطلوبة marked with *'
      });
    }

    // التحقق من عدم وجود ترخيص مسجل مسبقاً
    const { data: existingTherapist, error: checkError } = await supabase
      .from('therapists')
      .select('id')
      .eq('license_number', license_number)
      .single();

    if (existingTherapist) {
      return res.status(409).json({
        success: false,
        error: 'رقم الترخيص مسجل مسبقاً'
      });
    }

    // التحقق من عدم وجود بريد مسجل
    const { data: existingEmail, error: emailError } = await supabase
      .from('therapists')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: 'البريد الإلكتروني مسجل مسبقاً'
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء slug فريد
    const slug = email.split('@')[0] + '-' + Date.now();

    // تسجيل المختص الجديد في therapists
    const { data: therapist, error } = await supabase
      .from('therapists')
      .insert([
        {
          // الحقول الإلزامية الأساسية
          slug: slug,
          name_ar: 'أخصائي ' + specialization,
          name_en: specialization + ' Specialist',
          role_ar: 'أخصائي ' + specialization,
          role_en: specialization + ' Specialist',
          avatar_url: '/default-avatar.png',
          bio_ar: 'أخصائي ' + specialization + ' مؤهل',
          bio_en: 'Qualified ' + specialization + ' specialist',
          base_price: hourly_rate,
          experience_ar: years_experience + ' سنوات خبرة',
          experience_en: years_experience + ' years experience',
          session_type_ar: 'جلسة أونلاين',
          session_type_en: 'Online Session',
          
          // بيانات التسجيل
          email: email,
          password: hashedPassword,
          phone: phone,
          license_number: license_number,
          license_expiry: license_expiry,
          specialization: specialization,
          education: education,
          years_experience: years_experience,
          hourly_rate: hourly_rate,
          available_days: available_days || ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
          available_times: available_times || ['09:00', '10:00', '11:00', '12:00', '14:00', '16:00'],
          is_verified: false,
          verification_status: 'pending',
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('خطأ مفصل في تسجيل المختص:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('تم تسجيل المختص بنجاح (بانتظار التحقق):', therapist.id);

    res.status(201).json({
      success: true,
      message: 'تم تسجيل طلب انضمامك بنجاح وجاري المراجعة',
      therapist: {
        id: therapist.id,
        email: therapist.email,
        specialization: therapist.specialization
      },
      next_steps: 'سيتم التواصل معك خلال 48 ساعة بعد مراجعة الطلب'
    });

  } catch (error) {
    console.error('خطأ في تسجيل المختص:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في تسجيل المختص'
    });
  }
});

// POST /api/auth/specialists/login - تسجيل دخول الأخصائي
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('محاولة تسجيل دخول مختص:', email);

    const { data: therapist, error } = await supabase
      .from('therapists')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !therapist) {
      return res.status(401).json({
        success: false,
        error: 'بيانات الدخول غير صحيحة'
      });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, therapist.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'بيانات الدخول غير صحيحة'
      });
    }

    // التحقق من حالة الحساب
    if (!therapist.is_verified) {
      return res.status(403).json({
        success: false,
        error: 'الحساب قيد المراجعة',
        details: 'حسابك لا يزال قيد المراجعة من قبل الإدارة'
      });
    }

    // إنشاء توكن للمختص
    const token = generateToken({ 
      id: therapist.id, 
      role: 'therapist',
      email: therapist.email
    });

    console.log('تم تسجيل الدخول بنجاح:', therapist.id);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      therapist: {
        id: therapist.id,
        email: therapist.email,
        specialization: therapist.specialization,
        is_verified: therapist.is_verified
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

module.exports = router;