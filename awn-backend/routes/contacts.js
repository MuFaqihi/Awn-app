const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// POST /api/contacts - يتوافق مع بيانات الفرونت
router.post('/', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      role,
      city,
      topic,
      message,
      locale
    } = req.body;

    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        first_name,
        last_name,
        email,
        phone,
        role,
        city,
        topic,
        message,
        locale,
        created_at: new Date()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح',
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'فشل في إرسال الرسالة'
    });
  }
});

module.exports = router;