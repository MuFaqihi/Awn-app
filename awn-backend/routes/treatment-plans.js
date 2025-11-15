const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// GET /api/treatment-plans/patient/:patientId - الحصول على خطط علاج المريض
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;

    let query = supabase
      .from('treatment_plans')
      .select(`
        *,
        therapists:therapist_id (
          name_ar,
          name_en,
          specialty_ar,
          specialty_en,
          avatar_url
        )
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: plans, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: {
        plans,
        total: plans.length,
        stats: {
          active: plans.filter(p => p.status === 'accepted').length,
          proposed: plans.filter(p => p.status === 'proposed').length,
          completed: plans.filter(p => p.status === 'completed').length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching treatment plans:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في جلب خطط العلاج'
    });
  }
});

// GET /api/treatment-plans/therapist/:therapistId - خطط علاج المعالج
router.get('/therapist/:therapistId', async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { status } = req.query;

    let query = supabase
      .from('treatment_plans')
      .select(`
        *,
        patients:patient_id (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('therapist_id', therapistId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: plans, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: {
        plans,
        total: plans.length
      }
    });

  } catch (error) {
    console.error('Error fetching therapist treatment plans:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في جلب خطط العلاج'
    });
  }
});

// POST /api/treatment-plans - إنشاء خطة علاج جديدة (للمعالج)
router.post('/', async (req, res) => {
  try {
    const {
      therapist_id,
      patient_id,
      title,
      title_ar,
      description,
      description_ar,
      steps,
      duration_weeks,
      sessions_per_week,
      goals
    } = req.body;

    console.log('إنشاء خطة علاج جديدة:', { therapist_id, patient_id, title });

    // التحقق من البيانات المطلوبة
    if (!therapist_id || !patient_id || !title || !steps || !Array.isArray(steps)) {
      return res.status(400).json({
        success: false,
        error: 'بيانات ناقصة',
        details: 'المعالج، المريض، العنوان، وخطوات العلاج مطلوبة'
      });
    }

    // إنشاء خطة العلاج
    const { data: plan, error } = await supabase
      .from('treatment_plans')
      .insert([
        {
          therapist_id,
          patient_id,
          title,
          title_ar,
          description,
          description_ar,
          steps,
          duration_weeks: duration_weeks || 4,
          sessions_per_week: sessions_per_week || 2,
          goals: goals || [],
          status: 'proposed',
          completed_steps: 0
        }
      ])
      .select(`
        *,
        therapists:therapist_id (
          name_ar,
          name_en,
          specialty_ar,
          specialty_en
        ),
        patients:patient_id (
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('خطأ في إنشاء خطة العلاج:', error);
      throw error;
    }

    console.log('تم إنشاء خطة العلاج بنجاح:', plan.id);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء خطة العلاج بنجاح',
      data: {
        plan,
        next_steps: 'بانتظار موافقة المريض على الخطة'
      }
    });

  } catch (error) {
    console.error('خطأ في إنشاء خطة العلاج:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في إنشاء خطة العلاج'
    });
  }
});

// PUT /api/treatment-plans/:id/accept - قبول خطة العلاج (من المريض)
router.put('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id } = req.body;

    console.log('محاولة قبول خطة العلاج:', id);

    const { data: plan, error } = await supabase
      .from('treatment_plans')
      .update({
        status: 'accepted',
        accepted_at: new Date(),
        started_at: new Date()
      })
      .eq('id', id)
      .eq('patient_id', patient_id)
      .select(`
        *,
        therapists:therapist_id (
          name_ar,
          name_en
        )
      `)
      .single();

    if (error) {
      console.error('خطأ في قبول خطة العلاج:', error);
      throw error;
    }

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'خطة العلاج غير موجودة أو ليس لديك صلاحية لقبولها'
      });
    }

    console.log('تم قبول خطة العلاج بنجاح:', id);

    res.json({
      success: true,
      message: 'تم قبول خطة العلاج بنجاح',
      data: {
        plan,
        next_steps: 'سيبدأ المعالج في تنفيذ الخطة خلال 24 ساعة'
      }
    });

  } catch (error) {
    console.error('خطأ في قبول خطة العلاج:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في قبول خطة العلاج'
    });
  }
});

// PUT /api/treatment-plans/:id/decline - رفض خطة العلاج (من المريض)
router.put('/:id/decline', async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, decline_reason } = req.body;

    console.log('محاولة رفض خطة العلاج:', id);

    if (!decline_reason) {
      return res.status(400).json({
        success: false,
        error: 'سبب الرفض مطلوب'
      });
    }

    const { data: plan, error } = await supabase
      .from('treatment_plans')
      .update({
        status: 'declined',
        declined_at: new Date(),
        decline_reason
      })
      .eq('id', id)
      .eq('patient_id', patient_id)
      .select()
      .single();

    if (error) throw error;

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'خطة العلاج غير موجودة أو ليس لديك صلاحية لرفضها'
      });
    }

    console.log('تم رفض خطة العلاج بنجاح:', id);

    res.json({
      success: true,
      message: 'تم رفض خطة العلاج',
      data: {
        plan,
        next_steps: 'يمكنك التواصل مع المعالج لمناقشة خطة بديلة'
      }
    });

  } catch (error) {
    console.error('خطأ في رفض خطة العلاج:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في رفض خطة العلاج'
    });
  }
});

// PUT /api/treatment-plans/:id/progress - تحديث تقدم الخطة
router.put('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed_steps, current_step, notes, therapist_id } = req.body;

    console.log('تحديث تقدم خطة العلاج:', id);

    const { data: plan, error } = await supabase
      .from('treatment_plans')
      .update({
        completed_steps,
        current_step,
        progress_notes: notes,
        updated_at: new Date()
      })
      .eq('id', id)
      .eq('therapist_id', therapist_id)
      .select()
      .single();

    if (error) throw error;

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'خطة العلاج غير موجودة أو ليس لديك صلاحية لتحديثها'
      });
    }

    // إذا اكتملت جميع الخطوات
    if (completed_steps >= plan.steps.length) {
      await supabase
        .from('treatment_plans')
        .update({
          status: 'completed',
          completed_at: new Date()
        })
        .eq('id', id);
    }

    console.log('تم تحديث تقدم خطة العلاج:', id);

    res.json({
      success: true,
      message: 'تم تحديث التقدم بنجاح',
      data: {
        plan: {
          ...plan,
          completed_steps,
          current_step,
          progress_percentage: Math.round((completed_steps / plan.steps.length) * 100)
        }
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث تقدم الخطة:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في تحديث التقدم'
    });
  }
});

// PUT /api/treatment-plans/:id/complete - إكمال خطة العلاج
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { therapist_id, final_notes } = req.body;

    console.log('إكمال خطة العلاج:', id);

    const { data: plan, error } = await supabase
      .from('treatment_plans')
      .update({
        status: 'completed',
        completed_at: new Date(),
        final_notes,
        completed_steps: supabase.raw('array_length(steps, 1)')
      })
      .eq('id', id)
      .eq('therapist_id', therapist_id)
      .select(`
        *,
        patients:patient_id (
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) throw error;

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'خطة العلاج غير موجودة أو ليس لديك صلاحية لإكمالها'
      });
    }

    console.log('تم إكمال خطة العلاج بنجاح:', id);

    res.json({
      success: true,
      message: 'تم إكمال خطة العلاج بنجاح',
      data: {
        plan,
        congratulations: 'مبروك! لقد أكملت خطة العلاج بنجاح'
      }
    });

  } catch (error) {
    console.error('خطأ في إكمال خطة العلاج:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في إكمال خطة العلاج'
    });
  }
});

// GET /api/treatment-plans/:id - الحصول على خطة علاج محددة
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: plan, error } = await supabase
      .from('treatment_plans')
      .select(`
        *,
        therapists:therapist_id (
          name_ar,
          name_en,
          specialty_ar,
          specialty_en,
          avatar_url,
          bio_ar,
          bio_en
        ),
        patients:patient_id (
          first_name,
          last_name,
          email,
          phone,
          date_of_birth,
          gender
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'خطة العلاج غير موجودة'
      });
    }

    res.json({
      success: true,
      data: {
        plan: {
          ...plan,
          progress_percentage: Math.round((plan.completed_steps / plan.steps.length) * 100),
          remaining_steps: plan.steps.length - plan.completed_steps
        }
      }
    });

  } catch (error) {
    console.error('Error fetching treatment plan:', error);
    res.status(500).json({
      success: false,
      error: 'فشل في جلب خطة العلاج'
    });
  }
});

module.exports = router;