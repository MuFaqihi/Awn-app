"use client"

import { use } from "react"
import { useState } from "react"
import UploadsFiles from "@/components/uploadsfiles"
import type { Locale } from "@/lib/i18n"

export default function SignupForm({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const isArabic = locale === "ar"

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-emerald-700 mb-6">
        {isArabic ? "طلب التقديم للوظيفة" : "Job Application Form"}
      </h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* المعلومات الأساسية */}
          <section>
            <h2 className="text-lg font-semibold text-emerald-700 mb-3">
              {isArabic ? "المعلومات الأساسية" : "Basic Information"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isArabic ? "الاسم الأول *" : "First Name *"}
                className="w-full rounded-lg border p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                required
              />
              <input
                type="text"
                placeholder={isArabic ? "الاسم الأخير *" : "Last Name *"}
                className="w-full rounded-lg border p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                required
              />
              <input
                type="email"
                placeholder={isArabic ? "البريد الإلكتروني *" : "Email *"}
                className="w-full rounded-lg border p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 md:col-span-2"
                required
              />
              <div className="flex items-center gap-2 md:col-span-2">
                <span className="px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  +966
                </span>
                <input
                  type="tel"
                  placeholder={isArabic ? "الجوال *" : "Mobile *"}
                  className="w-full rounded-lg border p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <select
                className="w-full rounded-lg border p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 md:col-span-2"
                required
              >
                <option value="">{isArabic ? "الجنس" : "Gender"}</option>
                <option value="male">{isArabic ? "ذكر" : "Male"}</option>
                <option value="female">{isArabic ? "أنثى" : "Female"}</option>
              </select>
            </div>
          </section>

          {/* معلومات العنوان */}
          <section>
            <h2 className="text-lg font-semibold text-emerald-700 mb-3">
              {isArabic ? "معلومات العنوان" : "Address Information"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="w-full rounded-lg border p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                required
              >
                <option value="">{isArabic ? "الدولة" : "Country"}</option>
                <option value="saudi">
                  {isArabic ? "السعودية" : "Saudi Arabia"}
                </option>
              </select>
              <select
                className="w-full rounded-lg border p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                required
              >
                <option value="">{isArabic ? "المدينة" : "City"}</option>
                <option value="riyadh">{isArabic ? "الرياض" : "Riyadh"}</option>
                <option value="jeddah">{isArabic ? "جدة" : "Jeddah"}</option>
                <option value="dammam">{isArabic ? "الدمام" : "Dammam"}</option>
              </select>
            </div>
          </section>

          {/* التفاصيل المهنية */}
          <section>
            <h2 className="text-lg font-semibold text-emerald-700 mb-3">
              {isArabic ? "التفاصيل المهنية" : "Professional Details"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder={
                  isArabic ? "سنوات الخبرة *" : "Experience in Years *"
                }
                className="w-full rounded-lg border p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                required
              />

              {/* حقل تاريخ انتهاء التصنيف */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                  {isArabic
                    ? "تاريخ انتهاء التصنيف (هيئة التخصصات الصحية)"
                    : "SFHSC Expiration Date"}
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
            </div>
          </section>

          {/* المرفقات */}
          <section>
            <h2 className="text-lg font-semibold text-emerald-700 mb-3">
              {isArabic ? "المرفقات" : "Attachments"}
            </h2>
            <div className="space-y-4">
              <UploadsFiles
                label={isArabic ? "السيرة الذاتية" : "CV / Resume"}
              />
              <UploadsFiles
                label={isArabic ? "الهوية الوطنية" : "National ID"}
              />
              <UploadsFiles
                label={isArabic ? "آخر مؤهل علمي" : "Last Degree"}
              />
              <UploadsFiles
                label={
                  isArabic ? "تصنيف هيئة التخصصات" : "SFHSC Classification"
                }
              />
            </div>
          </section>

          {/* زر إرسال */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            {isArabic ? "إرسال الطلب" : "Submit Application"}
          </button>
        </form>
      ) : (
        <div className="text-center p-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-semibold text-emerald-700">
            {isArabic
              ? "تم تقديم الطلب بنجاح"
              : "Application Submitted Successfully"}
          </h2>
        </div>
      )}
    </div>
  )
}
