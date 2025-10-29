"use client";
import * as React from "react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Video, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTherapistById } from "@/lib/therapists";
import type { Appointment } from "@/lib/types";

interface RescheduleDialogProps {
  appointment: Appointment;
  locale: Locale;
  trigger: React.ReactNode;
  onReschedule: (newDate: Date, newTime: string, mode: string, note?: string) => Promise<void>;
}

export function RescheduleDialog({ appointment, locale, trigger, onReschedule }: RescheduleDialogProps) {
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [mode, setMode] = useState<string>(appointment.kind);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const therapist = getTherapistById(appointment.therapistId);

  // Mock available time slots
  const availableSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const formatCurrentDate = () => {
    const date = new Date(appointment.date);
    return date.toLocaleDateString(ar ? 'ar-SA' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNewDate = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString(ar ? 'ar-SA' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isWithinCutoff = () => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    const hoursDiff = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  const canReschedule = !isWithinCutoff();

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    try {
      await onReschedule(selectedDate, selectedTime, mode, note);
      setOpen(false);
      // Reset form
      setSelectedDate(undefined);
      setSelectedTime("");
      setNote("");
    } catch (error) {
      console.error("Failed to reschedule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedDate && selectedTime;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {ar ? "إعادة جدولة الموعد" : "Reschedule Appointment"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Appointment Context */}
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-3 mb-2">
              <img 
                src={therapist?.avatar || "/avatar-placeholder.jpg"} 
                className="h-10 w-10 rounded-full object-cover" 
                alt={therapist?.name || "Therapist"} 
              />
              <div>
                <div className="font-medium">
                  {ar ? therapist?.nameAr : therapist?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {ar ? therapist?.specialtyAr : therapist?.specialty}
                </div>
              </div>
            </div>
            <div className="text-sm">
              <span className="font-medium">
                {ar ? "الموعد الحالي:" : "Currently:"}
              </span>{" "}
              {formatCurrentDate()} • {appointment.time} • {" "}
              {appointment.kind === "online" ? (
                <Badge variant="secondary" className="text-xs">
                  <Video className="h-3 w-3 mr-1" />
                  {ar ? "أونلاين" : "Online"}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {ar ? "في العيادة" : "In-clinic"}
                </Badge>
              )}
            </div>
          </Card>

          {/* Policy Warning if within cutoff */}
          {!canReschedule && (
            <Card className="p-4 border-amber-200 bg-amber-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-amber-800">
                    {ar ? "تغيير محدود" : "Limited Changes"}
                  </div>
                  <div className="text-amber-700">
                    {ar 
                      ? "التغييرات مسموحة قبل 24 ساعة من بداية الموعد. قد تطبق رسوم إضافية."
                      : "Changes allowed ≥24h before start. Additional fees may apply."
                    }
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step A: Date & Time Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              {ar ? "اختر تاريخ ووقت جديد" : "Pick new date & time"}
            </h3>
            
            {/* Calendar */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => {
                  const today = new Date();
                  const minDate = new Date(today);
                  minDate.setDate(today.getDate() + 1); // Min 1 day lead time
                  return date < minDate || date.getDay() === 5 || date.getDay() === 6; // Disable Fri/Sat
                }}
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">
                  {ar ? "الأوقات المتاحة:" : "Available times:"}
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(slot)}
                      className={cn(
                        "text-xs",
                        selectedTime === slot && "bg-primary text-primary-foreground"
                      )}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step B: Options */}
          {selectedDate && selectedTime && (
            <div className="space-y-4">
              <h3 className="font-semibold">
                {ar ? "خيارات الجلسة" : "Session options"}
              </h3>
              
              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {ar ? "نوع الجلسة:" : "Session type:"}
                </label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        {ar ? "جلسة أونلاين" : "Online session"}
                      </div>
                    </SelectItem>
                    <SelectItem value="clinic">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {ar ? "في العيادة" : "In-clinic"}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Optional Note */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {ar ? "ملاحظة للمعالج (اختيارية):" : "Note to therapist (optional):"}
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={ar ? "مثل: أفضل المواعيد المسائية" : "e.g., Need afternoon please"}
                  className="text-sm"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Confirmation Summary */}
          {isFormValid && (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="font-semibold mb-2">
                {ar ? "ملخص الموعد الجديد:" : "New appointment summary:"}
              </h4>
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{ar ? therapist?.nameAr : therapist?.name}</span>
                  <span>•</span>
                  <span>{formatNewDate()}</span>
                  <span>•</span>
                  <span>{selectedTime}</span>
                  <span>•</span>
                  {mode === "online" ? (
                    <Badge variant="secondary" className="text-xs">
                      <Video className="h-3 w-3 mr-1" />
                      {ar ? "أونلاين" : "Online"}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {ar ? "في العيادة" : "In-clinic"}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          )}

       



          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {ar ? "إلغاء" : "Cancel"}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting || !canReschedule}
              className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {ar ? "جاري التحديث..." : "Updating..."}
                </div>
              ) : (
                ar ? "تأكيد إعادة الجدولة" : "Confirm Reschedule"
              )}
            </Button>
          </div>



        </div>
      </DialogContent>
    </Dialog>
  );
}