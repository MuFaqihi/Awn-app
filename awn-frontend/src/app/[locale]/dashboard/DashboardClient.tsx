"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { CalendarDays, Clock, MapPin, Video, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { GradientSlideButton } from "@/components/ui/gradient-slide-button";
import { RescheduleDialog } from "@/components/RescheduleDialog";
import { getTherapistById } from "@/lib/therapists";
import type { Appointment } from "@/lib/types";
import { useMedicalHistoryStatus, getMedicalHistoryLabels } from "@/hooks/use-medical-history-status";

type Props = { locale: Locale };

export default function DashboardClient({ locale }: Props) {
  const ar = locale === "ar";
  const [mounted, setMounted] = useState(false);
  const medicalHistory = useMedicalHistoryStatus();
  const labels = getMedicalHistoryLabels(locale);
  
  // State for appointments - so we can update the list when cancelled
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id:"thamer-alshahrani",
      therapistId: "thamer-alshahrani",
      date: "2025-11-04",
      time: "10:30",
      kind: "home",
      status: "upcoming",
    },
    {
      id: "alaa-ahmed", 
      therapistId: "alaa-ahmed",
      date: "2025-11-06",
      time: "14:00",
      kind: "online",
      status: "upcoming",
      meetLink: "https://meet.google.com/abc-def-ghi",
    },
  ]);
  
  // Fix hydration by ensuring client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Mock user data - replace with actual user data
  const userName = "Rawan";

  // Updated therapist notes with correct IDs
  const therapistNotes = [
    {
      id:"thamer-alshahrani",
      therapistId: "thamer-alshahrani",
      appointmentDate: "2025-10-20",
      note: ar 
        ? "المريض يظهر تحسناً جيداً في حركة الكتف. ننصح بمواصلة التمارين المنزلية وتجنب الحركات المفاجئة."
        : "Patient showing good improvement in shoulder mobility. Recommend continuing home exercises and avoiding sudden movements."
    },
    {
      id: "abdullah-alshahrani", 
      therapistId: "abdullah-alshahrani",
      appointmentDate: "2025-10-15",
      note: ar
        ? "تم البدء في العلاج الطبيعي للكتف الأيمن. استجابة جيدة للعلاج والمريض متعاون."
        : "Started physiotherapy for right shoulder. Good response to treatment and patient is cooperative."
    }
  ];

  const handleReschedule = async (appointmentId: string, newDate: Date, newTime: string, mode: string, note?: string) => {
    console.log("Rescheduling appointment:", appointmentId, { newDate, newTime, mode, note });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the appointment in the list
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { 
            ...apt, 
            date: newDate.toISOString().split('T')[0], 
            time: newTime, 
            kind: mode as "online" | "home" 
          }
        : apt
    ));
    
    console.log(ar ? "تمت إعادة الجدولة بنجاح" : "Rescheduled successfully");
  };

  const handleCancel = (appointmentId: string) => {
    console.log("Cancelling appointment:", appointmentId);
    
    // Remove the appointment from the list
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    
    console.log(ar ? "تم إلغاء الموعد" : "Appointment cancelled");
  };

  const handleNewAppointment = () => {
    // Check medical history status before booking
    if (!medicalHistory.isComplete) {
      alert(labels.safetyPrompt);
      window.location.href = `/${locale}/dashboard/medical-history`;
      return;
    }
    window.location.href = `/${locale}/therapists`;
  };

  const handleMedicalHistoryAction = () => {
    if (medicalHistory.isComplete) {
      window.location.href = `/${locale}/dashboard/medical-history`;
    } else {
      window.location.href = `/${locale}/dashboard/medical-history`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(ar ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const statusConfig = {
      upcoming: {
        label: ar ? "قادم" : "Upcoming",
        className: "bg-blue-100 text-blue-800"
      },
      completed: {
        label: ar ? "مكتمل" : "Completed", 
        className: "bg-green-100 text-green-800"
      },
      cancelled: {
        label: ar ? "ملغى" : "Cancelled",
        className: "bg-red-100 text-red-800"
      }
    } as const;

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-100 text-gray-800"
    };

    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4 sm:py-8">
      {/* Safety Alert Banner for Incomplete Medical History */}
      {!medicalHistory.isComplete && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">
                {labels.safetyPrompt}
              </p>
            </div>
            <Button
              onClick={handleMedicalHistoryAction}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {labels.completeSetup}
            </Button>
          </div>
        </div>
      )}

      {/* Header - Mobile responsive */}
      <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div className="flex items-center gap-3">
    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
      {ar ? `أهلاً ${userName}` : `Welcome ${userName}`}
    </h1>
  </div>
</header>
{/* Medical History Card */}
      <Card className="mb-6 sm:mb-8 border-l-4 border-l-teal-500 bg-gradient-to-r from-teal-50 to-cyan-50">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-teal-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{labels.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {medicalHistory.isComplete ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">{labels.complete}</span>
                      {medicalHistory.lastUpdated && (
                        <span className="text-sm text-gray-600">
                          ({labels.lastUpdated} {new Date(medicalHistory.lastUpdated).toLocaleDateString(ar ? 'ar-SA' : 'en-US')})
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-amber-700">{labels.incomplete}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={handleMedicalHistoryAction}
              variant="outline"
              className="border-teal-200 text-teal-700 hover:bg-teal-50 w-full sm:w-auto"
            >
              {medicalHistory.isComplete ? labels.review : labels.completeSetup}
            </Button>
          </div>
          
          {/* Show key medical info if complete */}
          {medicalHistory.isComplete && medicalHistory.summary.precautions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-teal-200">
              <div className="flex flex-wrap gap-2">
                {medicalHistory.summary.precautions.slice(0, 3).map((precaution, index) => (
                  <Badge key={index} variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                    ⚠️ {precaution}
                  </Badge>
                ))}
                {medicalHistory.summary.precautions.length > 3 && (
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-600">
                    +{medicalHistory.summary.precautions.length - 3} {ar ? "أكثر" : "more"}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Main Grid - Mobile responsive */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Upcoming Appointments - Full width on mobile, 2 columns on desktop */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6 h-full">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold">{ar ? "المواعيد القادمة" : "Upcoming Appointments"}</h2>
              <GradientSlideButton 
                onClick={handleNewAppointment}
                className="transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                {ar ? "احجز موعد جديد" : "Book new appointment"}
              </GradientSlideButton>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <CalendarDays className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {ar ? "لا توجد مواعيد قادمة" : "No upcoming appointments"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {ar ? "احجز موعدك التالي الآن" : "Book your next appointment now"}
                </p>
                <GradientSlideButton 
                  onClick={handleNewAppointment}
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {ar ? "احجز موعد" : "Book appointment"}
                </GradientSlideButton>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const therapist = getTherapistById(appointment.therapistId);
                  
                  return (
                    <Card key={appointment.id} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                      <div className="p-4 sm:p-6 relative z-10 bg-white dark:bg-gray-900">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <img
                              src={therapist?.image || "/avatar-placeholder.jpg"}
                              className="h-10 sm:h-12 w-10 sm:w-12 rounded-full object-cover flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                              alt={therapist?.name.en || "Therapist"}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                <h3 className="text-base sm:text-lg font-semibold truncate">
                                  {ar ? therapist?.name.ar : therapist?.name.en || (ar ? "المعالج" : "Therapist")}
                                </h3>
                                {getStatusBadge(appointment.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {ar ? therapist?.specialties[1] : therapist?.specialties[0]}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="h-4 w-4" />
                                  {formatDate(appointment.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {appointment.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  {appointment.kind === "online" ? (
                                    <Video className="h-4 w-4" />
                                  ) : (
                                    <MapPin className="h-4 w-4" />
                                  )}
                                  {appointment.kind === "online" ? (
                                    ar ? "أونلاين" : "Online"
                                  ) : (
                                    ar ? "في المنزل" : "At home"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                            {/* Reschedule Button */}
                            <RescheduleDialog
                              appointment={appointment}
                              locale={locale}
                              onReschedule={(newDate, newTime, mode, note) => 
                                handleReschedule(appointment.id, newDate, newTime, mode, note)
                              }
                              trigger={
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="transition-all duration-200 hover:scale-105 active:scale-95 flex-1 sm:flex-none border-[#35757F] text-[#35757F] hover:bg-[#35757F] hover:text-white hover:shadow-md"
                                >
                                  {ar ? "إعادة الجدولة" : "Reschedule"}
                                </Button>
                              }
                            />

                            {/* FIXED: Properly Responsive Cancel Dialog */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="transition-all duration-200 hover:scale-105 active:scale-95 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-md flex-1 sm:flex-none"
                                >
                                  {ar ? "إلغاء" : "Cancel"}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-lg font-semibold text-center">
                                    {ar ? "تأكيد إلغاء الموعد؟" : "Confirm cancellation?"}
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                
                                <div className="py-4">
                                  <p className="text-sm text-gray-600 leading-relaxed text-center">
                                    {ar 
                                      ? "هل أنت متأكد من إلغاء هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء."
                                      : "Are you sure you want to cancel this appointment? This action cannot be undone."
                                    }
                                  </p>
                                </div>

                                <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
                                  <AlertDialogCancel className="w-full sm:w-auto">
                                    {ar ? "رجوع" : "Back"}
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleCancel(appointment.id)} 
                                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                                  >
                                    {ar ? "نعم، إلغاء" : "Yes, cancel"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        {/* Join Session Button for online appointments */}
                        {appointment.kind === 'online' && appointment.meetLink && (
                          <div className="mt-4 pt-4 border-t">
                            <Button 
                              onClick={() => window.open(appointment.meetLink, '_blank')}
                              className="transition-all duration-200 hover:scale-105 active:scale-95 text-white hover:shadow-lg w-full sm:w-auto"
                              size="sm"
                              style={{
                                backgroundColor: '#30846D'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#2a7460';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#30846D';
                              }}
                            >
                              <Video className="h-4 w-4 mr-2" />
                              {ar ? "انضم للجلسة" : "Join Session"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Therapist Notes - Full width on mobile, 1 column on desktop */}
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6 h-full">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{ar ? "ملاحظات المعالج" : "Therapist Notes"}</h3>
            <div className="space-y-4 sm:space-y-6">
              {therapistNotes.map((noteData) => {
                const therapist = getTherapistById(noteData.therapistId);
                return (
                  <div 
                    key={noteData.id} 
                    className="rounded-lg border bg-muted/30 p-3 sm:p-4 transition-all duration-200 hover:bg-muted/50 hover:shadow-md cursor-pointer"
                  >
                    {/* Therapist info header */}
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={therapist?.image || "/avatar-placeholder.jpg"} 
                        className="h-8 sm:h-10 w-8 sm:w-10 rounded-full object-cover transition-transform duration-200 hover:scale-110" 
                        alt={therapist?.name.en || "Therapist"} 
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm">
                          {ar ? therapist?.name.ar : therapist?.name.en}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {ar ? therapist?.specialties[1] : therapist?.specialties[0]}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(noteData.appointmentDate)}
                      </div>
                    </div>
                    
                    {/* Note content */}
                    <p className="text-sm leading-relaxed">
                      {noteData.note}
                    </p>
                  </div>
                );
              })}
              
              {therapistNotes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">{ar ? "لا توجد ملاحظات بعد." : "No notes yet."}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}