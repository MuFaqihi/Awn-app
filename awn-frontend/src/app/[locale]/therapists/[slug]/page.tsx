"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { Star } from "lucide-react";

// ✅ بيانات جميع الأخصائيين
const members = [
  {
    slug: "ahmed-alotaibi",
    name: { ar: "أحمد العتيبي", en: "Ahmed Al-Otaibi" },
    role: { ar: "أخصائي علاج طبيعي للأطفال", en: "Pediatric Physical Therapist" },
    avatar: "/images/therapists/Ahmed.png",
    bio: {
      ar: "يؤمن بأن اللعب والتفاعل الإيجابي أساس نجاح جلسات الأطفال.",
      en: "Believes play and positive interaction are key to children’s progress.",
    },
    basePrice: 120,
    experience: { ar: "10 سنوات", en: "10 years" },
    rating: 4.5,
    session: { ar: "جلسة أونلاين", en: "Online Session" },
  },
  {
    slug: "sarah-alshahri",
    name: { ar: "سارة الشهري", en: "Sarah Al-Shahri" },
    role: { ar: "أخصائية علاج طبيعي للنساء", en: "Women’s Physical Therapist" },
    avatar: "\images\therapists\Sarah.png",
    bio: {
      ar: "تركّز على صحة المرأة بشكل متكامل وتساعد في استعادة التوازن بعد الحمل والولادة.",
      en: "Focuses on holistic women’s health and recovery after childbirth.",
    },
    basePrice: 150,
    experience: { ar: "8 سنوات", en: "8 years" },
    rating: 5,
    session: { ar: "جلسة منزلية", en: "Home Visit" },
  },
  {
    slug: "mohammed-alghamdi",
    name: { ar: "محمد الغامدي", en: "Mohammed Al-Ghamdi" },
    role: { ar: "أخصائي تأهيل الإصابات الرياضية", en: "Sports Rehabilitation Specialist" },
    avatar: "\images\therapists\Mohammed.png",
    bio: {
      ar: "يساعد الرياضيين على استعادة لياقتهم بسرعة وأمان باستخدام أحدث طرق العلاج.",
      en: "Helps athletes recover safely and efficiently with modern techniques.",
    },
    basePrice: 140,
    experience: { ar: "7 سنوات", en: "7 years" },
    rating: 4.2,
    session: { ar: "جلسة منزلية", en: "Home Visit" },
  },
  {
    slug: "huda-alqahtani",
    name: { ar: "هدى القحطاني", en: "Huda Al-Qahtani" },
    role: { ar: "أخصائية علاج طبيعي عصبي", en: "Neurological Physical Therapist" },
    avatar: "\images\therapists\Huda.png",
    bio: {
      ar: "تساعد المرضى على استعادة قدراتهم الحركية بعد الجلطات والإصابات العصبية.",
      en: "Supports patients in regaining mobility after strokes and neurological injuries.",
    },
    basePrice: 170,
    experience: { ar: "9 سنوات", en: "9 years" },
    rating: 4.7,
    session: { ar: "جلسة أونلاين", en: "Online Session" },
  },
  {
    slug: "faisal-alharbi",
    name: { ar: "فيصل الحربي", en: "Faisal Al-Harbi" },
    role: { ar: "أخصائي علاج طبيعي عظام", en: "Orthopedic Physical Therapist" },
    avatar: "\images\therapists\Faisal.png",
    bio: {
      ar: "متخصص في علاج مشاكل العظام والعمود الفقري باستخدام أحدث الأساليب.",
      en: "Specializes in treating bones and spine with advanced therapeutic methods.",
    },
    basePrice: 170,
    experience: { ar: "6 سنوات", en: "6 years" },
    rating: 4.3,
    session: { ar: "جلسة منزلية", en: "Home Visit" },
  },
  {
    slug: "amani-aldosari",
    name: { ar: "أماني الدوسري", en: "Amani Al-Dosari" },
    role: { ar: "أخصائية علاج طبيعي للمسنين", en: "Geriatric Physical Therapist" },
    avatar: "\images\therapists\Amani.png",
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
