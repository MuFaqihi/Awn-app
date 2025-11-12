"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { Star } from "lucide-react";

// ✅ بيانات جميع الأخصائيين
const members = [
  {
    slug: "Thamer-alshahrani",
    name: { ar: "ثامر الشهراني", en: "Thamer Alshahrani" },
    role: { ar: " مختص في العلاج الطبيعي العضلي الهيكلي والاصابات الرياضية ", en: " Musculoskeletal physiotherapy and sports injuries." },
    avatar: "/thamir.png",
    bio: {
      ar: "خبرة في علاج إصابات المفاصل والعضلات والعظام، ويُعد من أبرز المختصين في الإصابات الرياضية",
      en: "Highly experienced in treating joint, muscle, and bone injuries; recognized as a leading sports physiotherapy specialist.",
    },
    basePrice: 120,
    experience: { ar: " 4 سنوات", en: "4 years" },
    rating: 4.5,
    session: { ar: "جلسة أونلاين", en: "Online Session" },
  },
  {
    slug: "Ayman-Alsaadi",
    name: { ar: "ايمن الصاعدي", en: "Ayman Alsaadi" },
    role: { ar: "إعادة التأهيل والعلاج الطبيعي العام", en: "General physical therapy and rehabilitation" },
    avatar: "/Ayman.jpg", 
    bio: {
      ar: "يمتلك خبرة في التوعية المجتمعية حول أهمية العلاج الطبيعي ودوره في تحسين جودة الحياة.",
      en: "Experienced in community awareness about physical therapy and its role in improving quality of life",
    },
    basePrice: 150,
    experience: { ar: "3 سنوات", en: "3 years" },
    rating: 5,
    session: { ar: "جلسة منزلية", en: "Home Visit" },
  },
  {
    slug: "Khaled-Habib",
    name: { ar: "خالد حبيب", en: "Khaled Habib" },
    role: { ar: "مشاكل العضلات، والعلاج اليدوي المتقدم.", en: "Muscle and skeletal disorders, advanced manual therapy" },
    avatar: "/khalid.jpg",
    bio: {
      ar: "يمتلك خبرة واسعة في علاج مشاكل العضلات والعظام.",
      en: "Extensive experience in treating muscle and bone disorders",
    },
    basePrice: 140,
    experience: { ar: "10 سنوات", en: "10 years" },
    rating: 4.2,
    session: { ar: "جلسة منزلية", en: "Home Visit" },
  },
  {
    slug: "Abdullah-Alshahrani",
    name: { ar: "عبدالله الشهراني", en: "Abdullah Alshahrani" },
    role: { ar: " إصابات العظام، الإصابات الرياضية، والعلاج اليدوي المتقدم.", en: "Orthopedic injuries, sports injuries, and advanced manual therapy." },
    avatar: "/abdullah.jpg", 
    bio: {
      ar: "متخصص في التعامل مع إصابات العظام والإصابات الرياضية بخبرة عملية في إعادة التأهيل",
      en: "Skilled in managing bone and sports injuries with practical rehabilitation experience.",
    },
    basePrice: 170,
    experience: { ar: "5 سنوات", en: "5 years" },
    rating: 4.7,
    session: { ar: "جلسة أونلاين", en: "Online Session" },
  },
  {
    slug: "Nismah-Alalshi",
    name: { ar: "نسمه العلشي", en: "Nismah Alalshi" },
    role: { ar: "اخصائية تأهيل ما بعد الولادة وصحة الحوض", en: "Women’s Health & Postpartum Rehabilitation Specialist" },
    avatar: "/Nismah.jpg", 
    bio: {
      ar: "متخصصة في إعادة تأهيل ما بعد الولادة ومشاكل قاع الحوض للسيدات، وتركز على استرجاع القوة بأمان بدون ضغط على الجسم",
      en: "Specialized in postpartum recovery and pelvic floor rehabilitation for women, helping new mothers regain core strength safely and reduce chronic pelvic and lower back pain.",
    },
    basePrice: 170,
    experience: { ar: "8 سنوات", en: "8 years" },
    rating: 4.3,
    session: { ar: "جلسة منزلية", en: "Home Visit" },
  },
  {
    slug: "Alaa-Ahmed",
    name: { ar: "الاء أحمد", en: "Alaa Ahmed" },
    role: { ar: "أخصائية علاج طبيعي للمسنين", en: "Geriatric Physical Therapist" },
    avatar: "/Alaa.png", 
    bio: {
      ar: "تعمل على تحسين جودة حياة كبار السن من خلال خطط علاجية تناسب أعمارهم.",
      en: "Improves elderly quality of life through tailored therapeutic plans.",
    },
    basePrice: 130,
    experience: { ar: "12 سنة", en: "12 years" },
    rating: 5,
    session: { ar: "جلسة أونلاين", en: "Online Session" },
  },
];

// ✅ الأيام والأوقات باللغتين
const bookingDays = [
  { ar: "الأربعاء 22", en: "Wednesday 22" },
  { ar: "الخميس 23", en: "Thursday 23" },
  { ar: "الجمعة 24", en: "Friday 24" },
  { ar: "السبت 25", en: "Saturday 25" },
  { ar: "26 الأحد", en: "Sunday 26" },
  { ar: "27 الاثنين", en: "Monday 27" },
  { ar: "28 الثلاثاء", en: "Tuesday 28" },
];

const bookingTimes = [
  { ar: "9:00", en: "9:00" },
  { ar: "10:00", en: "10:00" },
  { ar: "11:00", en: "11:00" },
  { ar: "12:00", en: "12:00" },
  { ar: "14:00", en: "2:00 PM" },
  { ar: "16:00", en: "4:00 PM" },
];

export default function TherapistPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = use(params); // ✅ نفك الـ Promise
  const isArabic = locale === "ar";
  const router = useRouter();

  const therapist = members.find((m) => m.slug === slug);
  if (!therapist) return <p>{isArabic ? "الأخصائي غير موجود" : "Therapist not found"}</p>;

  // ✅ السعر: المنزلية +50
  const price =
    therapist.session.en === "Home Visit"
      ? therapist.basePrice + 50
      : therapist.basePrice;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert(isArabic ? "اختر يومًا ووقتًا قبل تأكيد الحجز" : "Please select a date and time before confirming");
      return;
    }
    router.push(`/${locale}/login`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* كارد الأخصائي */}
      <div className={`flex flex-col md:flex-row gap-6 items-center ${isArabic ? "md:flex-row-reverse" : ""}`}>
        <div className="w-48 h-48 rounded-lg overflow-hidden shadow-md border">
          <img src={therapist.avatar} alt={therapist.name[locale]} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-emerald-700">{therapist.name[locale]}</h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300 text-lg">
            {therapist.role[locale]} • {therapist.experience[locale]}
          </p>
          <p className="mt-2 italic text-gray-600 dark:text-gray-400">{therapist.bio[locale]}</p>

          <div className="mt-3 flex items-center gap-4">
            <span className="flex items-center gap-1 text-yellow-500 font-medium">
              <Star size={18} className="fill-yellow-500" /> {therapist.rating}
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-700">
              {therapist.session[locale]}
            </span>
          </div>

          <p className="mt-3 text-xl font-semibold text-emerald-600">
            {isArabic ? "سعر الجلسة:" : "Fee:"} {price} {isArabic ? "ريال" : "SAR"}
          </p>
        </div>
      </div>

      {/* اختيار اليوم */}
      <div className="mt-8 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">{isArabic ? "اختر اليوم" : "Select a day"}</h3>
        <div className="flex gap-2 flex-wrap">
          {bookingDays.map((day) => (
            <button
              key={day.en}
              onClick={() => setSelectedDate(day[locale])}
              className={`px-4 py-2 rounded-lg border font-medium ${
                selectedDate === day[locale] ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {day[locale]}
            </button>
          ))}
        </div>

        {/* اختيار الوقت */}
        {selectedDate && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">{isArabic ? "اختر الوقت" : "Select a time"}</h3>
            <div className="flex gap-2 flex-wrap">
              {bookingTimes.map((slot) => (
                <button
                  key={slot.en}
                  onClick={() => setSelectedTime(slot[locale])}
                  className={`px-4 py-2 rounded-lg border font-medium ${
                    selectedTime === slot[locale] ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {slot[locale]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* زر تأكيد */}
      {selectedDate && selectedTime && (
        <button
          onClick={handleConfirm}
          className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-emerald-700 transition"
        >
          {isArabic ? "تأكيد الحجز" : "Confirm Booking"}
        </button>
      )}
    </div>
  );
}
