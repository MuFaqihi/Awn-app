'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BorderBeam } from '@/components/ui/border-beam';
import { MapPin, CalendarDays, ShieldCheck, IdCard } from 'lucide-react';

type Locale = 'ar' | 'en';

type Dict = {
  title: string; subtitle: string;
  f1_title: string; f1_desc: string;
  f2_title: string; f2_desc: string;
  f3_title: string; f3_desc: string;
  f4_title: string; f4_desc: string;
  alt1: string; alt2: string; alt3: string; alt4: string;
};

const AR: Dict = {
  title: 'الأساس لمنصّة علاج طبيعي موثوقة',
  subtitle: 'عون ليست مجرد حجز مواعيد. نوفر دليل أخصائيين موثّق، تقويم ذكي، ومحتوى توعوي.',
  f1_title: 'دليل الأخصائيين (رياض فقط حالياً)',
  f1_desc: 'ابحث حسب التخصص والجنس والتقييم. الموقع الجغرافي سيُفعّل لاحقاً.',
  f2_title: 'توثيق الهوية (MVP)',
  f2_desc: 'واجهة مجهّزة لتكاملات التحقق؛ حالياً محاكاة بسيطة في المراحل الأولى.',
  f3_title: 'تقويم مواعيد ذكي',
  f3_desc: 'توفّر الأخصائي، حجز فوري، وتذكيرات عند الدمج بالبريد/SMS.',
  f4_title: 'مقالات توعوية ومراجعات',
  f4_desc: 'مكتبة بسيطة للمحتوى الحركي مع مراجعات بعد الجلسة.',
  alt1: 'دليل الأخصائيين',
  alt2: 'توثيق الهوية',
  alt3: 'تقويم المواعيد',
  alt4: 'محتوى ومراجعات',
};

const EN: Dict = {
  title: 'A reliable foundation for Physical Therapy',
  subtitle: 'Awn is more than booking: verified directory, smart calendar, and awareness content.',
  f1_title: 'Therapist Directory (Riyadh only for now)',
  f1_desc: 'Filter by specialty/gender/ratings. Geolocation later.',
  f2_title: 'ID Verification (MVP)',
  f2_desc: 'UI prepared for verification providers; mocked for early phases.',
  f3_title: 'Smart Booking Calendar',
  f3_desc: 'Availability management, instant booking, reminders later.',
  f4_title: 'Awareness & Reviews',
  f4_desc: 'Simple content library with post-session reviews.',
  alt1: 'Therapist directory',
  alt2: 'ID verification',
  alt3: 'Appointments calendar',
  alt4: 'Content & reviews',
};

type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4';

export default function FeaturesSection({ locale = 'ar' }: { locale?: Locale }) {
  const t = locale === 'ar' ? AR : EN;
  const isRTL = locale === 'ar';
  const [activeItem, setActiveItem] = useState<ImageKey>('item-1');

  const images: Record<ImageKey, { image: string; alt: string }> = {
    'item-1': { image: '/directory.png', alt: t.alt1 },
    'item-2': { image: '/id-verify.png', alt: t.alt2 },
    'item-3': { image: '/calendar.png', alt: t.alt3 },
    'item-4': { image: '/articles.png', alt: t.alt4 },
  };

  return (
    <section className="py-12 md:py-20 lg:py-32" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">{t.title}</h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
          <Accordion
            type="single"
            collapsible
            value={activeItem}
            onValueChange={(value) => setActiveItem((value as ImageKey) || 'item-1')}
            className="w-full"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <MapPin className="size-4" />
                  {t.f1_title}
                </div>
              </AccordionTrigger>
              <AccordionContent>{t.f1_desc}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <IdCard className="size-4" />
                  {t.f2_title}
                </div>
              </AccordionTrigger>
              <AccordionContent>{t.f2_desc}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <CalendarDays className="size-4" />
                  {t.f3_title}
                </div>
              </AccordionTrigger>
              <AccordionContent>{t.f3_desc}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <ShieldCheck className="size-4" />
                  {t.f4_title}
                </div>
              </AccordionTrigger>
              <AccordionContent>{t.f4_desc}</AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="bg-background relative flex overflow-hidden rounded-3xl border p-2">
            <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]" />
            <div className="aspect-76/59 bg-background relative w-[calc(3/4*100%+3rem)] rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeItem}-id`}
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md"
                >
                  <Image
                    src={images[activeItem].image}
                    className="size-full object-cover object-left-top dark:mix-blend-lighten"
                    alt={images[activeItem].alt}
                    width={1207}
                    height={929}
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <BorderBeam duration={6} size={200} className="from-transparent via-yellow-700 to-transparent dark:via-white/50" />
          </div>
        </div>
      </div>
    </section>
  );
}