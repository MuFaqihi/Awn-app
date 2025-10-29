"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { CalendarDays, Clock, MapPin, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Expandable, ExpandableContent } from "@/components/ui/expandable";
import { GradientSlideButton } from "@/components/ui/gradient-slide-button";
import { RescheduleDialog } from "@/components/RescheduleDialog";
import { getTherapistById } from "@/lib/therapists";
import type { Appointment } from "@/lib/types";

type Props = { locale: Locale };

export default function DashboardClient({ locale }: Props) {
  const ar = locale === "ar";
  const [mounted, setMounted] = useState(false);
  
  // Fix hydration by ensuring client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Mock user data - replace with actual user data
  const userName = "Rawan";

  // Mock data - replace with API call
  const upcomingAppointments: Appointment[] = [
    {
      id: "apt_123",
      therapistId: "t_dr_mona",
      date: "2025-11-04",
      time: "10:30",
      kind: "clinic",
      place: "Dr. Mona's Clinic — Riyadh",
      status: "upcoming",
    },
    {
      id: "apt_124",
      therapistId: "t_dr_basel",
      date: "2025-11-06",
      time: "14:00",
      kind: "online",
      status: "upcoming",
      meetLink: "https://meet.google.com/abc-def-ghi",
    },
  ];

  // Mock therapist notes with proper structure
  const therapistNotes = [
    {
      id: "note_1",
      therapistId: "t_dr_mona",
      appointmentDate: "2025-10-20",
      note: ar 
        ? "المريض يظهر تحسناً جيداً في حركة الكتف. ننصح بمواصلة التمارين المنزلية وتجنب الحركات المفاجئة."
        : "Patient showing good improvement in shoulder mobility. Recommend continuing home exercises and avoiding sudden movements."
    },
    {
      id: "note_2", 
      therapistId: "t_dr_basel",
      appointmentDate: "2025-10-15",
      note: ar
        ? "تم البدء في العلاج الطبيعي للكتف الأيمن. استجابة جيدة للعلاج والمريض متعاون."
        : "Started physiotherapy for right shoulder. Good response to treatment and patient is cooperative."
    }
  ];

  const handleReschedule = async (appointmentId: string, newDate: Date, newTime: string, mode: string, note?: string) => {
    console.log("Rescheduling appointment:", appointmentId, { newDate, newTime, mode, note });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message without alert popup
    console.log(ar ? "تمت إعادة الجدولة بنجاح" : "Rescheduled successfully");
    // You can replace this with a toast notification or update the UI state
  };

  const handleCancel = (appointmentId: string) => {
    console.log("Cancelling appointment:", appointmentId);
    alert(ar ? "تم إلغاء الموعد" : "Appointment cancelled");
  };

  const handleNewAppointment = () => {
    window.location.href = `/${locale}/therapists`;
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
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
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
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {ar ? `أهلاً ${userName}` : `Welcome ${userName}`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <GradientSlideButton 
            onClick={handleNewAppointment}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {ar ? "موعد جديد" : "New appointment"}
          </GradientSlideButton>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Upcoming Appointments - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{ar ? "المواعيد القادمة" : "Upcoming Appointments"}</h2>
              <GradientSlideButton 
                onClick={handleNewAppointment}
                className="transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {ar ? "احجز موعد جديد" : "Book new"}
              </GradientSlideButton>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDays className="mx-auto h-16 w-16 text-gray-300 mb-4" />
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
                {upcomingAppointments.map((appointment) => {
                  const therapist = getTherapistById(appointment.therapistId);
                  
                  return (
                    <Card key={appointment.id} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                      <div className="p-6 relative z-10 bg-white dark:bg-gray-900">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <img
                              src={therapist?.avatar || "/avatar-placeholder.jpg"}
                              className="h-12 w-12 rounded-full object-cover flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                              alt={therapist?.name || "Therapist"}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold truncate">
                                  {ar ? therapist?.nameAr : therapist?.name || (ar ? "المعالج" : "Therapist")}
                                </h3>
                                {getStatusBadge(appointment.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {ar ? therapist?.specialtyAr : therapist?.specialty}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                                  {appointment.kind === "clinic" ? (
                                    appointment.place || (ar ? "في العيادة" : "In clinic")
                                  ) : appointment.kind === "online" ? (
                                    ar ? "أونلاين" : "Online"
                                  ) : (
                                    ar ? "في المنزل" : "At home"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 flex-shrink-0">
                            {/* Reschedule Button - Now with confirm button flow */}
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
                                  className="transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
                                >
                                  {ar ? "إعادة الجدولة" : "Reschedule"}
                                </Button>
                              }
                            />

                            {/* Cancel Button with Alert Dialog */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="transition-all duration-200 hover:scale-105 active:scale-95 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-md"
                                >
                                  {ar ? "إلغاء" : "Cancel"}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-lg font-semibold">
                                    {ar ? "تأكيد إلغاء الموعد؟" : "Confirm cancellation?"}
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="py-4">
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {ar 
                                      ? "هل أنت متأكد من إلغاء هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء."
                                      : "Are you sure you want to cancel this appointment? This action cannot be undone."
                                    }
                                  </p>
                                </div>
                                <AlertDialogFooter className="gap-3">
                                  <AlertDialogCancel className="transition-all duration-200 hover:scale-105 active:scale-95">
                                    {ar ? "رجوع" : "Back"}
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleCancel(appointment.id)} 
                                    className="transition-all duration-200 hover:scale-105 active:scale-95 bg-red-600 hover:bg-red-700 focus:ring-red-500"
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
                              className="transition-all duration-200 hover:scale-105 active:scale-95 bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
                              size="sm"
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

        {/* Therapist Notes - Takes 1 column */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full">
            <h3 className="text-2xl font-semibold mb-6">{ar ? "ملاحظات المعالج" : "Therapist Notes"}</h3>
            <div className="space-y-6">
              {therapistNotes.map((noteData) => {
                const therapist = getTherapistById(noteData.therapistId);
                return (
                  <div 
                    key={noteData.id} 
                    className="rounded-lg border bg-muted/30 p-4 transition-all duration-200 hover:bg-muted/50 hover:shadow-md cursor-pointer"
                  >
                    {/* Therapist info header */}
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={therapist?.avatar || "/avatar-placeholder.jpg"} 
                        className="h-10 w-10 rounded-full object-cover transition-transform duration-200 hover:scale-110" 
                        alt={therapist?.name || "Therapist"} 
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm">
                          {ar ? therapist?.nameAr : therapist?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {ar ? therapist?.specialtyAr : therapist?.specialty}
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