"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Star, MapPin, Clock, Shield, Award, Calendar, CheckCircle, Globe, Users, Heart, X, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/base-button"
import { Input } from "@/components/ui/input"
import { CalendarPicker } from "@/components/ui/calendar-picker"
import { therapists } from "@/data/therapists"
import type { Locale } from "@/lib/i18n"

// Define the Therapist type
type Therapist = {
  id: string;
  name: { ar: string; en: string };
  image: string;
  specialties: string[];
  rating?: number;
  reviewCount?: number;
  credentials: {
    yearsExperience: number;
    scfhsVerified: boolean;
    education: string[];
    certificates: string[];
  };
  languages: string[];
  bio: { ar: string; en: string };
  approach: { ar: string; en: string };
  expertise: string[];
  city: string;
  modes: Array<"home" | "online">;
  basePrice: number;
  homeVisitFee: number;
  nextAvailable: string;
  availability: Record<string, Record<"home" | "online", string[]>>;
};

type Mode = "home" | "online"

const DURATIONS = [30, 45, 60, 90, 120]

const modeLabel = (m: Mode, ar: boolean) =>
  m === "home" ? (ar ? "زيارة منزلية" : "Home visit")
  : (ar ? "عن بُعد" : "Online")

const modeIcon = (m: Mode) => 
  m === "home" ? "🏠" : "💻"

function computePrice(base: number, mode: Mode, duration: number, homeFee = 100) {
  const durationAdj = duration === 45 ? 25 : duration === 60 ? 50 : duration === 90 ? 75 : duration === 120 ? 100 : 0
  const modeAdj = mode === "home" ? homeFee : 0
  return { base, durationAdj, modeAdj, total: base + durationAdj + modeAdj }
}

function formatDuration(duration: number, isArabic: boolean) {
  if (duration >= 60) {
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    if (minutes === 0) {
      return `${hours} ${isArabic ? "ساعة" : "hr"}`
    } else {
      return `${hours}.5 ${isArabic ? "ساعة" : "hr"}`
    }
  }
  return `${duration} ${isArabic ? "دقيقة" : "min"}`
}

interface Props {
  params: Promise<{ locale: Locale; slug: string }>
}

export default function TherapistPage({ params }: Props) {
  const { locale, slug } = use(params)
  const isArabic = locale === "ar"
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldOpenBooking = searchParams.get('book') === 'true'

  const therapist = therapists.find((t: any) => t.id === slug)
  if (!therapist) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isArabic ? "الأخصائي غير موجود" : "Therapist not found"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {isArabic ? "لم نتمكن من العثور على هذا الأخصائي" : "We couldn't find this therapist"}
        </p>
      </div>
    </div>
  )

  // State for saved therapists
  const [savedTherapists, setSavedTherapists] = useState<string[]>([
    "nismah-alalshi", 
    "khalid-habib",
  ]); // Mock some saved therapists

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSaved = (therapistId: string) => {
    setSavedTherapists(prev => 
      prev.includes(therapistId) 
        ? prev.filter(id => id !== therapistId)
        : [...prev, therapistId]
    );
  };

  // Booking state
  const [showBooking, setShowBooking] = useState(shouldOpenBooking)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [mode, setMode] = useState<Mode>(therapist.modes[0])
  const [duration, setDuration] = useState<number>(60)
  const [dateISO, setDateISO] = useState<string>("")
  const [time, setTime] = useState<string>("")
  const [details, setDetails] = useState({ name: "", phone: "", email: "", notes: "", address: "" })
  const [paymentMethod, setPaymentMethod] = useState<"card" | "tabby" | "tamara" | "apple">("card")
  const [bookingId, setBookingId] = useState<string>("")

  const pricing = computePrice(therapist.basePrice, mode, duration, therapist.homeVisitFee)

  // Validation - include email
  const canNext = step === 1
    ? !!(dateISO && time && mode && duration)
    : step === 2
    ? !!(details.name && details.phone && details.email && (mode !== "home" || details.address))
    : step === 3 ? true
    : step === 4 ? !!paymentMethod
    : true

  const handlePay = () => {
    const id = "AWN-" + Math.random().toString(36).slice(2, 8).toUpperCase()
    setBookingId(id)
    setStep(5)
  }

  const getAvailableSlots = (date: string, sessionMode: Mode) => {
    return therapist.availability[date]?.[sessionMode] || []
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as any)
    }
  }

  const handleNext = () => {
    if (step < 4) {
      setStep((s) => (s + 1) as any)
    }
  }

  useEffect(() => {
    if (shouldOpenBooking) {
      setShowBooking(true)
    }
  }, [shouldOpenBooking])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto p-4">
        
        {/* Header Section - Improved Layout */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Side - Larger Profile Image & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6 flex-1">
              {/* Larger Image */}
              <div className="relative w-48 h-48 mx-auto sm:mx-0 flex-shrink-0">
                <Image
                  src={therapist.image}
                  alt={therapist.name[locale]}
                  fill
                  className="rounded-xl object-cover"
                />
                {therapist.credentials.scfhsVerified && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {therapist.name[locale]}
                  </h1>
                  
                  {/* Save Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSaved(therapist.id)}
                    className={`transition-all duration-200 ${
                      savedTherapists.includes(therapist.id) 
                        ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" 
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {savedTherapists.includes(therapist.id) ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 mr-2" />
                        {isArabic ? "محفوظ" : "Saved"}
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 mr-2" />
                        {isArabic ? "حفظ" : "Save"}
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  {therapist.specialties.map((specialty: string) => (
                    <span key={specialty} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {specialty}
                    </span>
                  ))}
                </div>
                
                {/* Rating & Experience */}
                <div className="flex items-center gap-6 mt-4 justify-center sm:justify-start">
                  {therapist.rating ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-lg">{therapist.rating}</span>
                      <span className="text-gray-500">({therapist.reviewCount})</span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      {isArabic ? "لا توجد تقييمات بعد" : "No ratings yet"}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-5 h-5" />
                    <span className="font-medium">{therapist.credentials.yearsExperience} {isArabic ? "سنوات خبرة" : "years exp"}</span>
                  </div>
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                  {therapist.languages.map((lang: string) => (
                    <span key={lang} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      <Globe className="w-4 h-4" />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Session Options Card */}
            <div className="w-full lg:w-80">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 h-48 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold mb-4 text-lg">{isArabic ? "خيارات الجلسة" : "Session Options"}</h3>
                  <div className="space-y-3">
                    {therapist.modes.map((m: Mode) => (
                      <div key={m} className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{modeIcon(m)}</span>
                          <span className="font-medium">{modeLabel(m, isArabic)}</span>
                        </span>
                        <span className="font-bold text-primary">
                          {m === "home" ? therapist.basePrice + therapist.homeVisitFee : therapist.basePrice} {isArabic ? "ر.س" : "SAR"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Next Available */}
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isArabic ? "متاح " : "Available "}
                      {mounted ? new Date(therapist.nextAvailable).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB") : ''}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Book Now Button */}
              <Button 
                onClick={() => setShowBooking(true)}
                className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
                size="lg"
              >
                {isArabic ? "احجز الآن" : "Book Now"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">{isArabic ? "نبذة" : "About"}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {therapist.bio[locale]}
              </p>
              <div className="mt-4">
                <h3 className="font-medium mb-2">{isArabic ? "النهج العلاجي" : "Treatment Approach"}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {therapist.approach[locale]}
                </p>
              </div>
            </div>

            {/* Expertise Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">{isArabic ? "التخصصات والحالات" : "Expertise & Conditions"}</h2>
              <div className="flex flex-wrap gap-2">
                {therapist.expertise.map((item: string) => (
                  <span key={item} className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Credentials Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">{isArabic ? "المؤهلات" : "Credentials"}</h2>
              
              <div className="space-y-4">
                {/* SCFHS Verification */}
                {therapist.credentials.scfhsVerified && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-700 dark:text-green-400">
                      {isArabic ? "مرخص من هيئة التخصصات الصحية" : "SCFHS Verified"}
                    </span>
                  </div>
                )}
                
                {/* Education */}
                <div>
                  <h3 className="font-medium mb-2">{isArabic ? "التعليم" : "Education"}</h3>
                  <ul className="space-y-1">
                    {therapist.credentials.education.map((edu: string, i: number) => (
                      <li key={i} className="text-gray-600 dark:text-gray-300">• {edu}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Certificates */}
                <div>
                  <h3 className="font-medium mb-2">{isArabic ? "الشهادات" : "Certifications"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {therapist.credentials.certificates.map((cert: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Location & Booking */}
          <div className="space-y-6">
            
            {/* Location Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">{isArabic ? "الموقع والخدمة" : "Location & Service"}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{therapist.city}</span>
                </div>
                
                {therapist.modes.includes("home") && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <span>🏠</span>
                      <span className="text-sm font-medium">
                        {isArabic ? "زيارة منزلية متاحة" : "Home visits available"}
                      </span>
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      {isArabic ? `رسوم إضافية: ${therapist.homeVisitFee} ر.س` : `Additional fee: ${therapist.homeVisitFee} SAR`}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Booking CTA */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-primary">
                  {isArabic ? "من" : "from"} {therapist.basePrice} {isArabic ? "ر.س" : "SAR"}
                </div>
                <div className="text-sm text-gray-500">{isArabic ? "للجلسة الواحدة" : "per session"}</div>
              </div>
              
              <Button 
                onClick={() => setShowBooking(true)}
                className="w-full bg-primary hover:bg-primary/90 text-white"
                size="lg"
              >
                {isArabic ? "احجز الآن" : "Book Now"}
              </Button>
              
              <div className="text-center mt-3 text-xs text-gray-500">
                {isArabic ? "متاح للحجز الفوري" : "Available for instant booking"}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal/Section */}
        {showBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{isArabic ? "حجز جلسة" : "Book Session"}</h2>
                  <button 
                    onClick={() => setShowBooking(false)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Stepper */}
                <div className="flex flex-wrap gap-2 mb-6 text-sm">
                  {[
                    isArabic ? "اختيار" : "Select",
                    isArabic ? "التفاصيل" : "Details", 
                    isArabic ? "مراجعة" : "Review",
                    isArabic ? "الدفع" : "Payment",
                    isArabic ? "تم الحجز" : "Confirmed",
                  ].map((label, i) => (
                    <span key={label}
                      className={`px-3 py-1 rounded-full ${i + 1 === step ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                      {label}
                    </span>
                  ))}
                </div>

                {/* STEP 1: Select */}
                {step === 1 && (
                  <div className="space-y-6">
                    
                    {/* Mode */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">{isArabic ? "طريقة الجلسة" : "Session Mode"}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {therapist.modes.map((m: Mode) => (
                          <button key={m} onClick={() => setMode(m)}
                            className={`p-4 rounded-lg border text-left ${mode === m ? "bg-primary text-white border-primary" : "bg-gray-50 hover:bg-gray-100"}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{modeIcon(m)}</span>
                              <span className="font-medium">{modeLabel(m, isArabic)}</span>
                            </div>
                            <div className="text-sm opacity-75">
                              {isArabic ? "من" : "from"} {m === "home" ? therapist.basePrice + therapist.homeVisitFee : therapist.basePrice} {isArabic ? "ر.س" : "SAR"}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">{isArabic ? "مدة الجلسة" : "Duration"}</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {DURATIONS.map((d: number) => (
                          <button key={d} onClick={() => setDuration(d)}
                            className={`px-4 py-2 rounded-lg border ${duration === d ? "bg-primary text-white border-primary" : "bg-gray-100"}`}>
                            {formatDuration(d, isArabic)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calendar Date Picker */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">{isArabic ? "اختر اليوم" : "Select Date"}</h3>
                      <CalendarPicker
                        selectedDate={dateISO}
                        onDateSelect={setDateISO}
                        availableDates={Object.keys(therapist.availability)}
                        locale={isArabic ? "ar" : "en"}
                      />
                    </div>

                    {/* Time */}
                    {dateISO && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">{isArabic ? "اختر الوقت" : "Select Time"}</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {getAvailableSlots(dateISO, mode).map((t: string) => (
                            <button key={t} onClick={() => setTime(t)}
                              className={`px-4 py-2 rounded-lg border ${time === t ? "bg-primary text-white border-primary" : "bg-gray-100"}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price Summary */}
                    <div className="mt-6 p-4 bg-primary/10 text-primary rounded-lg">
                      <div className="flex justify-between items-center">
                        <span>{isArabic ? "الإجمالي المبدئي" : "Estimated Total"}</span>
                        <span className="font-bold text-lg">{pricing.total} {isArabic ? "ر.س" : "SAR"}</span>
                      </div>
                      <div className="text-sm mt-2 space-y-1">
                        <div>{isArabic ? "السعر الأساسي" : "Base price"}: {pricing.base} SAR</div>
                        {pricing.durationAdj > 0 && <div>{isArabic ? "إضافة المدة" : "Duration add-on"}: +{pricing.durationAdj} SAR</div>}
                        {pricing.modeAdj > 0 && <div>{isArabic ? "رسوم الزيارة المنزلية" : "Home visit fee"}: +{pricing.modeAdj} SAR</div>}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Details */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">{isArabic ? "الاسم الكامل" : "Full Name"}</label>
                      <Input
                        value={details.name}
                        onChange={(e) => setDetails({...details, name: e.target.value})}
                        placeholder={isArabic ? "أدخل اسمك الكامل" : "Enter your full name"}
                      />
                    </div>
                     
                    <div>
                      <label className="block text-sm font-medium mb-2">{isArabic ? "البريد الإلكتروني" : "Email Address"}</label>
                      <Input
                        type="email"
                        value={details.email}
                        onChange={(e) => setDetails({...details, email: e.target.value})}
                        placeholder={isArabic ? "your@email.com" : "your@email.com"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{isArabic ? "رقم الهاتف" : "Phone Number"}</label>
                      <Input
                        value={details.phone}
                        onChange={(e) => setDetails({...details, phone: e.target.value})}
                        placeholder={isArabic ? "05xxxxxxxx" : "05xxxxxxxx"}
                      />
                    </div>

                    {mode === "home" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">{isArabic ? "العنوان" : "Address"}</label>
                        <Input
                          value={details.address}
                          onChange={(e) => setDetails({...details, address: e.target.value})}
                          placeholder={isArabic ? "أدخل العنوان كاملاً" : "Enter complete address"}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">{isArabic ? "ملاحظات (اختياري)" : "Notes (Optional)"}</label>
                      <textarea
                        value={details.notes}
                        onChange={(e) => setDetails({...details, notes: e.target.value})}
                        placeholder={isArabic ? "أي معلومات إضافية..." : "Any additional information..."}
                        className="w-full p-3 border rounded-lg resize-none h-24"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Review */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{isArabic ? "ملخص الحجز" : "Booking Summary"}</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Therapist Info */}
                        <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                          <Image 
                            src={therapist.image} 
                            alt={therapist.name[locale]}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{therapist.name[locale]}</div>
                            <div className="text-sm text-gray-600">{therapist.specialties[0]}</div>
                          </div>
                        </div>

                        {/* Session Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/80 rounded-lg p-3">
                            <div className="text-xs text-gray-500 mb-1">{isArabic ? "التاريخ والوقت" : "Date & Time"}</div>
                            <div className="font-medium text-gray-900">
                              {new Date(dateISO).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB")}
                            </div>
                            <div className="text-sm text-gray-600">{time}</div>
                          </div>
                          
                          <div className="bg-white/80 rounded-lg p-3">
                            <div className="text-xs text-gray-500 mb-1">{isArabic ? "النوع والمدة" : "Type & Duration"}</div>
                            <div className="font-medium text-gray-900">{modeLabel(mode, isArabic)}</div>
                            <div className="text-sm text-gray-600">{formatDuration(duration, isArabic)}</div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white/80 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-2">{isArabic ? "معلومات الاتصال" : "Contact Information"}</div>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">{isArabic ? "الاسم:" : "Name:"}</span> {details.name}</div>
                            <div><span className="font-medium">{isArabic ? "الهاتف:" : "Phone:"}</span> {details.phone}</div>
                            <div><span className="font-medium">{isArabic ? "الإيميل:" : "Email:"}</span> {details.email}</div>
                            {mode === "home" && details.address && (
                              <div><span className="font-medium">{isArabic ? "العنوان:" : "Address:"}</span> {details.address}</div>
                            )}
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-white rounded-lg p-4 border border-primary/20">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>{isArabic ? "السعر الأساسي:" : "Base price:"}</span>
                              <span>{pricing.base} {isArabic ? "ر.س" : "SAR"}</span>
                            </div>
                            {pricing.durationAdj > 0 && (
                              <div className="flex justify-between">
                                <span>{isArabic ? "إضافة المدة:" : "Duration add-on:"}</span>
                                <span>+{pricing.durationAdj} {isArabic ? "ر.س" : "SAR"}</span>
                              </div>
                            )}
                            {pricing.modeAdj > 0 && (
                              <div className="flex justify-between">
                                <span>{isArabic ? "رسوم الزيارة المنزلية:" : "Home visit fee:"}</span>
                                <span>+{pricing.modeAdj} {isArabic ? "ر.س" : "SAR"}</span>
                              </div>
                            )}
                            <div className="border-t pt-2 flex justify-between font-bold text-lg text-primary">
                              <span>{isArabic ? "الإجمالي:" : "Total:"}</span>
                              <span>{pricing.total} {isArabic ? "ر.س" : "SAR"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

             {/* STEP 4: Payment */}
{step === 4 && (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">
      {isArabic ? "طريقة الدفع" : "Payment Method"}
    </h3>

    <div className="space-y-3">
      {/* Credit Card */}
      <button
        onClick={() => setPaymentMethod("card")}
        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
          paymentMethod === "card"
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">
              {isArabic ? "بطاقة ائتمان" : "Credit Card"}
            </div>
            <div className="text-sm text-gray-600">
              {isArabic ? "فيزا، ماستركارد، مدى" : "Visa, Mastercard, Mada"}
            </div>
          </div>

          <img
            src="/cards.png"
            alt="Card"
            className="w-10 h-10 opacity-80"
          />
        </div>
      </button>

      {/* Tabby */}
      <button
        onClick={() => setPaymentMethod("tabby")}
        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
          paymentMethod === "tabby"
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{isArabic ? "تابي" : "Tabby"}</div>
            <div className="text-sm text-gray-600">
              {isArabic ? "ادفع على 4 دفعات بدون فوائد" : "Pay in 4 interest-free installments"}
            </div>
          </div>

          <img
            src="/tappy.png"
            alt="Tabby"
            className="w-10 h-10 opacity-80"
          />
        </div>
      </button>

      {/* Tamara */}
      <button
        onClick={() => setPaymentMethod("tamara")}
        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
          paymentMethod === "tamara"
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{isArabic ? "تمارا" : "Tamara"}</div>
            <div className="text-sm text-gray-600">
              {isArabic ? "قسّط فاتورتك بدون فوائد" : "Split your bill with no interest"}
            </div>
          </div>

          <img
            src="/tamara.jpeg"
            alt="Tamara"
            className="w-10 h-10 opacity-80"
          />
        </div>
      </button>

      {/* Apple Pay */}
      <button
        onClick={() => setPaymentMethod("apple")}
        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
          paymentMethod === "apple"
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{isArabic ? "آبل باي" : "Apple Pay"}</div>
            <div className="text-sm text-gray-600">
              {isArabic ? "ادفع بأمان عبر Apple Pay" : "Pay securely with Touch ID"}
            </div>
          </div>

          <img
            src="/applepay.png"
            alt="Apple Pay"
            className="w-10 h-10 opacity-80"
          />
        </div>
      </button>
    </div>
  </div>
)}

                {/* STEP 5: Confirmation */}
                {step === 5 && (
                  <div className="text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-600 mb-2">
                        {isArabic ? "تم تأكيد حجزك!" : "Booking Confirmed!"}
                      </h3>
                     
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm">
                      <p className="mb-2">{isArabic ? "سنرسل لك رسالة تأكيد قريباً" : "We'll send you a confirmation message shortly"}</p>
                      <p>{isArabic ? "يمكنك إدارة حجزك من حسابك" : "You can manage your booking from your account"}</p>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                {step < 5 && (
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button 
                      variant="outline" 
                      disabled={step === 1} 
                      onClick={handleBack}
                    >
                      {isArabic ? "رجوع" : "Back"}
                    </Button>
                    
                    {step < 4 ? (
                      <Button 
                        disabled={!canNext} 
                        onClick={handleNext}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isArabic ? "التالي" : "Next"}
                      </Button>
                    ) : (
                      <Button 
                        disabled={!canNext} 
                        onClick={handlePay}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isArabic ? "ادفع وأكد" : "Pay & Confirm"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}