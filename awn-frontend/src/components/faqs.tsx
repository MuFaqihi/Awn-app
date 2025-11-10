// src/components/faqs.tsx
'use client';

type Locale = 'ar' | 'en';

const AR = {
  title1: 'الأسئلة',
  title2: 'الشائعة',
  blurb: 'إجابات سريعة حول الحجز، التحقق، الخصوصية، والدفع.',
  items: [
    {
      q: 'كيف أحجز جلسة علاج طبيعي؟',
      a: 'ابحث عن الأخصائي حسب المدينة/التخصص/الجنس، اختر موعدًا متاحًا، ثم أكد الحجز. ستصلك رسالة تأكيد وتذكير قبل الموعد.',
      bullets: [
        'يمكنك تعديل/إلغاء الحجز حتى 12 ساعة قبل الموعد.',
        'سياسة الإلغاء المتأخر قد تفرض رسومًا رمزية.'
      ],
    },
    {
      q: 'هل تحتاجون إلى التحقق عبر أبشر/الهوية الوطنية؟',
      a: 'نعم، نطلب التحقق مرة واحدة لزيادة الموثوقية وحماية جميع الأطراف. يتم عبر بوابة موثوقة ولا نحتفظ ببيانات حساسة.',
    },
    {
      q: 'هل الجلسات عن بُعد أم حضوري؟',
      a: 'حالياً نوفّر جلسات حضورية في العيادات أو الزيارات المنزلية حسب تفضيل الأخصائي والمريض.',
      bullets: [
        'بعض الأخصائيين يقدّمون تقييمًا أوليًا بالفيديو.',
      ],
    },
    {
      q: 'كيف يتم التسعير والدفع؟',
      a: 'التسعير يحدّده الأخصائي. الدفع سيكون إلكترونيًا (لاحقًا) أو مباشرة لدى الأخصائي وفق المتاح.',
      bullets: [
        'سيتم دعم الدفع الإلكتروني والمحافظ المحلية قريبًا.',
      ],
    },
    {
      q: 'ماذا عن سرية المعلومات والسجل الطبي؟',
      a: 'نطبّق ممارسات أمان قوية. لا يرى الأخصائي سجلك إلا بعد موافقتك، ولغرض الرعاية فقط.',
    },
    {
      q: 'كيف يتم التحقق من الأخصائيين؟',
      a: 'نراجع الرخص المهنية والشهادات قبل تفعيل الحساب، مع تقييمات من المرضى بعد الجلسات لزيادة الشفافية.',
    },
    {
      q: 'ما المناطق واللغات المتاحة؟',
      a: 'نبدأ بمدن رئيسية داخل السعودية مع دعم العربية والإنجليزية، ونتوسع تدريجيًا.',
    },
    {
      q: 'هل تقدمون دعمًا للطوارئ؟',
      a: 'لا، عون ليست لخدمات الطوارئ. في حالات الطوارئ اتصل بـ 997 أو أقرب مستشفى فورًا.',
    },
  ],
  note: 'لم تجد إجابتك؟ تواصل معنا عبر صفحة الدعم.',
};

const EN = {
  title1: 'Frequently',
  title2: 'Asked Questions',
  blurb: 'Quick answers about booking, verification, privacy, and payments.',
  items: [
    {
      q: 'How do I book a physiotherapy session?',
      a: 'Search by city/specialty/gender, pick an available slot, then confirm. You’ll get a confirmation and a reminder.',
      bullets: [
        'You can reschedule/cancel up to 12 hours before the session.',
        'Late cancellations may incur a small fee.',
      ],
    },
    {
      q: 'Do you require Absher/National ID verification?',
      a: 'Yes, one-time verification improves trust and safety. It’s processed via a trusted gateway and we do not store sensitive data.',
    },
    {
      q: 'Are sessions in-person or remote?',
      a: 'Currently in-person at clinics or home visits, depending on the therapist and patient preference.',
      bullets: ['Some therapists offer an initial video assessment.'],
    },
    {
      q: 'How is pricing and payment handled?',
      a: 'Therapists set their own rates. Payments will be electronic (soon) or handled directly with the therapist when available.',
      bullets: ['Local e-payments and wallets are coming soon.'],
    },
    {
      q: 'What about privacy and medical records?',
      a: 'We follow strong security practices. A therapist can only access your record with your consent and for care purposes.',
    },
    {
      q: 'How are therapists verified?',
      a: 'We verify professional licenses and credentials before activation. Post-session patient reviews add transparency.',
    },
    {
      q: 'Which regions and languages are supported?',
      a: 'We start with major cities in Saudi Arabia, supporting Arabic and English, and will expand gradually.',
    },
    {
      q: 'Do you handle emergencies?',
      a: 'No—Awn is not for emergencies. For urgent care call 997 or go to the nearest ER.',
    },
  ],
  note: 'Didn’t find your answer? Reach out via the Support page.',
};

export default function FAQs({ locale = 'ar' }: { locale?: Locale }) {
  const t = locale === 'ar' ? AR : EN;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32" dir={dir}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
          <div className={locale === 'ar' ? 'text-center lg:text-right' : 'text-center lg:text-left'}>
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              {t.title1} <br className="hidden lg:block" /> {t.title2}
            </h2>
            <p className="text-muted-foreground">{t.blurb}</p>
          </div>

          <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
            {t.items.map((item, idx) => (
              <div key={idx} className={idx === 0 ? 'pb-6' : 'py-6'}>
                <h3 className="font-medium">{item.q}</h3>
                <p className="text-muted-foreground mt-4">{item.a}</p>
                {item.bullets && (
                  <ul className={`mt-4 space-y-2 pl-4 ${locale === 'ar' ? 'list-[arabic-indic]' : 'list-disc'}`}>
                    {item.bullets.map((b, i) => (
                      <li key={i} className="text-muted-foreground">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className={`col-span-full text-center ${locale === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
            <p className="text-sm text-muted-foreground">{t.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}