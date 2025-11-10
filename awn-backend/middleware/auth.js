const { verifyToken } = require('../utils/jwt');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const authenticatePatient = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'مطلوب token للمصادقة' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // التحقق من وجود المريض في database
    const { data: patient, error } = await supabase
      .from('patients')
      .select('national_id, first_name, last_name, email, phone, account_locked')
      .eq('national_id', decoded.patientId)
      .single();

    if (error || !patient) {
      return res.status(401).json({ 
        success: false,
        error: 'المستخدم غير موجود' 
      });
    }

    if (patient.account_locked) {
      return res.status(423).json({ 
        success: false,
        error: 'الحساب مغلق مؤقتاً' 
      });
    }

    req.patient = patient;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      error: 'Token غير صالح أو منتهي' 
    });
  }
};

module.exports = { authenticatePatient };