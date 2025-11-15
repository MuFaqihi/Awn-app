const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');
const { authenticateToken } = require('../utils/jwt');

// GET /api/appointments - جلب مواعيد المستخدم من الجدول الصحيح
router.get('/', authenticateToken, async (req, res) => {
  try {
    //   التصحيح: استخدام req.user.id بدلاً من req.user.userId
    const patientId = req.user.id; // "PAT_1763027253059"
    const userEmail = req.user.email; // "user@example.com"
    
    console.log('  جلب مواعيد للمستخدم:', { 
      patientId, 
      userEmail, 
      fullUser: req.user 
    });

    let appointments = [];

    //   المحاولة 1: البحث في appointments باستخدام patient_id
    console.log('  البحث في جدول appointments...');
    let result = await supabase
      .from('appointments')
      .select(`
        id,
        patient_id,
        therapist_id,
        date,
        time,
        kind,
        status,
        patient_notes as note,
        meet_link,
        created_at
      `)
      .eq('patient_id', patientId) //   استخدام patient_id الحقيقي
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (!result.error) {
      console.log(`  appointments: ${result.data?.length || 0} موعد`);
      appointments = result.data || [];
    } else {
      console.log(' خطأ في appointments:', result.error);
    }

    //   المحاولة 2: إذا لم توجد مواعيد، ابحث في bookings
    if (appointments.length === 0) {
      console.log('  البحث في جدول bookings...');
      result = await supabase
        .from('bookings')
        .select(`
          id,
          therapist_id,
          user_name,
          user_email,
          booking_date as date,
          booking_time as time,
          session_type as kind,
          status,
          notes as note,
          created_at
        `)
        .eq('user_email', userEmail) // البحث بالبريد الإلكتروني
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (!result.error) {
        console.log(`  bookings: ${result.data?.length || 0} حجز`);
        appointments = result.data || [];
      } else {
        console.log(' خطأ في bookings:', result.error);
      }
    }

    console.log(`  الإجمالي: ${appointments.length} موعد/حجز`);
    
    res.json({
      success: true,
      data: appointments,
      count: appointments.length,
      debug: {
        patientIdUsed: patientId,
        userEmailUsed: userEmail,
        source: appointments.length > 0 ? 
          (appointments[0].patient_id ? 'appointments' : 'bookings') : 'none'
      }
    });

  } catch (error) {
    console.error(' خطأ غير متوقع:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// POST /api/appointments - إنشاء موعد جديد
router.post('/', authenticateToken, async (req, res) => {
  try {
    //   التصحيح: استخدام req.user.id بدلاً من req.user.userId
    const patientId = req.user.id;
    const { therapistId, date, time, kind, note } = req.body;

    console.log('  إنشاء موعد جديد:', { 
      patientId, 
      therapistId, 
      date, 
      time, 
      kind 
    });

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: patientId, //   التصحيح: patient_id بدلاً من user_id
          therapist_id: therapistId,
          date,
          time,
          kind,
          note,
          status: 'upcoming'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(' خطأ في إنشاء الموعد:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }

    console.log('  تم إنشاء الموعد بنجاح:', appointment.id);
    res.status(201).json({
      success: true,
      data: appointment,
      message: 'تم إنشاء الموعد بنجاح'
    });

  } catch (error) {
    console.error(' خطأ غير متوقع:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// إعادة جدولة
router.patch('/:id/reschedule', authenticateToken, async (req, res) => {
  try {
    //   التصحيح: استخدام req.user.id بدلاً من req.user.userId
    const patientId = req.user.id;
    const appointmentId = req.params.id;
    const { date, time, kind, note } = req.body;

    console.log('  إعادة جدولة الموعد:', { patientId, appointmentId });

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        date,
        time,
        kind,
        note,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .eq('patient_id', patientId) //   التصحيح: patient_id بدلاً من user_id
      .select()
      .single();

    if (error) {
      console.error(' خطأ في إعادة الجدولة:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        error: 'الموعد غير موجود' 
      });
    }

    res.json({
      success: true,
      data: appointment,
      message: 'تمت إعادة الجدولة بنجاح'
    });

  } catch (error) {
    console.error(' خطأ غير متوقع:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// إلغاء موعد
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    //   التصحيح: استخدام req.user.id بدلاً من req.user.userId
    const patientId = req.user.id;
    const appointmentId = req.params.id;

    console.log('  إلغاء الموعد:', { patientId, appointmentId });

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .eq('patient_id', patientId) //   التصحيح: patient_id بدلاً من user_id
      .select()
      .single();

    if (error) {
      console.error(' خطأ في الإلغاء:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        error: 'الموعد غير موجود' 
      });
    }

    res.json({
      success: true,
      data: appointment,
      message: 'تم إلغاء الموعد بنجاح'
    });

  } catch (error) {
    console.error(' خطأ غير متوقع:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// إرسال تقييم
router.post('/:id/feedback', authenticateToken, async (req, res) => {
  try {
    //   التصحيح: استخدام req.user.id بدلاً من req.user.userId
    const patientId = req.user.id;
    const appointmentId = req.params.id;
    const { ratings, feedbackText, overall } = req.body;

    console.log('  إرسال تقييم:', { patientId, appointmentId });

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        rating: overall,
        feedback_text: feedbackText,
        feedback_ratings: ratings,
        feedback_submitted_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .eq('patient_id', patientId) //   التصحيح: patient_id بدلاً من user_id
      .select()
      .single();

    if (error) {
      console.error(' خطأ في إرسال التقييم:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        error: 'الموعد غير موجود' 
      });
    }

    res.json({
      success: true,
      data: appointment,
      message: 'تم إرسال التقييم بنجاح'
    });

  } catch (error) {
    console.error(' خطأ غير متوقع:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// GET /api/appointments/debug/me - للتحقق من بيانات الـ token
router.get('/debug/me', authenticateToken, async (req, res) => {
  try {
    console.log('  بيانات الـ JWT token:', req.user);
    res.json({
      success: true,
      user: req.user,
      message: 'بيانات المستخدم من الـ token'
    });
  } catch (error) {
    console.error(' خطأ في جلب بيانات المستخدم:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في جلب البيانات'
    });
  }
});

// GET /api/appointments/debug/all - جلب جميع المواعيد للاختبار
router.get('/debug/all', async (req, res) => {
  try {
    console.log('  جلب جميع المواعيد للتحقق...');

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: false })
      .order('time', { ascending: false });

    if (error) {
      console.error(' خطأ في جلب المواعيد:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`  تم العثور على ${appointments?.length || 0} موعد للاختبار`);
    
    res.json({
      success: true,
      data: appointments || [],
      count: appointments?.length || 0,
      message: `بيانات اختبار - ${appointments?.length || 0} موعد`
    });

  } catch (error) {
    console.error('  خطأ في الخادم:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في جلب البيانات'
    });
  }
});

// POST /api/appointments/test - إنشاء موعد اختبار (بدون مصادقة)
router.post('/test', async (req, res) => {
  try {
    const { therapistId, date, time, kind, note, userId } = req.body;

    console.log('  إنشاء موعد اختبار:', { userId, therapistId, date, time });

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: userId || 'PAT_1763027253059',
          therapist_id: therapistId || (await supabase.from('therapists').select('id').limit(1).single()).data?.id,
          date: date || '2024-01-25',
          time: time || '14:00',
          kind: kind || 'online',
          note: note || 'جلسة اختبار',
          status: 'upcoming'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(' خطأ في إنشاء الموعد:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }

    console.log('  تم إنشاء موعد الاختبار بنجاح:', appointment.id);
    res.status(201).json({
      success: true,
      data: appointment,
      message: 'تم إنشاء موعد الاختبار بنجاح'
    });

  } catch (error) {
    console.error(' خطأ غير متوقع:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

module.exports = router;