import type { Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, Calendar, Heart, Users, Shield, Clock } from 'lucide-react';

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const ar = params.locale === 'ar';
  const base = `/${params.locale}`;

  const t = ar ? {
    title: 'عن عون',
    subtitle: 'منصة تربط المرضى بأخصائيي العلاج الطبيعي المرخصين في السعودية',
    
    howTitle: 'كيف تعمل عون؟',
    forPatients: 'للمرضى',
    forTherapists: 'للأخصائيين',
    
    patientSteps: [
      { icon: Search, title: 'ابحث عن أخصائي', desc: 'تصفح الأخصائيين حسب التخصص والموقع' },
      { icon: Calendar, title: 'احجز موعدك', desc: 'اختر الوقت المناسب واحجز بسهولة' },
      { icon: Heart, title: 'احصل على العلاج', desc: 'استمتع بجلسة علاج طبيعي متخصصة' }
    ],

    therapistSteps: [
      { icon: Users, title: 'أنشئ ملفك', desc: 'سجل بياناتك المهنية وتخصصاتك' },
      { icon: Shield, title: 'تحقق من هويتك', desc: 'أكمل عملية التحقق من الترخيص' },
      { icon: Clock, title: 'أدر جدولك', desc: 'تحكم في مواعيدك واستقبل المرضى' }
    ],

    trustTitle: 'الثقة والأمان',
    trustDesc: 'نركز على التحقق من تراخيص الأخصائيين وحماية بيانات المرضى الطبية والشخصية.',
    
    coverageTitle: 'التغطية الجغرافية',
    coverageDesc: 'نبدأ بتغطية الرياض مع خطط للتوسع لمدن أخرى في السعودية.',
    
    cta1: 'ابحث عن أخصائي',
    cta2: 'انضم كأخصائي'
  } : {
    title: 'About Awn',
    subtitle: 'A platform connecting patients with licensed physiotherapists in Saudi Arabia',
    
    howTitle: 'How Awn Works',
    forPatients: 'For Patients',
    forTherapists: 'For Therapists',
    
    patientSteps: [
      { icon: Search, title: 'Find a Therapist', desc: 'Browse therapists by specialty and location' },
      { icon: Calendar, title: 'Book Appointment', desc: 'Choose convenient time and book easily' },
      { icon: Heart, title: 'Get Treatment', desc: 'Enjoy specialized physiotherapy session' }
    ],

    therapistSteps: [
      { icon: Users, title: 'Create Profile', desc: 'Register your professional data and specialties' },
      { icon: Shield, title: 'Verify Identity', desc: 'Complete license verification process' },
      { icon: Clock, title: 'Manage Schedule', desc: 'Control your appointments and receive patients' }
    ],

    trustTitle: 'Trust & Safety',
    trustDesc: 'We focus on verifying therapist licenses and protecting patients\' medical and personal data.',
    
    coverageTitle: 'Coverage Area',
    coverageDesc: 'Starting with Riyadh coverage with plans to expand to other cities in Saudi Arabia.',
    
    cta1: 'Find a Therapist',
    cta2: 'Join as Therapist'
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:py-20 space-y-12" dir={ar ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold md:text-4xl text-gray-900">{t.title}</h1>
        <p className="text-muted-foreground text-lg">{t.subtitle}</p>
      </header>

      {/* How it Works */}
      <section className="space-y-8">
        <h2 className="text-2xl font-medium text-gray-900">{t.howTitle}</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Patients */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-600">{t.forPatients}</h3>
            <div className="space-y-4">
              {t.patientSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg mt-1">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* For Therapists */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-teal-600">{t.forTherapists}</h3>
            <div className="space-y-4">
              {t.therapistSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg mt-1">
                      <IconComponent className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="space-y-3">
        <h2 className="text-2xl font-medium text-gray-900">{t.trustTitle}</h2>
        <p className="text-muted-foreground">{t.trustDesc}</p>
      </section>

      {/* Coverage */}
      <section className="space-y-3">
        <h2 className="text-2xl font-medium text-gray-900">{t.coverageTitle}</h2>
        <p className="text-muted-foreground">{t.coverageDesc}</p>
      </section>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-3 pt-4">
        <Button asChild className="bg-[#013D5B] hover:bg-[#013D5B]/90">
          <Link href={`${base}/therapists`}>
            {t.cta1}
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-teal-500 text-teal-600 hover:bg-teal-50">
          <Link href={`${base}/signup?role=therapist`}>
            {t.cta2}
          </Link>
        </Button>
      </div>
    </div>
  );
}
