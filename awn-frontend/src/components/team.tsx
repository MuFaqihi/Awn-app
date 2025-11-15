"use client";

import type { Locale } from "@/lib/i18n";
import Link from "next/link";

type Filters = { gender: string; specialty: string; session: string };

export default function TeamSection({
  locale,
  searchQuery,
  filters,
}: {
  locale: Locale;
  searchQuery: string;
  filters: Filters;
}) {
  const isArabic = locale === "ar";

  const members = [
    {
      slug: "Thamer-alshahrani",
      name: { ar: "ثامر الشهراني", en: "Thamer Alshahrani" },
      role: { ar: "العلاج الطبيعي العضلي الهيكلي، والإصابات الرياضية.", en: "Musculoskeletal physiotherapy and sports injuries" },
      avatar: "/thamir.png",
      gender: "male",
      specialty: "sports",
      session: "online",
    },
    {
      slug: "Ayman-Alsaadi",
      name: { ar: "ايمن الصاعدي ", en: "Ayman Alsaadi" },
      role: { ar: "إعادة التأهيل والعلاج الطبيعي العام.", en: "General physical therapy and rehabilitation" },
      avatar: "/Ayman.jpg", 
      gender: "male",
      specialty: "general",
      session: "home",
    },
    {
      slug: "Khaled-Habib",
      name: { ar: "خالد حبيب", en: "Khaled Habib" },
      role: { ar: "مشاكل العضلات، العظام، والعلاج اليدوي المتقدم.", en: "Muscle and skeletal disorders, advanced manual therapy" },
      avatar: "/khalid.jpg",
      gender: "male",
      specialty: "orthopedic",
      session: "home",
    },
    {
      slug: "Abdullah-Alshahrani",
      name: { ar: "عبدالله الشهراني", en: "Abdullah Alshahran" },
      role: { ar: "إصابات العظام، الإصابات الرياضية، والعلاج اليدوي المتقدم." , en: "Orthopedic injuries, sports injuries, and advanced manual therapy" },
      avatar: "/abdullah.jpg", 
      gender: "male",
      specialty: ["orthopedic", "sports"],
      session: "online",
    },
    {
      slug: "Nismah-Alalshi",
      name: { ar: "نسمه العلشي", en: "Nismah Alalshi" },
      role: { ar: "ضعف عضلات قاع الحوض، آلام الحوض بعد الحمل، ألم أسفل الظهر بعد الولادة، تمارين استرجاع القوة للجسم", en: "Women’s Health & Postpartum Rehabilitation Specialist" },
      avatar: "/Nismah.jpg", 
      gender: "female",
      specialty: "women",
      session: "home",
    },
    {
      slug: "Alaa-Ahmed",
      name: { ar: "الاء أحمد", en: "Alaa Ahmed" },
      role: { ar: "أخصائية علاج طبيعي للمسنين", en: "Geriatric Physical Therapist" },
      avatar: "/Alaa.png", 
      gender: "female",
      specialty: "geriatrics",
      session: "online",
    },
  ];

  // فلترة وبحث
  const filteredMembers = members.filter((m) => {
    const name = m.name?.[locale] ?? "";
    const role = m.role?.[locale] ?? "";
    const query = searchQuery?.toLowerCase() ?? "";

    const matchesSearch =
      name.toLowerCase().includes(query) || role.toLowerCase().includes(query);

    const matchesGender = filters.gender ? m.gender === filters.gender : true;
    const matchesSpecialty = filters.specialty
  ? Array.isArray(m.specialty)
    ? m.specialty.includes(filters.specialty)
    : m.specialty === filters.specialty
  : true;
    const matchesSession = filters.session ? m.session === filters.session : true;

    return matchesSearch && matchesGender && matchesSpecialty && matchesSession;
  });

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">
        {isArabic ? "الأخصائيون" : "Therapists"}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div key={member.slug} className="border rounded-lg p-4 shadow">
              {/*   الصورة تظهر كاملة بوضوح */}
              <img
                src={member.avatar}
                alt={member.name[locale]}
                className="h-60 w-full object-cover object-center rounded-md"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src = '/images/placeholder-avatar.png';
                }}
              />
              <h3 className="mt-2 font-medium">{member.name[locale]}</h3>
              <p className="text-sm text-gray-600">{member.role[locale]}</p>

             <Link
  href={`/${locale}/therapists/dr-sarah-ahmed`} // Use the actual ID from your data
  className="mt-3 inline-block text-emerald-600 hover:underline"
>
  {isArabic ? "تفاصيل" : "Details"}
</Link>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3">
            {isArabic ? "لا توجد نتائج مطابقة" : "No matching results"}
          </p>
        )}
      </div>
    </section>
  );
}