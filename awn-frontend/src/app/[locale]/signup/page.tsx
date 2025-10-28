"use client";

import Image from "next/image";
import { use } from "react";
import type { Locale } from "@/lib/i18n";
import { Linkedin, MessageCircle, Copy, X as XIcon } from "lucide-react"; // ✅ بدلنا Twitter بـ X

export default function JoinAsTherapist({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  const isArabic = locale === "ar";

  const jobUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://awn.sa/signup";

  const handleShare = (platform: string) => {
    let shareUrl = "";
    if (platform === "whatsapp") {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(jobUrl)}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        jobUrl
      )}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        jobUrl
      )}&text=${encodeURIComponent(
        isArabic ? "فرصة عمل رائعة مع منصة عون!" : "Great job opportunity with Awn!"
      )}`;
    } else if (platform === "copy") {
      navigator.clipboard.writeText(jobUrl);
      alert(isArabic ? "تم نسخ الرابط ✅" : "Link copied ✅");
      return;
    }
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* العمود الأول: الصورة + الجملة */}
        <div className="flex flex-col items-center text-center">
          <div className="w-72 h-72 relative">
            <Image
              src="/images/phisotherapists.jpg"
              alt={isArabic ? "دعم العلاج الطبيعي" : "Physiotherapy support"}
              fill
              className="object-contain rounded-full shadow-lg bg-white p-4"
            />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300 italic">
            {isArabic
              ? "نؤمن أن الحركة حياة، ونحن هنا لنكون عونًا لك وللمرضى."
              : "We believe movement is life, and we are here to support you and your patients."}
          </p>
        </div>

        {/* العمود الثاني: النصوص */}
        <div className="space-y-8">
          {/* العنوان */}
          <div>
            <h1 className="text-3xl font-bold text-emerald-700 mb-4">
              {isArabic ? "انضم كأخصائي علاج طبيعي" : "Join as a Physiotherapist"}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {isArabic ? (
                <>
                  فرصة للانضمام إلى فريق منصة{" "}
                  <span className="font-semibold text-emerald-600">عون</span>{" "}
                  لتقديم جلسات علاجية منزلية أو أونلاين بجودة عالية وسهولة وصول.
                </>
              ) : (
                <>
                  An opportunity to join{" "}
                  <span className="font-semibold text-emerald-600">Awn</span>{" "}
                  platform to provide home or online physiotherapy sessions with
                  high quality and easy accessibility.
                </>
              )}
            </p>
          </div>

          {/* الوصف */}
          <section>
            <h2 className="text-xl font-semibold text-emerald-700 mb-2">
              {isArabic ? "عن الوظيفة" : "About the Job"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isArabic
                ? "ستقوم بتقديم جلسات علاج طبيعي للمرضى سواء في منازلهم أو عبر جلسات أونلاين، مع مرونة في اختيار الأوقات ودعم من فريق عون لتسهيل وصول المرضى إليك."
                : "You will provide physiotherapy sessions to patients either at their homes or online, with flexible scheduling and support from the Awn team to help patients reach you."}
            </p>
          </section>

          {/* المتطلبات */}
          <section>
            <h2 className="text-xl font-semibold text-emerald-700 mb-2">
              {isArabic ? "المتطلبات" : "Requirements"}
            </h2>
            <ul className="list-disc ps-6 text-gray-600 dark:text-gray-400 space-y-1">
              <li>
                {isArabic
                  ? "تصنيف ساري المفعول من هيئة التخصصات الصحية."
                  : "Valid classification from the Saudi Commission for Health Specialties."}
              </li>
              <li>
                {isArabic ? "اجتياز المقابلة الشخصية." : "Pass the interview."}
              </li>
              <li>
                {isArabic
                  ? "الالتزام بالمواعيد وجودة الجلسات."
                  : "Commitment to schedules and session quality."}
              </li>
            </ul>
          </section>

          {/* المزايا */}
          <section>
            <h2 className="text-xl font-semibold text-emerald-700 mb-2">
              {isArabic ? "المزايا" : "Benefits"}
            </h2>
            <ul className="list-disc ps-6 text-gray-600 dark:text-gray-400 space-y-1">
              <li>
                {isArabic
                  ? "الوصول لعدد كبير من المرضى عبر المنصة."
                  : "Access to a wide number of patients through the platform."}
              </li>
              <li>
                {isArabic
                  ? "مرونة في العمل (جلسات أونلاين أو زيارات منزلية)."
                  : "Flexibility in work (online or home visits)."}
              </li>
              <li>
                {isArabic
                  ? "نسبة مجزية من كل جلسة."
                  : "Competitive percentage from each session."}
              </li>
            </ul>
          </section>

          {/* أزرار المشاركة */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {isArabic ? "شارك الوظيفة:" : "Share this job:"}
            </span>
            <button
              onClick={() => handleShare("whatsapp")}
              className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-900"
            >
              <MessageCircle size={18} />
            </button>
            <button
              onClick={() => handleShare("linkedin")}
              className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-900"
            >
              <Linkedin size={18} />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-900"
            >
              <XIcon size={18} /> {/* ✅ أيقونة X بدل تويتر */}
            </button>
            <button
              onClick={() => handleShare("copy")}
              className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-900"
            >
              <Copy size={18} />
            </button>
          </div>

          {/* زر التقديم */}
          <div>
            <a
              href={isArabic ? "/ar/signup/form" : "/en/signup/form"}
              className="inline-block mt-6 px-8 py-4 bg-emerald-600 text-white text-lg rounded-lg shadow hover:bg-emerald-700 transition"
            >
              {isArabic ? "قدّم الآن" : "Apply Now"}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
