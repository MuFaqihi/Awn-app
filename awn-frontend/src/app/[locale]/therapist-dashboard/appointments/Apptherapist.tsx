"use client";
import * as React from "react";
import type { Locale } from "@/lib/i18n";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  Clock,
  Video,
  Home,
  Filter,
  Users,
  XCircle,
  RotateCcw,
  CheckCircle,
  StickyNote,
} from "lucide-react";

type Props = { locale: Locale };

type TherapistAppointment = {
  id: string;
  patientName: string;
  date: string;
  time: string;
  kind: "online" | "home" | "clinic";
  status: "upcoming" | "completed" | "cancelled" | "no-show" | "pending";
  meetLink?: string;
  cancelReason?: string;
};

export default function TherapistAppointments({ locale }: Props) {
  const ar = locale === "ar";
  const [activeFilter, setActiveFilter] = useState<
    "upcoming" | "past" | "pending"
  >("upcoming");
  const [typeFilter, setTypeFilter] = useState<"all" | "online" | "home">("all");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState<TherapistAppointment | null>(
    null
  );
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [cancelReason, setCancelReason] = useState("");

 const patientData: TherapistAppointment[] = ar
  ? [
      { id: "1", patientName: "نورة السبيعي", date: "2025-11-04", time: "10:30", kind: "home", status: "upcoming" },
      { id: "2", patientName: "ليلى المطيري", date: "2025-11-06", time: "14:00", kind: "online", meetLink: "https://meet.google.com/abc-def-ghi", status: "upcoming" },
      { id: "3", patientName: "ريم الزهراني", date: "2025-11-10", time: "12:00", kind: "online", status: "pending" },
      { id: "4", patientName: "سارة الحربي", date: "2025-10-22", time: "16:00", kind: "home", status: "completed" },
      { id: "5", patientName: "ابتسام الشمري", date: "2025-10-18", time: "15:00", kind: "online", status: "cancelled", cancelReason: ar ? "تم الإلغاء من قبل الطبيب بسبب ظرف طارئ." : "Cancelled by therapist due to an emergency." },
    ]
  : [
      { id: "1", patientName: "Noura Alsubaie", date: "2025-11-04", time: "10:30", kind: "home", status: "upcoming" },
      { id: "2", patientName: "Laila Almutairi", date: "2025-11-06", time: "14:00", kind: "online", meetLink: "https://meet.google.com/abc-def-ghi", status: "upcoming" },
      { id: "3", patientName: "Reem Alzahrani", date: "2025-11-10", time: "12:00", kind: "online", status: "pending" },
      { id: "4", patientName: "Sara Alharbi", date: "2025-10-22", time: "16:00", kind: "home", status: "completed" },
      { id: "5", patientName: "Ibtisam Alshammari", date: "2025-10-18", time: "15:00", kind: "online", status: "cancelled", cancelReason: ar ? "تم الإلغاء من قبل الطبيب بسبب ظرف طارئ." : "Cancelled by therapist due to an emergency." },
    ];


const [appointments, setAppointments] = useState<TherapistAppointment[]>(patientData);

  const handleStartSession = (apt: TherapistAppointment) => {
    if (apt.kind === "online") {
      window.open(apt.meetLink || "https://meet.google.com/new", "_blank");
   }
  };

  const handleApproveConfirm = () => {
    if (!selectedApt) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === selectedApt.id ? { ...a, status: "upcoming" } : a
      )
    );
    setApproveConfirmOpen(false);
  };

  const handleRejectConfirm = () => {
    if (!selectedApt) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === selectedApt.id ? { ...a, status: "cancelled" } : a
      )
    );
    setRejectConfirmOpen(false);
  };

  const handleCancelSave = () => {
    if (!selectedApt) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === selectedApt.id
          ? { ...a, status: "cancelled", cancelReason: cancelReason }
          : a
      )
    );
    setCancelOpen(false);
    setCancelReason("");
  };

  const handleRescheduleSave = () => {
    if (!selectedApt) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === selectedApt.id
          ? { ...a, date: newDate || a.date, time: newTime || a.time }
          : a
      )
    );
    setRescheduleOpen(false);
    setNewDate("");
    setNewTime("");
  };

  const filteredAppointments = appointments.filter((a) => {
    const isPast = ["completed", "cancelled", "no-show"].includes(a.status);
    const statusMatch =
      activeFilter === "pending"
        ? a.status === "pending"
        : activeFilter === "upcoming"
        ? a.status === "upcoming"
        : isPast;
    const typeMatch = typeFilter === "all" || a.kind === typeFilter;
    return statusMatch && typeMatch;
  });

  const getStatusBadge = (status: TherapistAppointment["status"]) => {
    const map = {
      upcoming: { label: ar ? "قادم" : "Upcoming", color: "text-blue-600 bg-blue-50" },
      pending: { label: ar ? "قيد المراجعة" : "Pending", color: "text-amber-600 bg-amber-50" },
      cancelled: { label: ar ? "ملغى" : "Cancelled", color: "text-red-600 bg-red-50" },
      completed: { label: ar ? "مكتمل" : "Completed", color: "text-green-600 bg-green-50" },
      "no-show": { label: ar ? "لم يحضر" : "No-show", color: "text-gray-600 bg-gray-50" },
    } as const;

    const entry = (map as Record<TherapistAppointment["status"], { label: string; color: string } | undefined>)[status] || {
      label: ar ? "حالة غير معروفة" : "Unknown",
      color: "text-gray-600 bg-gray-50",
    };

    return (
      <Badge className={`${entry.color} border`}>
        {entry.label}
      </Badge>
    );
  };

  const getTypeIcon = (kind: string) =>
    kind === "online" ? <Video className="h-4 w-4" /> : <Home className="h-4 w-4" />;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {ar ? "مواعيد المرضى" : "Patient Appointments"}
        </h1>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner w-fit">
          {[
            { key: "pending", label: ar ? "قيد المراجعة" : "Pending", icon: Users },
            { key: "upcoming", label: ar ? "قادمة" : "Upcoming", icon: CalendarDays },
            { key: "past", label: ar ? "سابقة" : "Past", icon: Clock },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeFilter === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(key as any)}
              className={`flex items-center gap-2 rounded-lg px-6 py-2 transition-all duration-200 ${
                activeFilter === key
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>{ar ? "تصفية حسب النوع:" : "Filter by type:"}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: ar ? "الكل" : "All", icon: Users },
              { key: "online", label: ar ? "عن بُعد" : "Online", icon: Video },
              { key: "home", label: ar ? "في المنزل" : "Home", icon: Home },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={typeFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(key as any)}
                className={`transition-all duration-200 hover:scale-105 ${
                  typeFilter === key
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div className="space-y-6">
        {filteredAppointments.map((apt) => (
          <Card key={apt.id} className="p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{apt.patientName}</h3>
                <p className="text-sm text-gray-600 mt-1">{apt.date} • {apt.time}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  {getTypeIcon(apt.kind)}{" "}
                  <span>
                    {apt.kind === "online"
                      ? ar ? "عن بُعد" : "Online"
                      : ar ? "في المنزل" : "Home"}
                  </span>
                </div>
              </div>
              {getStatusBadge(apt.status)}
            </div>

            {/* Pending buttons */}
            {apt.status === "pending" && (
              <div className="mt-4 flex gap-3 flex-wrap">
                <Button
                  onClick={() => { setSelectedApt(apt); setApproveConfirmOpen(true); }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {ar ? "قبول الموعد" : "Approve"}
                </Button>
                <Button
                  onClick={() => { setSelectedApt(apt); setRejectConfirmOpen(true); }}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  {ar ? "رفض الموعد" : "Reject"}
                </Button>
              </div>
            )}

            {/* Upcoming buttons */}
            {apt.status === "upcoming" && (
              <div className="mt-4 flex gap-3 flex-wrap">
                <Button onClick={() => handleStartSession(apt)} className="bg-green-600 hover:bg-green-700 text-white">
                  {ar ? "بدء الجلسة" : "Start Session"}
                </Button>
                <Button onClick={() => { setSelectedApt(apt); setRescheduleOpen(true); }} variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-50">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  {ar ? "إعادة جدولة" : "Reschedule"}
                </Button>
                <Button onClick={() => { setSelectedApt(apt); setCancelOpen(true); }} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-1" />
                  {ar ? "إلغاء الموعد" : "Cancel"}
                </Button>
              </div>
            )}

            {/* Cancelled reason display */}
            {apt.status === "cancelled" && apt.cancelReason && (
              <div className="mt-4 flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <StickyNote className="h-4 w-4 text-gray-500 mt-0.5" />
                <span>
                  <strong>{ar ? "سبب الإلغاء: " : "Cancellation reason: "}</strong>
                  {apt.cancelReason}
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Confirm Approve Dialog */}
      <Dialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>{ar ? "هل أنت متأكد من قبول الموعد؟" : "Are you sure you want to approve this appointment?"}</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setApproveConfirmOpen(false)}>
              {ar ? "تراجع" : "Cancel"}
            </Button>
            <Button onClick={handleApproveConfirm} className="bg-green-600 text-white">
              {ar ? "تأكيد" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Reject Dialog */}
      <Dialog open={rejectConfirmOpen} onOpenChange={setRejectConfirmOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>{ar ? "هل أنت متأكد من رفض الموعد؟" : "Are you sure you want to reject this appointment?"}</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setRejectConfirmOpen(false)}>
              {ar ? "تراجع" : "Cancel"}
            </Button>
            <Button onClick={handleRejectConfirm} className="bg-red-600 text-white">
              {ar ? "تأكيد" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ar ? "سبب إلغاء الموعد" : "Cancellation Reason"}</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <label className="text-sm text-gray-700">
              {ar ? "يرجى كتابة سبب الإلغاء" : "Please enter the cancellation reason"}
            </label>
            <Input
              type="text"
              placeholder={ar ? "مثلاً: المريض لم يؤكد الموعد" : "e.g. Patient did not confirm"}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              {ar ? "تراجع" : "Back"}
            </Button>
            <Button onClick={handleCancelSave} className="bg-red-600 text-white">
              {ar ? "تأكيد الإلغاء" : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ar ? "إعادة جدولة الموعد" : "Reschedule Appointment"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm text-gray-700">
                {ar ? "اختر التاريخ الجديد" : "Select new date"}
              </label>
              <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-700">
                {ar ? "اختر الوقت الجديد" : "Select new time"}
              </label>
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>
              {ar ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleRescheduleSave} className="bg-blue-600 text-white">
              {ar ? "حفظ التعديل" : "Save"}
            </Button>
          </DialogFooter> 
        </DialogContent> 
       </Dialog> 
      </div>
     ); 
    }