const express = require('express');
const router = express.Router();
const { authenticatePatient } = require('../middleware/auth');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// جميع الـ endpoints محمية بالمصادقة
router.use(authenticatePatient);

// GET /api/patients/profile - جلب بيانات المريض
router.get('/profile', async (req, res) => {
  try {
    res.json({
      success: true,
      patient: req.patient
    });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'فشل في جلب بيانات المريض' 
    });
  }
});

// GET /api/patients/bookings - حجوزات المريض
router.get('/bookings', async (req, res) => {
  try {
    const { status } = req.query;
    const national_id = req.patient.national_id;

    let query = supabase
      .from('bookings')
      .select(`
        *,
        therapists:therapist_id (
          name_ar,
          name_en,
          role_ar,
          role_en,
          avatar_url
        )
      `)
      .eq('patient_national_id', national_id)
      .order('booking_date', { ascending: false })
      .order('booking_time', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      bookings,
      total: bookings.length
    });

  } catch (error) {
    console.error('Error fetching patient bookings:', error);
    res.status(500).json({ 
      success: false,
      error: 'فشل في جلب حجوزات المريض' 
    });
  }
});

// PUT /api/patients/profile - تحديث بيانات المريض
router.put('/profile', async (req, res) => {
  try {
    const national_id = req.patient.national_id;
    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      gender,
      city,
      emergency_contact
    } = req.body;

    console.log('محاولة تحديث بيانات المريض:', national_id);

    const updateData = {
      ...(first_name && { first_name }),
      ...(last_name && { last_name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(date_of_birth && { date_of_birth }),
      ...(gender && { gender }),
      ...(city && { city }),
      ...(emergency_contact && { emergency_contact }),
      updated_at: new Date()
    };

    // إذا تم تغيير البريد، التحقق من أنه غير مستخدم
    if (email && email !== req.patient.email) {
      const { data: emailExists, error: emailError } = await supabase
        .from('patients')
        .select('national_id')
        .eq('email', email)
        .neq('national_id', national_id)
        .single();

      if (emailExists) {
        return res.status(409).json({ 
          success: false,
          error: 'البريد الإلكتروني مستخدم من قبل مريض آخر' 
        });
      }
    }

    const { data: patient, error } = await supabase
      .from('patients')
      .update(updateData)
      .eq('national_id', national_id)
      .select()
      .single();

    if (error) throw error;

    console.log('تم تحديث بيانات المريض بنجاح:', national_id);

    res.json({
      success: true,
      message: 'تم تحديث بيانات المريض بنجاح',
      patient
    });

  } catch (error) {
    console.error('خطأ في تحديث المريض:', error);
    res.status(500).json({ 
      success: false,
      error: 'فشل في تحديث بيانات المريض' 
    });
  }
});

module.exports = router;