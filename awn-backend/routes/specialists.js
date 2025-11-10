const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// GET /api/specialists - قائمة المختصين (للعرض العام)
router.get('/', async (req, res) => {
  try {
    const { verified = true, specialization, page = 1, limit = 12 } = req.query;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('therapists')
      .select('*', { count: 'exact' })
      .eq('is_verified', verified)
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (specialization) {
      query = query.ilike('specialization', `%${specialization}%`);
    }

    const { data: specialists, error, count } = await query.range(from, to);

    if (error) throw error;

    res.json({
      specialists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        total_pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching specialists:', error);
    res.status(500).json({ error: 'فشل في جلب بيانات المختصين' });
  }
});

// GET /api/specialists/featured - المختصين المميزين
router.get('/featured', async (req, res) => {
  try {
    const { data: featuredSpecialists, error } = await supabase
      .from('therapists')
      .select('*')
      .eq('is_verified', true)
      .eq('is_active', true)
      .gte('rating', 4.5)
      .order('rating', { ascending: false })
      .limit(6);

    if (error) throw error;

    res.json({ specialists: featuredSpecialists });

  } catch (error) {
    console.error('Error fetching featured specialists:', error);
    res.status(500).json({ error: 'فشل في جلب المختصين المميزين' });
  }
});

module.exports = router;