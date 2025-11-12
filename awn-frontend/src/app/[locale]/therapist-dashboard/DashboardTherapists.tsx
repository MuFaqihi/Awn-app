"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { CalendarDays, Clock, MapPin, Video, RotateCcw, XCircle, CheckCircle, StickyNote, ChevronDown, Edit, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GradientSlideButton } from "@/components/ui/gradient-slide-button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Appointment } from "@/lib/types";

// Types and Component definition...
type Props = { locale: Locale };
// ✨ تم تحديث نوع TherapistAppointment و SessionNote
type TherapistAppointment = Omit<Appointment, "therapistId"> & { patientName: string, patientNameEn: string };
type AppointmentTab = "upcoming" | "past" | "pending";
type SessionNote = { id: string; patientName: string; patientNameEn: string; appointmentDate: string; note: string };

// Helper Component for Tabs
const TabButton = ({ isActive, children, onClick }: { isActive: boolean, children: React.ReactNode, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`pb-2 px-2 text-lg font-medium transition-colors ${
      isActive
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {children}
  </button>
);

export default function TherapistDashboard({ locale }: Props) {
  const ar = locale === "ar";
  const [mounted, setMounted] = useState(false);
  const [appointments, setAppointments] = useState<TherapistAppointment[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<TherapistAppointment[]>([]);
  const [cancelledAppointments, setCancelledAppointments] = useState<TherapistAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<AppointmentTab>("upcoming"); // New state for tabs

  // dialogs / action state
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState<TherapistAppointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  // latest session notes + note dialog
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [notesFilter, setNotesFilter] = useState<"all" | "7d" | "1m" | "3m">("all");
  const [notesFilterOpen, setNotesFilterOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectPatientDialogOpen, setSelectPatientDialogOpen] = useState(false); 
  const [notePatient, setNotePatient] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [openNoteId, setOpenNoteId] = useState<string | null>(null); // New state for open note
  const [isEditingNote, setIsEditingNote] = useState(false); // State for edit mode

  useEffect(() => {
    setMounted(true);
    setAppointments([
      {
        id: "apt_001",
        patientName: "نورة السبيعي",
        patientNameEn: "Noura Alsubaie", // ✨ تمت الإضافة
        date: "2025-11-04",
        time: "10:30",
        kind: "home",
        place: "Riyadh, Saudi Arabia",
        status: "upcoming",
      },
      {
        id: "apt_002",
        patientName: "ليلى المطيري",
        patientNameEn: "Laila Almutairi", // ✨ تمت الإضافة
        date: "2025-11-06",
        time: "14:00",
        kind: "online",
        meetLink: "https://meet.google.com/abc-def-ghi",
        status: "upcoming",
      },
      {
        id: "apt_003",
        patientName: "ريم الزهراني",
        patientNameEn: "Reem Alzahrani", // ✨ تمت الإضافة
        date: "2025-11-10",
        time: "12:00",
        kind: "online",
        status: "pending",
      },
      {
        id: "apt_004",
        patientName: "سارة الحربي",
        patientNameEn: "Sara Alharbi", // ✨ تمت الإضافة
        date: "2025-10-22",
        time: "16:00",
        kind: "home",
        status: "completed",
      },
      {
        id: "apt_005",
        patientName: "ابتسام الشمري",
        patientNameEn: "Ibtisam Alshammari", // ✨ تمت الإضافة
        date: "2025-10-18",
        time: "15:00",
        kind: "online",
        status: "cancelled",
        cancelReason: ar ? "تم الإلغاء من قبل الطبيب بسبب ظرف طارئ." : "Cancelled by therapist due to an emergency.",
      },
      {
        id: "apt_006",
        patientName: "خالد العتيبي",
        patientNameEn: "Khalid Alotaibi", // ✨ تمت الإضافة
        date: "2025-11-15",
        time: "11:00",
        kind: "home",
        status: "upcoming",
      },
    ]);

    setSessionNotes([
      {
        id: "note_1",
        patientName: "ليلى المطيري",
        patientNameEn: "Laila Almutairi", // ✨ تمت الإضافة
        appointmentDate: "2025-10-20",
        note: ar
          ? "المريضة أظهرت تحسنًا ملحوظًا بعد الجلسة الثانية وتم توجيهها للاستمرار بالتمارين المنزلية."
          : "Patient showed improvement after the second session and was advised to continue home exercises.",
      },
      {
        id: "note_2",
        patientName: "نورة السبيعي",
        patientNameEn: "Noura Alsubaie", // ✨ تمت الإضافة
        appointmentDate: "2025-10-15",
        note: ar ? "بدأنا بجلسات العلاج الأولى، استجابة جيدة للعلاج." : "Started initial therapy sessions, patient responding well.",
      },
    ]);
  }, [ar]);

  const therapistName = ar ? "د. منى أحمد" : "Dr. Mona Ahmed";

  // Existing status update logic...
  const handleStatusUpdate = (id: string, status: "completed" | "cancelled") => {
    setAppointments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (!target) return prev;
      const updated = prev.filter((a) => a.id !== id);
      const updatedTarget = { ...target, status };
      if (status === "completed") {
        setCompletedAppointments((p) => (p.some((x) => x.id === id) ? p : [...p, updatedTarget]));
      } else {
        setCancelledAppointments((p) => (p.some((x) => x.id === id) ? p : [...p, updatedTarget]));
      }
      return updated;
    });
  };

  // upcoming actions
  const handleStartSession = (apt: TherapistAppointment) => {
    if (apt.kind === "online") {
      window.open(apt.meetLink || "https://meet.google.com/new", "_blank");
      
    }
  };
  const handleRescheduleSave = () => {
    if (!selectedApt) return;
    setAppointments((prev) => prev.map((a) => (a.id === selectedApt.id ? { ...a, date: newDate || a.date, time: newTime || a.time } : a)));
    setRescheduleOpen(false);
    setNewDate("");
    setNewTime("");
  };
  const handleCancelSave = () => {
    if (!selectedApt) return;
    setAppointments((prev) => prev.map((a) => (a.id === selectedApt.id ? { ...a, status: "cancelled", cancelReason: cancelReason } : a)));
    setCancelOpen(false);
    setCancelReason("");
  };

  // pending approve/reject
  const handleApprove = (id: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "upcoming" } : a)));
    setApproveConfirmOpen(false);
  };
  const handleReject = (id: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)));
    setRejectConfirmOpen(false);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(ar ? "ar-SA" : "en-US", { year: "numeric", month: "short", day: "numeric" });

  const getStatusBadge = (status: string) => {
    const config =
      {
        upcoming: { label: ar ? "قادم" : "Upcoming", className: "bg-blue-100 text-blue-800" },
        completed: { label: ar ? "مكتمل" : "Completed", className: "bg-green-100 text-green-800" },
        cancelled: { label: ar ? "ملغى" : "Cancelled", className: "bg-red-100 text-red-800" },
        pending: { label: ar ? "قيد المراجعة" : "Pending", className: "bg-amber-100 text-amber-800" },
      }[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  if (!mounted)
    return <div className="p-8 animate-pulse text-gray-400 text-center">{ar ? "جارٍ التحميل..." : "Loading..."}</div>;

  // grouped lists
  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const pending = appointments.filter((a) => a.status === "pending");
  const past = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  // notes filter logic
  const now = new Date();
  const notesFiltered = sessionNotes.filter((n) => {
    if (notesFilter === "all") return true;
    const d = new Date(n.appointmentDate);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (notesFilter === "7d") return diffDays <= 7;
    if (notesFilter === "1m") return diffDays <= 31;
    if (notesFilter === "3m") return diffDays <= 93;
    return true;
  });  
  const allPatientNames = Array.from(new Set(appointments.map(a => ar ? a.patientName : a.patientNameEn)));

  const openAddNoteFor = (patientName: string) => {
    setNotePatient(patientName);
    setNoteText("");
    setIsEditingNote(false);
    setNotesDialogOpen(true);
  };

  const openEditNote = (note: SessionNote) => {
    setNotePatient(ar ? note.patientName : note.patientNameEn); 
    setNoteText(note.note);
    setIsEditingNote(true);
    setNotesDialogOpen(true);
  };

  const saveNote = () => {
    if (!notePatient || !noteText.trim()) return;

   if (isEditingNote) {
      // Find the note that was clicked and update it
      setSessionNotes((p) => p.map((n) => (n.id === openNoteId ? { ...n, note: noteText } : n)));
    } else {

      setSessionNotes((p) => [
        ...p,
        { 
          id: `note_${Date.now()}`, 
          patientName: notePatient, 
          patientNameEn: notePatient, 
          appointmentDate: new Date().toISOString().split("T")[0], 
          note: noteText 
        },
      ]);
    }
    
    setNotesDialogOpen(false);
    setNoteText("");
    setNotePatient(null);
    setOpenNoteId(null);
    setIsEditingNote(false);
  };
  
  // Custom setter for notes filter to close dialog
  const handleNotesFilterChange = (filter: "all" | "7d" | "1m" | "3m") => {
      setNotesFilter(filter);
      setNotesFilterOpen(false);
  }

  // Patient selection for new note
  const handlePatientSelection = (patientName: string) => {
      setSelectPatientDialogOpen(false);
      openAddNoteFor(patientName);
  }


  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-8" dir={ar ? "rtl" : "ltr"}>
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          {ar ? `مرحبًا ${therapistName}` : `Welcome ${therapistName}`}
        </h1>
        <GradientSlideButton onClick={() => (window.location.href = `/${locale}/therapist-dashboard/plans`)} className="transition-all hover:scale-105 w-full md:w-auto">
          {ar ? "إضافة خطة علاجية" : "Add Treatment Plan"}
        </GradientSlideButton>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs for Appointments */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <TabButton isActive={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>{ar ? "المواعيد القادمة" : "Upcoming Appointments"}</TabButton>
            <TabButton isActive={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>{ar ? "المواعيد المعلقة" : "Pending Appointments"}</TabButton>
            <TabButton isActive={activeTab === 'past'} onClick={() => setActiveTab('past')}>{ar ? "المواعيد السابقة" : "Past Appointments"}</TabButton>
          </div>

          {/* Upcoming Appointments Content */}
          {activeTab === 'upcoming' && (
            <Card className="p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">{ar ? "المواعيد القادمة" : "Upcoming Appointments"}</h2>
              {upcoming.length === 0 ? (
                <div className="py-8 text-center text-gray-500">{ar ? "لا مواعيد قادمة" : "No upcoming appointments"}</div>
              ) : (
                upcoming.map((apt) => (
                  <Card key={apt.id} className="p-5 mb-4 hover:shadow-md transition">
                    <div className="flex **flex-col sm:flex-row** justify-between items-start **sm:items-center** w-full gap-4 **sm:gap-2**"> {/* ✨ تعديل: للسماح للعناصر بالترتيب العمودي على الهاتف */}
                      <div>
                        {/* ✨ التعديل هنا: عرض الاسم بناءً على اللغة */}
                        <h3 className="text-lg font-semibold">{ar ? apt.patientName : apt.patientNameEn}</h3>
                        <p className="text-sm text-gray-600 mt-1">{formatDate(apt.date)} • {apt.time}</p>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1">{apt.kind === "online" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}{apt.kind === "online" ? (ar ? "عن بُعد" : "Online") : (ar ? "في المنزل" : "Home")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 **flex-col sm:flex-row** w-full sm:w-auto"> {/* ✨ تعديل: عمودي على الهاتف، أفقي على الشاشات الكبيرة */}
                        <Button onClick={() => handleStartSession(apt)} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"> {/* ✨ تعديل: w-full للهاتف */}
                          {ar ? "بدء الجلسة" : "Start Session"}
                        </Button>
                        <Button onClick={() => { setSelectedApt(apt); setRescheduleOpen(true); }} variant="outline" className="text-blue-700 border-blue-200 w-full sm:w-auto"> {/* ✨ تعديل: w-full للهاتف */}
                          <RotateCcw className="h-4 w-4 mr-1" />{ar ? "إعادة جدولة" : "Reschedule"}
                        </Button>
                        <Button onClick={() => { setSelectedApt(apt); setCancelOpen(true); }} variant="outline" className="text-red-600 border-red-200 w-full sm:w-auto"> {/* ✨ تعديل: w-full للهاتف */}
                          <XCircle className="h-4 w-4 mr-1" />{ar ? "إلغاء" : "Cancel"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </Card>
          )}

          {/* Pending Appointments Content */}
          {activeTab === 'pending' && (
            <Card className="p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">{ar ? "المواعيد المعلقة" : "Pending Appointments"}</h2>
              {pending.length === 0 ? (
                <div className="py-8 text-center text-gray-500">{ar ? "لا توجد مواعيد معلقة" : "No pending appointments"}</div>
              ) : (
                pending.map((apt) => (
                  <Card key={apt.id} className="p-4 mb-3">
                    <div className="flex **flex-col sm:flex-row** justify-between items-start **sm:items-center** gap-3 w-full"> {/* ✨ تعديل: عمودي على الهاتف */}
                      <div>

                        <h3 className="font-semibold">{ar ? apt.patientName : apt.patientNameEn}</h3>
                        <p className="text-sm text-gray-600">{formatDate(apt.date)} • {apt.time}</p>
                        <div className="text-sm text-gray-600 mt-1">{apt.kind === "online" ? (ar ? "عن بُعد" : "Online") : (ar ? "في المنزل" : "Home")}</div>
                      </div>
                      <div className="flex gap-2 **flex-col sm:flex-row** w-full sm:w-auto"> 
                        <Button onClick={() => { setSelectedApt(apt); setApproveConfirmOpen(true); }} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                          <CheckCircle className="h-4 w-4 mr-1" />{ar ? "قبول" : "Approve"}
                        </Button>
                        <Button onClick={() => { setSelectedApt(apt); setRejectConfirmOpen(true); }} variant="outline" className="text-red-600 border-red-200 w-full sm:w-auto">
                          <XCircle className="h-4 w-4 mr-1" />{ar ? "رفض" : "Reject"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </Card>
          )}

          {/* Past Appointments Content */}
          {activeTab === 'past' && (
            <Card className="p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">{ar ? "المواعيد السابقة" : "Past Appointments"}</h2>
              {past.length === 0 ? (
                <div className="py-8 text-center text-gray-500">{ar ? "لا توجد مواعيد سابقة" : "No past appointments"}</div>
              ) : (
                past.map((apt) => (
                  <Card key={apt.id} className="p-4 mb-3">
                    <div className="flex justify-between items-start">
                      <div>

                        <h3 className="font-semibold">{ar ? apt.patientName : apt.patientNameEn}</h3>
                        <p className="text-sm text-gray-600">{formatDate(apt.date)} • {apt.time}</p>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1">{apt.kind === "online" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}{apt.kind === "online" ? (ar ? "عن بُعد" : "Online") : (ar ? "في المنزل" : "Home")}</span>
                        </div>
                        {apt.status === "cancelled" && apt.cancelReason && (
                          <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded border">{ar ? "سبب الإلغاء: " : "Cancellation reason: "}{apt.cancelReason}</div>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                  
                      {getStatusBadge(apt.status)}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </Card>
          )}

        </div>

        {/* Latest session notes with filters */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">{ar ? "ملاحظات الجلسات الأخيرة" : "Latest Session Notes"}</h3>
              <div>
                {/* Notes Filter as a Dropdown-like Dialog */}
                <Dialog open={notesFilterOpen} onOpenChange={setNotesFilterOpen}>
                  <DialogTrigger asChild>
                    {/* تأكد من أن Trigger لا يحتوي على زر آخر متداخل */}
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      {notesFilter === "all" ? (ar ? "الكل" : "All")
                        : notesFilter === "7d" ? (ar ? "آخر ٧ أيام" : "Last 7d")
                        : notesFilter === "1m" ? (ar ? "شهـر" : "1m")
                        : (ar ? "٣ أشهر" : "3m")}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xs p-0 translate-y-[-25%]">
                    <div className="py-2 text-sm">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleNotesFilterChange("all")}>{ar ? "الكل" : "All"}</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleNotesFilterChange("7d")}>{ar ? "آخر ٧ أيام" : "Last 7d"}</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleNotesFilterChange("1m")}>{ar ? "شهـر" : "1m"}</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleNotesFilterChange("3m")}>{ar ? "٣ أشهر" : "3m"}</button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="space-y-3">
              {notesFiltered.length === 0 ? (
                <div className="text-sm text-gray-500">{ar ? "لا توجد ملاحظات ضمن هذا النطاق" : "No notes for this range"}</div>
              ) : (
                notesFiltered.map((n) => (
                  <Card 
                    key={n.id} 
                    className="p-3 hover:bg-muted/50 transition flex flex-col justify-between items-start cursor-pointer"
                    onClick={() => setOpenNoteId(openNoteId === n.id ? null : n.id)} // Toggle visibility
                  >
                    <div className="flex justify-between items-center w-full">
    
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-base">{ar ? n.patientName : n.patientNameEn}</span>
                        <span className="text-sm text-gray-500">{formatDate(n.appointmentDate)}</span>
                      
              </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        openNoteId === n.id 
                          ? 'rotate-90' 
                          : (ar ? 'rotate-180' : 'rotate-0')
                      }`} />
                    </div>
                    
                    {openNoteId === n.id && (
                      <div className="w-full mt-2 pt-2 border-t border-gray-100 flex justify-between items-start">
                        <p className="text-sm text-gray-700 mt-1 max-w-[80%]">{n.note}</p>
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-600 hover:text-blue-700 p-1 h-auto flex gap-1"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card toggle
                                setOpenNoteId(n.id); // Set the ID for reference
                                openEditNote(n); // Open dialog with note data
                            }}
                        >
                            <Edit className="h-4 w-4" />
                            {ar ? "تعديل الملاحظة" : "Edit Note"}
                        </Button>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
            
            <div className="mt-4">
              {/* Button to open patient selection dialog for new note - Kept as a fallback or for quick action */}
              <Button onClick={() => setSelectPatientDialogOpen(true)} className="w-full" variant="outline">{ar ? "إضافة ملاحظة لمريض آخر" : "Add note for another patient"}</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Reschedule Dialog (unchanged) */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ar ? "إعادة جدولة الموعد" : "Reschedule Appointment"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm text-gray-700">{ar ? "اختر التاريخ الجديد" : "Select new date"}</label>
              <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-700">{ar ? "اختر الوقت الجديد" : "Select new time"}</label>
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>{ar ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={handleRescheduleSave} className="bg-blue-600 text-white">{ar ? "حفظ" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog (unchanged) */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ar ? "سبب إلغاء الموعد" : "Cancellation Reason"}</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <label className="text-sm text-gray-700">{ar ? "يرجى كتابة سبب الإلغاء" : "Please enter the cancellation reason"}</label>
            <Input type="text" placeholder={ar ? "مثلاً: المريض لم يؤكد الموعد" : "e.g. Patient did not confirm"} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="mt-2" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>{ar ? "تراجع" : "Back"}</Button>
            <Button onClick={handleCancelSave} className="bg-red-600 text-white">{ar ? "تأكيد الإلغاء" : "Confirm Cancellation"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve / Reject confirm dialogs (unchanged) */}
      <Dialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader><DialogTitle>{ar ? "تأكيد القبول؟" : "Confirm approve?"}</DialogTitle></DialogHeader>
          <DialogFooter className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setApproveConfirmOpen(false)}>{ar ? "تراجع" : "Cancel"}</Button>
            <Button onClick={() => selectedApt && handleApprove(selectedApt.id)} className="bg-green-600 text-white">{ar ? "تأكيد" : "Confirm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectConfirmOpen} onOpenChange={setRejectConfirmOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader><DialogTitle>{ar ? "تأكيد الرفض؟" : "Confirm reject?"}</DialogTitle></DialogHeader>
          <DialogFooter className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setRejectConfirmOpen(false)}>{ar ? "تراجع" : "Cancel"}</Button>
            <Button onClick={() => selectedApt && handleReject(selectedApt.id)} className="bg-red-600 text-white">{ar ? "تأكيد" : "Confirm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Patient Dialog for New Note (Updated to use unique names) */}
      <Dialog open={selectPatientDialogOpen} onOpenChange={setSelectPatientDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{ar ? "اختر المريض" : "Select Patient"}</DialogTitle>
          </DialogHeader>
          <div className="py-2 max-h-60 overflow-y-auto space-y-1">
            {allPatientNames.map((name) => (
                <Button key={name} variant="ghost" className="w-full justify-start" onClick={() => handlePatientSelection(name)}>
                  {name}
                </Button>
            ))}
            {allPatientNames.length === 0 && <p className="text-gray-500 text-center">{ar ? "لا يوجد مرضى" : "No patients available"}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectPatientDialogOpen(false)}>{ar ? "إلغاء" : "Cancel"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Add/Edit Dialog (Updated) */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{ar ? (isEditingNote ? "تعديل الملاحظة" : "إضافة ملاحظة") : (isEditingNote ? "Edit Note" : "Add Note")}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="text-sm text-gray-700">{ar ? "المريض" : "Patient"}</label>
            <div className="font-medium mb-2 p-2 border rounded bg-gray-50">{notePatient}</div>
            <label className="text-sm text-gray-700">{ar ? "الملاحظة" : "Note"}</label>
            <Input value={noteText} onChange={(e) => setNoteText(e.target.value)} className="mt-2" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>{ar ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={saveNote} className="bg-blue-600 text-white" disabled={!noteText.trim()}>
              {ar ? (isEditingNote ? "حفظ التعديل" : "إضافة") : (isEditingNote ? "Save Edit" : "Add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}