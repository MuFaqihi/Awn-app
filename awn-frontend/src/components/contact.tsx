// src/components/contact-section.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

type Locale = 'ar' | 'en';

export default function ContactSection({ locale = 'ar' }: { locale?: Locale }) {
  const isAr = locale === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  return (
    <section className="py-32" dir={dir}>
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h1 className="text-center text-4xl font-semibold lg:text-5xl">
          {isAr ? 'تواصل معنا' : 'Contact Us'}
        </h1>
        <p className="mt-4 text-center">
          {isAr
            ? 'سنساعدك في اختيار الخطة المناسبة والإجابة عن استفساراتك حول عون.'
            : 'We’ll help you choose the right plan and answer any questions about Awn.'}
        </p>

        <Card className="mx-auto mt-12 max-w-lg p-8 shadow-md sm:p-16">
          <div>
            <h2 className="text-xl font-semibold">
              {isAr ? 'دعنا نوجّه رسالتك للمكان الصحيح' : 'Let’s route your request correctly'}
            </h2>
            <p className="mt-4 text-sm">
              {isAr
                ? 'أخبرنا من أنت وما نوع استفسارك لنخدمك بشكل أسرع.'
                : 'Tell us who you are and what you need so we can help faster.'}
            </p>
          </div>

          <form className="**:[&>label]:block mt-12 space-y-6 *:space-y-3">
            {/* Full name */}
            <div>
              <Label htmlFor="name">{isAr ? 'الاسم الكامل' : 'Full name'}</Label>
              <Input type="text" id="name" required placeholder={isAr ? 'الاسم الثلاثي' : 'Your full name'} />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">{isAr ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input type="email" id="email" required placeholder="name@example.com" />
            </div>

            {/* Phone (KSA) */}
            <div>
              <Label htmlFor="phone">{isAr ? 'رقم الجوال (اختياري)' : 'Phone (optional)'}</Label>
              <Input type="tel" id="phone" inputMode="tel" placeholder={isAr ? '05xxxxxxxx' : '+966 5x xxx xxxx'} />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role">{isAr ? 'أنت' : 'You are a'}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={isAr ? 'اختر دورك' : 'Select your role'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">{isAr ? 'مريض/مستفيد' : 'Patient / Client'}</SelectItem>
                  <SelectItem value="therapist">{isAr ? 'أخصائي علاج طبيعي' : 'Physiotherapist'}</SelectItem>
                  <SelectItem value="clinic">{isAr ? 'منشأة صحية' : 'Clinic / Medical center'}</SelectItem>
                  <SelectItem value="other">{isAr ? 'أخرى' : 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City / Region (Saudi) */}
            <div>
              <Label htmlFor="city">{isAr ? 'المدينة/المنطقة' : 'City / Region'}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={isAr ? 'اختر المدينة' : 'Select city'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riyadh">{isAr ? 'الرياض' : 'Riyadh'}</SelectItem>
                  <SelectItem value="jeddah">{isAr ? 'جدة' : 'Jeddah'}</SelectItem>
                  <SelectItem value="dammam">{isAr ? 'الدمام' : 'Dammam'}</SelectItem>
                  <SelectItem value="khobar">{isAr ? 'الخبر' : 'Khobar'}</SelectItem>
                  <SelectItem value="makkah">{isAr ? 'مكة' : 'Makkah'}</SelectItem>
                  <SelectItem value="madinah">{isAr ? 'المدينة المنورة' : 'Madinah'}</SelectItem>
                  <SelectItem value="qassim">{isAr ? 'القصيم' : 'Qassim'}</SelectItem>
                  <SelectItem value="abha">{isAr ? 'أبها' : 'Abha'}</SelectItem>
                  <SelectItem value="tabuk">{isAr ? 'تبوك' : 'Tabuk'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Inquiry type */}
            <div>
              <Label htmlFor="topic">{isAr ? 'نوع الاستفسار' : 'Inquiry type'}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={isAr ? 'اختر نوع الاستفسار' : 'Select a topic'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booking">{isAr ? 'مشكلة في الحجز' : 'Booking issue'}</SelectItem>
                  <SelectItem value="verification">{isAr ? 'توثيق الأخصائيين' : 'Therapist verification'}</SelectItem>
                  <SelectItem value="partnership">{isAr ? 'شراكات/منشآت صحية' : 'Partnerships / Clinics'}</SelectItem>
                  <SelectItem value="pricing">{isAr ? 'الأسعار والباقات' : 'Pricing & plans'}</SelectItem>
                  <SelectItem value="other">{isAr ? 'أخرى' : 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="msg">{isAr ? 'الرسالة' : 'Message'}</Label>
              <Textarea
                id="msg"
                rows={3}
                placeholder={
                  isAr
                    ? 'اكتب تفاصيل الاستفسار أو المشكلة باختصار...'
                    : 'Briefly describe your question or issue…'
                }
              />
            </div>

            <Button className="w-full">{isAr ? 'إرسال' : 'Submit'}</Button>
          </form>
        </Card>
      </div>
    </section>
  );
}