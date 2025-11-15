const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /api/contacts - إرسال رسالة تواصل
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
      locale = 'ar'
    } = req.body;

    console.log('استقبال رسالة تواصل جديدة');

    // التحقق من البيانات المطلوبة
    if (!first_name || !last_name || !email || !message) {
      return res.status(400).json({
        error: 'بيانات ناقصة',
        details: 'الاسم، البريد الإلكتروني، والرسالة مطلوبة'
      });
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'بريد إلكتروني غير صحيح'
      });
    }

    // حفظ الرسالة في قاعدة البيانات
    const { data: contact, error } = await supabase
      .from('contacts')
      .insert([
        {
          first_name,
          last_name,
          email,
          phone,
          role,
          city,
          topic,
          message,
          locale,
          status: 'new'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('خطأ في حفظ الرسالة:', error);
      throw error;
    }

    console.log('تم حفظ الرسالة بنجاح:', contact.id);

    // هنا يمكنك إضافة إرسال إشعار بالبريد الإلكتروني

    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح، سنتواصل معك قريباً',
      contact_id: contact.id
    });

  } catch (error) {
    console.error('خطأ في الخادم:', error);
    res.status(500).json({
      error: 'فشل في إرسال الرسالة',
      details: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً'
    });
  }
});

// GET /api/contacts - جلب رسائل التواصل (للوحة التحكم)
router.get('/', async (req, res) => {
  try {
    const { status = 'new', page = 1, limit = 20 } = req.query;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: contacts, error, count } = await supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'فشل في جلب الرسائل' });
  }
});

module.exports = router;