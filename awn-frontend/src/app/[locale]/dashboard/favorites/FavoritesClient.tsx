"use client";
import * as React from "react";
import type { Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { therapists } from "@/data/therapists";
import { LikeButton } from "@/components/ui/like-button";
import { Expandable, ExpandableContent } from "@/components/ui/expandable";
import { Bookmark, BookmarkCheck, MapPin, Star, Calendar, Award, Globe, Sparkles, AlertTriangle, Shield } from "lucide-react";
import { useMedicalHistoryStatus, getMedicalHistoryLabels } from '@/hooks/use-medical-history-status';
import Link from "next/link";
import Image from "next/image";

interface FavoritesClientProps {
  locale: Locale;
}

export default function FavoritesClient({ locale }: FavoritesClientProps) {
  const ar = locale === "ar";
  
  // Medical History integration
  const medicalHistory = useMedicalHistoryStatus();
  const labels = getMedicalHistoryLabels(locale);
  
  // State to manage saved therapists
  const [savedTherapists, setSavedTherapists] = React.useState<string[]>([
    "ahmed-alotaibi", 
    "sarah-alshahri"
  ]); // Mock some saved therapists

  const favoriteTherapists = therapists.filter(t => savedTherapists.includes(t.id));

  const toggleSaved = (therapistId: string) => {
    setSavedTherapists(prev => 
      prev.includes(therapistId) 
        ? prev.filter(id => id !== therapistId)
        : [...prev, therapistId]
    );
    
    // Show tooltip when saving
    if (!savedTherapists.includes(therapistId)) {
      // Show a temporary tooltip
      const tooltip = document.createElement('div');
      tooltip.textContent = labels.therapistWillReview;
      tooltip.className = 'fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg text-sm z-50 max-w-xs shadow-lg';
      tooltip.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        z-index: 50;
        max-width: 20rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(8px);
        animation: slideInRight 0.3s ease-out;
      `;
      
      // Add CSS animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(tooltip);
      
      setTimeout(() => {
        tooltip.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
          if (document.body.contains(tooltip)) {
            document.body.removeChild(tooltip);
          }
          if (document.head.contains(style)) {
            document.head.removeChild(style);
          }
        }, 300);
      }, 3000);
    }
  };

  const handleBookAppointment = (therapistId: string) => {
    // Check medical history before booking
    if (!medicalHistory.isComplete) {
      alert(labels.safetyPrompt);
      window.location.href = `/${locale}/dashboard/medical-history`;
      return;
    }
    window.location.href = `/${locale}/therapists/${therapistId}?book=true`;
  };

  // Add warning check for high-intensity programs
  const hasConflictWarning = (therapist: any) => {
    // Mock: Check if therapist specializes in high-intensity and user has anticoagulant
    const isHighIntensity = therapist.specialties.some((s: string) => 
      s.toLowerCase().includes('sports') || 
      s.toLowerCase().includes('رياضي') ||
      s.toLowerCase().includes('orthopedic') ||
      s.toLowerCase().includes('عظام')
    );
    return isHighIntensity && medicalHistory.summary.hasAnticoagulant;
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {ar ? "المحفوظات" : "Saved Therapists"}
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          {ar ? "المعالجون المحفوظون لديك" : "Your saved therapists for quick access"}
        </p>
      </div>

      {favoriteTherapists.length === 0 ? (
        <Card className="text-center py-20 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 border-0 shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-100/20 via-transparent to-cyan-100/20"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-teal-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-200/30 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-teal-100/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-md mx-auto">
            {/* Icon with animation */}
            <div className="relative mb-8">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <Bookmark className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
                <Sparkles className="h-4 w-4 text-amber-800" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {ar ? "لا توجد محفوظات بعد" : "No Saved Therapists Yet"}
            </h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {ar 
                ? "ابدأ بحفظ المعالجين المفضلين لديك للوصول السريع إليهم لاحقاً" 
                : "Start saving your favorite therapists for quick access and easy booking later"
              }
            </p>

            {/* CTA Button */}
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = `/${locale}/therapists`}
                className="px-8 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                style={{
                  background: 'linear-gradient(to right, #0d9488, #0f766e)',
                  borderRadius: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, #0f766e, #134e4a)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, #0d9488, #0f766e)';
                }}
              >
                <Calendar className="h-5 w-5 mr-2" />
                {ar ? "تصفح المعالجين" : "Browse Therapists"}
              </Button>
              
              <p className="text-sm text-gray-500">
                {ar ? "اكتشف أفضل المعالجين واحفظهم لاحقاً" : "Discover the best therapists and save them for later"}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Header with count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <BookmarkCheck className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {ar ? "المعالجون المحفوظون" : "Saved Therapists"}
                </h2>
                <p className="text-sm text-gray-500">
                  {favoriteTherapists.length} {ar ? "معالج محفوظ" : "saved therapists"}
                </p>
              </div>
            </div>
          </div>

          {/* Medical History Safety Notice */}
          {medicalHistory.isComplete && medicalHistory.summary.precautions.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900 mb-1">
                      {ar ? "تذكير طبي مهم" : "Important Medical Reminder"}
                    </h3>
                    <p className="text-sm text-blue-700 mb-2">
                      {ar 
                        ? "جميع المعالجين المحفوظين سيراجعون تاريخك الطبي قبل الجلسة الأولى." 
                        : "All saved therapists will review your medical history before the first session."
                      }
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {medicalHistory.summary.precautions.slice(0, 2).map((precaution, index) => (
                        <Badge key={index} variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 text-xs">
                          ⚠️ {precaution}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Therapist Cards Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {favoriteTherapists.map((therapist) => (
              <Card key={therapist.id} className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <Image 
                        src={therapist.image} 
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100 group-hover:ring-teal-200 transition-all duration-300" 
                        alt={therapist.name[locale]} 
                      />
                      {therapist.credentials.scfhsVerified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Award className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-semibold truncate text-gray-900">
                            {therapist.name[locale]}
                          </h3>
                          <p className="text-gray-600 truncate">
                            {therapist.specialties[0]}
                          </p>
                          
                          {/* Medical Conflict Warning */}
                          {hasConflictWarning(therapist) && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              <span className="text-xs text-amber-600">{labels.mayNotBeSuitable}</span>
                            </div>
                          )}
                        </div>
                        <LikeButton 
                          initialLiked={true}
                          onToggle={() => toggleSaved(therapist.id)}
                          className="bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100"
                        >
                          {ar ? "محفوظ" : "Saved"}
                        </LikeButton>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        {therapist.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
                            {therapist.rating}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {therapist.credentials.yearsExperience} {ar ? "سنوات خبرة" : "years exp"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {therapist.city}
                        </span>
                      </div>

                      {/* Languages and Modes */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {therapist.languages.slice(0, 2).map((lang) => (
                          <Badge key={lang} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            <Globe className="h-3 w-3 mr-1" />
                            {lang}
                          </Badge>
                        ))}
                        {therapist.modes.map((mode) => (
                          <Badge key={mode} variant="secondary" className="text-xs bg-teal-100 text-teal-700">
                            {mode === "home" ? "🏠" : "💻"} 
                            {mode === "home" ? (ar ? "منزلية" : "Home") : (ar ? "أونلاين" : "Online")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Medical Safety Notice for High-Risk Cases */}
                  {hasConflictWarning(therapist) && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-amber-800 font-medium">
                            {ar ? "تنبيه طبي" : "Medical Alert"}
                          </p>
                          <p className="text-amber-700 text-xs mt-1">
                            {ar 
                              ? "قد تتطلب حالتك الطبية تقييماً إضافياً من المعالج" 
                              : "Your medical condition may require additional assessment"
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{ar ? "يبدأ من:" : "Starting from:"}</span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-teal-600">
                          {therapist.basePrice} {ar ? "ر.س" : "SAR"}
                        </span>
                        <div className="text-xs text-gray-500">{ar ? "للجلسة" : "per session"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleBookAppointment(therapist.id)}
                      className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95 text-white hover:shadow-lg"
                      style={{
                        backgroundColor: hasConflictWarning(therapist) ? '#d97706' : '#30846D'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = hasConflictWarning(therapist) ? '#b45309' : '#2a7460';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = hasConflictWarning(therapist) ? '#d97706' : '#30846D';
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {hasConflictWarning(therapist) 
                        ? (ar ? "استشارة أولى" : "Consultation") 
                        : (ar ? "احجز موعد" : "Book Now")
                      }
                    </Button>
                    <Link href={`/${locale}/therapists/${therapist.id}`} className="flex-1">
                      <Button 
                        variant="outline"
                        className="w-full hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {ar ? "عرض الملف" : "View Profile"}
                      </Button>
                    </Link>
                  </div>

                  {/* Quick Medical History Access */}
                  {medicalHistory.isComplete && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => window.location.href = `/${locale}/dashboard/medical-history`}
                        className="text-xs text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                      >
                        {ar ? "مراجعة تاريخي الطبي" : "Review my medical history"} →
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          {favoriteTherapists.length > 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600">
                  {ar 
                    ? "💡 نصيحة: يمكنك حفظ المزيد من المعالجين من صفحة تصفح المعالجين" 
                    : "💡 Tip: You can save more therapists from the browse therapists page"
                  }
                </p>
                <Button
                  onClick={() => window.location.href = `/${locale}/therapists`}
                  variant="link"
                  className="text-teal-600 hover:text-teal-700 text-sm mt-2"
                >
                  {ar ? "تصفح المزيد من المعالجين" : "Browse more therapists"} →
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}