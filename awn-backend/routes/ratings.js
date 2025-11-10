// routes/ratings.js - الإصدار المصحح والمعدل
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

//POST /api/ratings - إضافة تقييم
router.post('/', async (req, res) => {
  try {
    const { bookingId, therapistId, rating, comment } = req.body;  
    // التحقق من البيانات المطلوبة
    if (!bookingId || !therapistId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'بيانات ناقصة',
        details: 'معرف الحجز، معرف المعالج، والتقييم مطلوبة'
      });
    }

    // التحقق من أن التقييم بين 1 و 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'تقييم غير صالح',
        details: 'التقييم يجب أن يكون بين 1 و 5'
      });
    }

    const { data, error } = await supabase
      .from('ratings')
      .insert({
        booking_id: bookingId,  
        therapist_id: therapistId,
        rating,
        comment
      })
      .select();

    if (error) throw error;

    res.json({ 
      success: true, 
      data: { ratingId: data[0].id },
      message: 'تم إضافة التقييم بنجاح'
    });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ 
      success: false, 
      error: 'فشل في إضافة التقييم' 
    });
  }
});

// GET /api/ratings/therapist/:therapistId - تقييمات المعالج
router.get('/therapist/:therapistId', async (req, res) => {
  try {
    const { therapistId } = req.params;

    const { data: ratings, error } = await supabase
      .from('ratings')
      .select(`
        *,
        bookings:booking_id (
          patient_name,
          booking_date
        )
      `)
      .eq('therapist_id', therapistId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // حساب متوسط التقييم
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
      : 0;

    res.json({
      success: true,
      data: {
        ratings,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length
      }
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'فشل في جلب التقييمات' 
    });
  }
});

module.exports = router;