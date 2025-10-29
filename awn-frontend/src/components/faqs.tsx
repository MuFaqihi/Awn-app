'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Locale = 'ar' | 'en';

const AR = {
  title: 'الأسئلة الشائعة',
  subtitle: 'إجابات سريعة حول منصة عون للعلاج الطبيعي',
  searchPlaceholder: 'ابحث في الأسئلة...',
  noResults: 'لا توجد نتائج',
  contactNote: 'لم تجد إجابة سؤالك؟ تواصل معنا عبر support@awn.sa',
  items: [
    {
      q: 'كيف أحجز موعد مع أخصائي علاج طبيعي؟',
      a: 'سجل دخولك، ابحث عن الأخصائي المناسب حسب المدينة والتخصص، اختر الموعد المتاح، ثم أكد الحجز.',
    },
    {
      q: 'ما هي أنواع العلاج الطبيعي المتوفرة؟',
      a: 'نوفر تخصصات متعددة: العلاج الطبيعي العام، إصابات الرياضة، العلاج العصبي، صحة المرأة، وعلاج الأطفال.',
    },
    {
      q: 'هل الجلسات في العيادة أم زيارات منزلية؟',
      a: 'نوفر كلا الخيارين حسب تفضيلك وتوفر الأخصائي. الزيارات المنزلية متاحة في الرياض وجدة والدمام.',
    },
    {
      q: 'كيف يتم الدفع وما هي التكاليف؟',
      a: 'كل أخصائي يحدد أسعاره. نقبل الدفع النقدي، البطاقات البنكية، والمحافظ الإلكترونية. بعض الأخصائيين يقبلون التأمين.',
    },
    {
      q: 'هل معلوماتي الطبية آمنة ومحمية؟',
      a: 'نلتزم بأعلى معايير الأمان وحماية البيانات. معلوماتك الطبية مشفرة ولا يمكن للأخصائي الوصول إليها إلا بموافقتك.',
    },
    {
      q: 'كيف أتأكد من خبرة وكفاءة الأخصائي؟',
      a: 'جميع أخصائيينا مرخصون من الهيئة السعودية للتخصصات الصحية. يمكنك مراجعة خبراتهم وتقييمات المرضى السابقين.',
    },
    {
      q: 'ماذا لو احتجت لإلغاء أو تأجيل الموعد؟',
      a: 'يمكنك إلغاء أو تأجيل الموعد مجاناً حتى 24 ساعة قبل الجلسة عبر التطبيق أو الموقع.',
    },
    {
      q: 'هل تقدمون خدمات طوارئ العلاج الطبيعي؟',
      a: 'عون منصة للمواعيد المجدولة وليست لخدمات الطوارئ. يمكنك حجز مواعيد عاجلة (نفس اليوم) مع بعض الأخصائيين.',
    },
  ],
};

const EN = {
  title: 'Frequently Asked Questions',
  subtitle: 'Quick answers about Awn physiotherapy platform',
  searchPlaceholder: 'Search questions...',
  noResults: 'No results found',
  contactNote: 'Didn\'t find your answer? Contact us at support@awn.sa',
  items: [
    {
      q: 'How do I book an appointment with a physiotherapist?',
      a: 'Sign in, search for the right therapist by city and specialty, choose an available time slot, then confirm your booking.',
    },
    {
      q: 'What types of physiotherapy are available?',
      a: 'We offer multiple specialties: general physiotherapy, sports injuries, neurological therapy, women\'s health, and pediatric therapy.',
    },
    {
      q: 'Are sessions in-clinic or home visits?',
      a: 'We offer both options based on your preference and therapist availability. Home visits are available in Riyadh, Jeddah, and Dammam.',
    },
    {
      q: 'How does payment work and what are the costs?',
      a: 'Each therapist sets their own rates. We accept cash, bank cards, and digital wallets. Some therapists accept insurance.',
    },
    {
      q: 'Is my medical information safe and protected?',
      a: 'We maintain the highest security and data protection standards. Your medical information is encrypted and accessible only with your consent.',
    },
    {
      q: 'How can I verify a therapist\'s experience and qualifications?',
      a: 'All our therapists are licensed by the Saudi Commission for Health Specialties. You can review their experience and patient ratings.',
    },
    {
      q: 'What if I need to cancel or reschedule my appointment?',
      a: 'You can cancel or reschedule for free up to 24 hours before the session through the app or website.',
    },
    {
      q: 'Do you provide emergency physiotherapy services?',
      a: 'Awn is a platform for scheduled appointments. You can book urgent (same-day) appointments with some therapists.',
    },
  ],
};

export default function FAQs({ locale = 'ar' }: { locale?: Locale }) {
  const t = locale === 'ar' ? AR : EN;
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const filteredItems = t.items.filter(item => 
    item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${locale === 'ar' ? 'pr-10 text-right' : 'pl-10'}`}
          />
        </div>
      </div>

      {/* FAQ Items */}
      <div className="max-w-3xl mx-auto space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t.noResults}</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <Card key={index} className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 pr-4">{item.q}</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      openItems.has(index) ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </button>
              
              {openItems.has(index) && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Contact Note */}
      <div className="text-center py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <p className="text-gray-600">{t.contactNote}</p>
          </div>
          <Button variant="outline" className="hover:bg-blue-50">
            {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </Button>
        </div>
      </div>
    </div>
  );
}