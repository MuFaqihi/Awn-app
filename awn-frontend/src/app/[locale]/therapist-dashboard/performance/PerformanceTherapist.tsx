"use client";
import * as React from "react";
import { useState, useMemo } from "react";
import type { Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Star, Calendar, User, DollarSign, TrendingUp, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

type TimeRange = "7d" | "30d" | "90d" | "all";

const TIME_RANGE_OPTIONS: { value: TimeRange; ar: string; en: string }[] = [
    { value: "7d", ar: "آخر 7 أيام", en: "Last 7 Days" },
    { value: "30d", ar: "آخر 30 يومًا", en: "Last 30 Days" },
    { value: "90d", ar: "آخر 3 أشهر", en: "Last 3 Months" },
    { value: "all", ar: "الكل (إجمالي سنة واحدة)", en: "All Time (1 Year Total)" },
];

const MONTHS: { ar: string, en: string }[] = [
    { ar: "أغسطس", en: "Aug" },
    { ar: "سبتمبر", en: "Sep" },
    { ar: "أكتوبر", en: "Oct" },
];

const QUARTERS: { ar: string, en: string }[] = [
    { ar: "الربع الأول", en: "Q1" },
    { ar: "الربع الثاني", en: "Q2" },
    { ar: "الربع الثالث", en: "Q3" },
    { ar: "الربع الرابع", en: "Q4" },
];

// 🌟 تم تعديل الأرقام لضمان منطقية العلاقة بين 90d و all
const calculateStats = (range: TimeRange, ar: boolean) => {
    let sessions = 0, earningsValue = 0, patients = 0, rating = 4.8;
    
    switch (range) {
        case "7d": sessions = 7; earningsValue = 1050; patients = 5; rating = 4.9; break;
        case "30d": sessions = 28; earningsValue = 4200; patients = 15; rating = 4.8; break;
        // تم تعديل 90d لتكون أقل من all
        case "90d": sessions = 75; earningsValue = 11250; patients = 35; rating = 4.7; break;
        // تم تعديل all لتكون هي الأعلى
        case "all": sessions = 100; earningsValue = 15000; patients = 50; rating = 4.9; break; 
    }

    const formatter = new Intl.NumberFormat(ar ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0,
    });

    const formattedEarnings = formatter.format(earningsValue);
    
    return [
        { key: "sessions", title: ar ? "عدد الجلسات" : "Sessions", value: sessions, icon: <Calendar className="h-6 w-6 text-blue-500" /> },
        { key: "earnings", title: ar ? "إجمالي الدخل" : "Total Earnings", value: formattedEarnings, icon: <DollarSign className="h-6 w-6 text-green-500" /> },
        { key: "rating", title: ar ? "متوسط التقييم" : "Average Rating", value: `${rating.toFixed(1)} ⭐`, icon: <Star className="h-6 w-6 text-yellow-500" /> },
        { key: "patients", title: ar ? "عدد المرضى" : "Patients", value: patients, icon: <User className="h-6 w-6 text-purple-500" /> },
    ];
};

// 📊 تم تعديل توزيع الجلسات في الرسم البياني ليناسب الأرقام الجديدة
const generateChartData = (range: TimeRange, ar: boolean) => {
    if (range === "7d") {
        return [
            { day: ar ? "يوم 1" : "Day 1", sessions: 1 }, { day: ar ? "يوم 2" : "Day 2", sessions: 2 },
            { day: ar ? "يوم 3" : "Day 3", sessions: 1 }, { day: ar ? "يوم 4" : "Day 4", sessions: 2 },
            { day: ar ? "يوم 5" : "Day 5", sessions: 3 }, { day: ar ? "يوم 6" : "Day 6", sessions: 1 },
            { day: ar ? "يوم 7" : "Day 7", sessions: 4 },
        ];
    }
    if (range === "30d") {
        return [
            { week: ar ? "الأسبوع 1" : "Week 1", sessions: 6 },
            { week: ar ? "الأسبوع 2" : "Week 2", sessions: 8 },
            { week: ar ? "الأسبوع 3" : "Week 3", sessions: 7 },
            { week: ar ? "الأسبوع 4" : "Week 4", sessions: 7 },
        ];
    }
    // مجموع 75
    if (range === "90d") {
        return [
            { month: ar ? MONTHS[0].ar : MONTHS[0].en, sessions: 20 }, 
            { month: ar ? MONTHS[1].ar : MONTHS[1].en, sessions: 25 }, 
            { month: ar ? MONTHS[2].ar : MONTHS[2].en, sessions: 30 }, 
        ];
    }
    // مجموع 100
    if (range === "all") {
        return [
            { quarter: ar ? QUARTERS[0].ar : QUARTERS[0].en, sessions: 20 },
            { quarter: ar ? QUARTERS[1].ar : QUARTERS[1].en, sessions: 30 },
            { quarter: ar ? QUARTERS[2].ar : QUARTERS[2].en, sessions: 25 },
            { quarter: ar ? QUARTERS[3].ar : QUARTERS[3].en, sessions: 25 },
        ];
    }
    return [];
};

const REVIEWS = [
    { 
        name: "نورة السبيعي", nameEn: "Noura Alsubaie", date: "2025-10-10", rating: 5, 
        feedback: "كانت الجلسة رائعة وشعرت بتحسن ملحوظ!", feedbackEn: "The session was great and I felt a noticeable improvement!" 
    },
    { 
        name: "ليلى المطيري", nameEn: "Laila Almutairi", date: "2025-10-14", rating: 4, 
        feedback: "المعالج متعاون جدًا ويشرح بوضوح.", feedbackEn: "The therapist is very cooperative and explains clearly." 
    },
    { 
        name: "سارة القحطاني", nameEn: "Sara Alqahtani", date: "2025-10-21", rating: 5, 
        feedback: "نتائج ممتازة خلال أسبوعين فقط.", feedbackEn: "Excellent results in just two weeks." 
    },
];

export default function PerformanceTherapist({ locale }: { locale: Locale }) {
    const ar = locale === "ar";
    const router = useRouter();
    const [timeRange, setTimeRange] = useState<TimeRange>("30d"); 

    const dateFormatter = useMemo(() => {
        const localeString = ar ? 'ar-SA' : 'en-US';
        return new Intl.DateTimeFormat(localeString, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            calendar: 'gregory', 
        });
    }, [ar]);

    const stats = useMemo(() => calculateStats(timeRange, ar), [timeRange, ar]);
    const chartData = useMemo(() => generateChartData(timeRange, ar), [timeRange, ar]);
    
    const chartDataKey = chartData[0] ? Object.keys(chartData[0]).find(key => key !== 'sessions') : 'week';

    const currentRatingStat = stats.find(s => s.key === 'rating');
    const currentRating = currentRatingStat ? parseFloat(String(currentRatingStat.value).replace(' ⭐', '')) : 0;
    const satisfactionPercentage = Math.round((currentRating / 5) * 100);
    const dashOffset = 282 * (1 - satisfactionPercentage / 100);
    const satisfactionColor = satisfactionPercentage >= 90 ? "#22c55e" : (satisfactionPercentage >= 80 ? "#f97316" : "#ef4444");

    const openDetail = (key: string) => {
        // تم إيقاف التنقل إلى صفحات التفاصيل لمنع رسالة "Page Not Found"
        // router.push(`/${locale}/therapist-dashboard/performance/${key}`);
        console.log(`Navigation to /${key} is temporarily disabled.`);
        // يمكن وضع منطق آخر هنا، مثل إظهار رسالة للمستخدم
    };

    return (
        <div
            dir={ar ? "rtl" : "ltr"}
            className={`mx-auto w-full max-w-7xl px-0 py-0 ${ar ? "text-right" : "text-left"}`}
        >
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {ar ? "متابعة الأداء" : "Performance Overview"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {ar ? "استعرض أداءك، تقييماتك، ودخلك الإجمالي" : "Track your performance, ratings, and earnings"}
                    </p>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center gap-2 min-w-[180px]">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        className="border rounded-lg px-4 py-2 text-sm bg-white shadow-sm hover:border-blue-500 transition cursor-pointer font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    >
                        {TIME_RANGE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {ar ? option.ar : option.en}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        
            <hr className="mb-8 border-gray-200" />

            <h2 className="text-xl font-semibold text-gray-800 mb-4">{ar ? "الإحصائيات الرئيسية" : "Key Metrics"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((item, i) => (
                    <Card
                        key={item.key}
                        className="relative overflow-hidden p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 transform hover:scale-[1.01]"
                        // هذه النقطة هي التي تم تعديلها لتوقيف التنقل
                        onClick={() => openDetail(item.key)}
                    >
                        <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
                            <BorderBeam size={150} duration={10} delay={i * 2} />
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{item.title}</p>
                                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{item.value}</h3>
                            </div>
                            {item.icon}
                        </div>
                    </Card>
                ))}
            </div>

            <hr className="mb-8 border-gray-200" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <Card className="col-span-2 p-6 relative overflow-hidden shadow-lg border border-gray-100">
                    <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
                        <BorderBeam size={200} duration={12} delay={3} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">
                                {ar ? "مقارنة الجلسات حسب الفترة الزمنية" : "Session comparison over time"}
                            </h2>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                                <XAxis dataKey={chartDataKey} stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#3b82f6' }}
                                />
                                <Bar dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-lg border border-gray-100">
                    <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
                        <BorderBeam size={150} duration={10} delay={5} />
                    </div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {ar ? "نسبة رضا المرضى" : "Patient Satisfaction"}
                        </h2>
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-full h-full">
                                <circle
                                    cx="50%" cy="50%" r="45%" stroke="#e5e7eb" strokeWidth="8" fill="none"
                                />
                                <circle
                                    cx="50%" cy="50%" r="45%" stroke={satisfactionColor} strokeWidth="8" fill="none"
                                    strokeDasharray="282" strokeDashoffset={dashOffset} strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold" style={{ color: satisfactionColor }}>
                                {satisfactionPercentage}%
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            {ar ? `بناءً على التقييمات في ${TIME_RANGE_OPTIONS.find(o => o.value === timeRange)?.ar}` : `Based on ratings for ${TIME_RANGE_OPTIONS.find(o => o.value === timeRange)?.en}`}
                        </p>
                    </div>
                </Card>
            </div>

            <hr className="mb-8 border-gray-200" />

            <Card className="relative overflow-hidden p-6 shadow-lg border border-gray-100">
                <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
                    <BorderBeam size={200} duration={10} delay={2} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500" />
                        {ar ? "تقييمات المرضى الأخيرة" : "Recent Patient Reviews"}
                    </h2>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 uppercase tracking-wider">
                                    <th className={`px-4 py-3 font-bold ${ar ? 'text-right' : 'text-left'}`}>{ar ? "المريض" : "Patient"}</th>
                                    <th className="px-4 py-3 font-bold">{ar ? "التاريخ" : "Date"}</th>
                                    <th className="px-4 py-3 font-bold">{ar ? "التقييم" : "Rating"}</th>
                                    <th className={`px-4 py-3 font-bold ${ar ? 'text-right' : 'text-left'}`}>{ar ? "الملاحظات" : "Feedback"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {REVIEWS.map((rev, i) => (
                                    <tr
                                        key={i}
                                        className="border-t border-gray-100 hover:bg-blue-50/50 transition duration-150"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {ar ? rev.name : rev.nameEn}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {dateFormatter.format(new Date(rev.date))}
                                        </td>
                                        <td className="px-4 py-3 text-yellow-500 font-semibold">{`${rev.rating} ⭐`}</td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {ar ? rev.feedback : rev.feedbackEn}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
}