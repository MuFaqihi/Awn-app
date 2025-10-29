"use client";
import * as React from "react";
import type { Locale } from "@/lib/i18n";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { GradientSlideButton } from "@/components/ui/gradient-slide-button";
import { RescheduleDialog } from "@/components/RescheduleDialog";
import { Rating } from "@/components/ui/rating";
import { getTherapistById } from "@/lib/therapists";
import type { Appointment } from "@/lib/types";
import { CalendarDays, Clock, MapPin, Star, Video, Home, Filter, Lightbulb, Calendar, Users } from "lucide-react";

type Props = { locale: Locale };

export default function ApptsClient({ locale }: Props) {
  const ar = locale === "ar";
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [typeFilter, setTypeFilter] = useState<'all' | 'online' | 'clinic' | 'home'>('all');
  const [ratings, setRatings] = React.useState<Record<string, number>>({});

  // Mock data - replace with API calls
  const upcomingAppointments: Appointment[] = [
    {
      id: "apt_123",
      therapistId: "t_dr_mona",
      date: "2025-11-15",
      time: "10:30",
      kind: "clinic",
      place: "Dr. Mona's Clinic — Riyadh",
      status: "upcoming",
    },
    {
      id: "apt_124",
      therapistId: "t_dr_basel",
      date: "2025-11-20",
      time: "14:00",
      kind: "online",
      status: "upcoming",
      meetLink: "https://meet.google.com/abc-def-ghi",
    },
    {
      id: "apt_125",
      therapistId: "t_dr_mona",
      date: "2025-11-25",
      time: "16:00",
       kind: "home",
      status: "upcoming",
    },
  ];

  const pastAppointments: Appointment[] = [
    {
      id: "apt_past_1",
      therapistId: "t_dr_mona",
      date: "2025-10-20",
      time: "15:00",
      kind: "clinic",
      place: "Dr. Mona's Clinic — Riyadh",
      status: "completed",
    },
    {
      id: "apt_past_2",
      therapistId: "t_dr_basel",
      date: "2025-10-15",
      time: "11:30",
      kind: "online",
      status: "completed",
    },
    {
      id: "apt_past_3",
      therapistId: "t_dr_mona",
      date: "2025-10-10",
      time: "09:00",
      kind: "home",
      status: "completed",
    },
  ];

  const handleReschedule = async (appointmentId: string, newDate: Date, newTime: string, mode: string, note?: string) => {
    console.log("Rescheduling appointment:", appointmentId, { newDate, newTime, mode, note });
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleCancel = (appointmentId: string) => {
    console.log("Cancelling appointment:", appointmentId);
  };

  const handleRate = (appointmentId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [appointmentId]: rating }));
    console.log("Rating appointment:", appointmentId, rating);
  };

  const handleRebook = (appointment: Appointment) => {
    window.location.href = `/${locale}/therapists/${appointment.therapistId}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(ar ? 'ar-SA' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const statusConfig = {
      upcoming: {
        label: ar ? "قادم" : "Upcoming",
        className: "bg-blue-50 text-blue-700 border-blue-200"
      },
      completed: {
        label: ar ? "مكتمل" : "Completed", 
        className: "bg-green-50 text-green-700 border-green-200"
      },
      cancelled: {
        label: ar ? "ملغى" : "Cancelled",
        className: "bg-red-50 text-red-700 border-red-200"
      }
    } as const;

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-50 text-gray-700 border-gray-200"
    };

    return (
      <Badge variant="outline" className={`${config.className} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (kind: string) => {
    switch (kind) {
      case 'online':
        return <Video className="h-4 w-4" />;
      case 'home':
        return <Home className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (kind: string) => {
    switch (kind) {
      case 'online':
        return ar ? "أونلاين" : "Online";
      case 'home':
        return ar ? "في المنزل" : "At home";
      default:
        return ar ? "في العيادة" : "In clinic";
    }
  };

  // Filter appointments by type
  const filterByType = (appointments: Appointment[]) => {
    if (typeFilter === 'all') return appointments;
    return appointments.filter(apt => apt.kind === typeFilter);
  };

  const filteredUpcoming = filterByType(upcomingAppointments);
  const filteredPast = filterByType(pastAppointments);
  const currentAppointments = activeFilter === 'upcoming' ? filteredUpcoming : filteredPast;

  const appointmentTips = [
    {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      text: ar ? "انضم للجلسة الأونلاين قبل 5 دقائق" : "Join online sessions 5 minutes early"
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      text: ar ? "حضر أسئلتك مسبقاً" : "Prepare your questions beforehand"
    },
    {
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      text: ar ? "ألغِ أو أعد الجدولة قبل 24 ساعة على الأقل" : "Cancel or reschedule at least 24 hours in advance"
    }
  ];

  const renderAppointmentCard = (appointment: Appointment, showActions: boolean = false) => {
    const therapist = getTherapistById(appointment.therapistId);
    
    return (
      <Card key={appointment.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-2xl hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="relative">
                <img
                  src={therapist?.avatar || "/avatar-placeholder.jpg"}
                  className="h-14 w-14 rounded-full object-cover flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ring-2 ring-gray-100"
                  alt={therapist?.name || "Therapist"}
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                  {getTypeIcon(appointment.kind)}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold truncate text-gray-900">
                    {ar ? therapist?.nameAr : therapist?.name || (ar ? "المعالج" : "Therapist")}
                  </h3>
                  {getStatusBadge(appointment.status)}
                </div>
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  {ar ? therapist?.specialtyAr : therapist?.specialty}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(appointment.date)}
                  </span>
                  <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4" />
                    {appointment.time}
                  </span>
                  <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                    {getTypeIcon(appointment.kind)}
                    {appointment.kind === "clinic" ? (
                      appointment.place || getTypeLabel(appointment.kind)
                    ) : (
                      getTypeLabel(appointment.kind)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions for upcoming appointments */}
            {showActions && appointment.status === 'upcoming' && (
              <div className="flex gap-3 flex-shrink-0">
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
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{ar ? "تأكيد إلغاء الموعد؟" : "Confirm cancellation?"}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">
                        {ar 
                          ? "هل أنت متأكد من إلغاء هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء."
                          : "Are you sure you want to cancel this appointment? This action cannot be undone."
                        }
                      </p>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="transition-all duration-200 hover:scale-105 active:scale-95">
                        {ar ? "رجوع" : "Back"}
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleCancel(appointment.id)} 
                        className="transition-all duration-200 hover:scale-105 active:scale-95 bg-red-600 hover:bg-red-700"
                      >
                        {ar ? "نعم، إلغاء" : "Yes, cancel"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {/* Rating and Rebook for completed appointments */}
            {appointment.status === 'completed' && (
              <div className="flex flex-col items-end gap-3">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    {ar ? "قيم التجربة:" : "Rate experience:"}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="cursor-pointer">
                        <Rating
                          value={ratings[appointment.id] || 0}
                          onChange={() => {}} // Will be handled by dialog
                          size="md"
                          readonly={!!ratings[appointment.id]}
                        />
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {ar ? "قيم تجربتك" : "Rate Your Experience"}
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <div className="py-6 text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                          {ar ? "كيف كانت جلستك مع" : "How was your session with"} {ar ? therapist?.nameAr : therapist?.name}?
                        </p>
                        <Rating
                          value={ratings[appointment.id] || 0}
                          onChange={(value) => setRatings(prev => ({ ...prev, [appointment.id]: value }))}
                          size="lg"
                          className="justify-center"
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="transition-all duration-200 hover:scale-105 active:scale-95">
                          {ar ? "إلغاء" : "Cancel"}
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleRate(appointment.id, ratings[appointment.id] || 0)}
                          className="transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                          {ar ? "تأكيد التقييم" : "Submit Rating"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <Button 
                  onClick={() => handleRebook(appointment)}
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                >
                  {ar ? "احجز مرة أخرى" : "Book Again"}
                </Button>
              </div>
            )}
          </div>

          {/* Join Session Button for upcoming online appointments */}
          {appointment.status === 'upcoming' && appointment.kind === 'online' && appointment.meetLink && (
            <div className="mt-6 pt-4 border-t">
              <Button 
                onClick={() => window.open(appointment.meetLink, '_blank')}
                className="transition-all duration-200 hover:scale-105 active:scale-95 bg-green-600 hover:bg-green-700 text-white hover:shadow-lg w-full sm:w-auto"
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
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{ar ? "المواعيد" : "Appointments"}</h1>
        <p className="text-gray-600 mt-2">
          {ar ? "إدارة مواعيدك مع المعالجين" : "Manage your appointments with therapists"}
        </p>
      </div>

      {/* Improved Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Main Filter Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
            <Button
              variant={activeFilter === 'upcoming' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('upcoming')}
              className={`flex items-center gap-2 rounded-lg px-6 py-2 transition-all duration-200 ${
                activeFilter === 'upcoming' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              {ar ? "قادمة" : "Upcoming"}
              {filteredUpcoming.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs bg-blue-100 text-blue-700">
                  {filteredUpcoming.length}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeFilter === 'past' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('past')}
              className={`flex items-center gap-2 rounded-lg px-6 py-2 transition-all duration-200 ${
                activeFilter === 'past' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="h-4 w-4" />
              {ar ? "سابقة" : "Past"}
              {filteredPast.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-700">
                  {filteredPast.length}
                </Badge>
              )}
            </Button>
          </div>

          <GradientSlideButton 
            onClick={() => window.location.href = `/${locale}/therapists`}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {ar ? "احجز موعد جديد" : "Book New Appointment"}
          </GradientSlideButton>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>{ar ? "تصفية حسب النوع:" : "Filter by type:"}</span>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: ar ? 'الكل' : 'All', icon: Users },
              { key: 'online', label: ar ? 'أونلاين' : 'Online', icon: Video },
              { key: 'clinic', label: ar ? 'العيادة' : 'Clinic', icon: MapPin },
              { key: 'home', label: ar ? 'المنزل' : 'Home', icon: Home }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={typeFilter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter(key as any)}
                className={`transition-all duration-200 hover:scale-105 active:scale-95 ${
                  typeFilter === key 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Tips */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            {ar ? "نصائح للمواعيد" : "Appointment Tips"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {appointmentTips.map((tip, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-gray-700">
                {tip.icon}
                <span>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Content */}
      <div>
        {currentAppointments.length === 0 ? (
          <Card className="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-md mx-auto">
              {activeFilter === 'upcoming' ? (
                <CalendarDays className="mx-auto h-24 w-24 text-gray-300 mb-6" />
              ) : (
                <Clock className="mx-auto h-24 w-24 text-gray-300 mb-6" />
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {activeFilter === 'upcoming' 
                  ? (ar ? "لا توجد مواعيد قادمة" : "No upcoming appointments")
                  : (ar ? "لا توجد مواعيد سابقة" : "No past appointments")
                }
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {activeFilter === 'upcoming' 
                  ? (ar ? "ابدأ رحلة العلاج الطبيعي مع أفضل المعالجين" : "Start your physiotherapy journey with the best therapists")
                  : (ar ? "ستظهر مواعيدك المكتملة هنا مع إمكانية التقييم" : "Your completed appointments will appear here with rating options")
                }
              </p>
              {activeFilter === 'upcoming' && (
                <GradientSlideButton 
                  onClick={() => window.location.href = `/${locale}/therapists`}
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {ar ? "احجز أول موعد" : "Book Your First Appointment"}
                </GradientSlideButton>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeFilter === 'upcoming' 
                  ? (ar ? "المواعيد القادمة" : "Upcoming Appointments")
                  : (ar ? "المواعيد السابقة" : "Past Appointments")
                }
              </h2>
              <Badge variant="outline" className="text-sm font-medium">
                {currentAppointments.length} {ar ? "موعد" : "appointments"}
              </Badge>
            </div>
            <div className="grid gap-6">
              {currentAppointments.map(appointment => 
                renderAppointmentCard(appointment, activeFilter === 'upcoming')
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}