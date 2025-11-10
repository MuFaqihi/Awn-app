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
      slug: "ahmed-alotaibi",
      name: { ar: "أحمد العتيبي", en: "Ahmed Al-Otaibi" },
      role: { ar: "أخصائي علاج طبيعي للأطفال", en: "Pediatric Physical Therapist" },
      avatar: "\images\therapists\Ahmed.png",
      gender: "male",
      specialty: "children",
      session: "online",
    },
    {
      slug: "sarah-alshahri",
      name: { ar: " سارة الشهري", en: "Sarah Al-Shahri" },
      role: { ar: "أخصائية علاج طبيعي للنساء", en: "Women’s Physical Therapist" },
      avatar: "\images\therapists\Sarah.png",
      gender: "female",
      specialty: "women",
      session: "home",
    },
    {
      slug: "mohammed-alghamdi",
      name: { ar: " محمد الغامدي", en: "Mohammed Al-Ghamdi" },
      role: { ar: "أخصائي تأهيل الإصابات الرياضية", en: "Sports Rehabilitation Specialist" },
      avatar: "\images\therapists\Mohammed.png",
      gender: "male",
      specialty: "sports",
      session: "home",
    },
    {
      slug: "huda-alqahtani",
      name: { ar: "هدى القحطاني", en: " Huda Al-Qahtani" },
      role: { ar: "أخصائية علاج طبيعي عصبي", en: "Neurological Physical Therapist" },
      avatar: "\images\therapists\Huda.png",
      gender: "female",
      specialty: "neuro",
      session: "online",
    },
    {
      slug: "faisal-alharbi",
      name: { ar: " فيصل الحربي", en: "Faisal Al-Harbi" },
      role: { ar: "أخصائي علاج طبيعي عظام", en: "Orthopedic Physical Therapist" },
      avatar: "\images\therapists\Faisal.png",
      gender: "male",
      specialty: "bones",
      session: "home",
    },
    {
      slug: "amani-aldosari",
      name: { ar: "أماني الدوسري", en: "Amani Al-Dosari" },
      role: { ar: "أخصائية علاج طبيعي للمسنين", en: "Geriatric Physical Therapist" },
      avatar: "\images\therapists\Amani.png",
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
    const matchesSpecialty = filters.specialty ? m.specialty === filters.specialty : true;
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
              <img
                src={member.avatar}
                alt={member.name[locale]}
                className="h-48 w-full object-cover rounded-md"
              />
              <h3 className="mt-2 font-medium">{member.name[locale]}</h3>
              <p className="text-sm text-gray-600">{member.role[locale]}</p>

              {/* زر التفاصيل يفتح صفحة الأخصائي */}
              <Link
                href={`/${locale}/therapists/${member.slug}`}
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
