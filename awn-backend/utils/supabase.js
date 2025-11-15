// awn-backend/utils/supabase.js
const { createClient } = require('@supabase/supabase-js');

console.log('🔗 تهيئة Supabase client...');
console.log('URL:', process.env.SUPABASE_URL);
console.log('Key length:', process.env.SUPABASE_ANON_KEY?.length);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// اختبار الاتصال
supabase.from('therapists').select('*', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error(' فشل الاتصال بـ Supabase:', error.message);
    } else {
      console.log('  الاتصال بـ Supabase ناجح!');
    }
  })
  .catch(err => {
    console.error(' خطأ في اختبار Supabase:', err);
  });

module.exports = supabase;