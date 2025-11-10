// routes/favorites.js - الإصدار المصحح
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ✅ POST /api/favorites - إضافة/إزالة من المفضلة
router.post('/', async (req, res) => {
  try {
    const { therapistId, action } = req.body;
    
    if (action === 'add') {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          therapist_id: therapistId
        })
        .select();

      if (error) throw error;
      
      res.json({ 
        success: true, 
        message: 'تمت الإضافة إلى المفضلة' 
      });
    } else if (action === 'remove') {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('therapist_id', therapistId);

      if (error) throw error;
      
      res.json({ 
        success: true, 
        message: 'تمت الإزالة من المفضلة' 
      });
    }
  } catch (error) {
    console.error('Error managing favorites:', error);
    res.status(500).json({ 
      success: false, 
      error: 'فشل في إدارة المفضلة' 
    });
  }
});

module.exports = router;