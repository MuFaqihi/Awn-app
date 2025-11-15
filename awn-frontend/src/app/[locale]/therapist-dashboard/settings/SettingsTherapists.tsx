"use client";
import * as React from "react";
import type { Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  User,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Phone,
  Mail,
  CalendarDays,
  Trash2,
  PlusCircle,
} from "lucide-react";

export default function TherapistSettings({ locale }: { locale: Locale }) {
  const ar = locale === "ar";

  const [form, setForm] = React.useState({
    fullName: ar ? "منى أحمد" : "Mona Ahmed",
    specialization: ar ? "علاج طبيعي" : "Physical Therapy",
    licenseNumber: "PT-92384",
    phone: "+966 50 123 4567",
    email: "mona@example.com",
  });

  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [smsNotifs, setSmsNotifs] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [workingDays, setWorkingDays] = React.useState<
    { id: number; day: string; start: string; end: string }[]
  >([]);

  const [newDay, setNewDay] = React.useState({
    day: "",
    start: "",
    end: "",
  });

  const daysOfWeek = ar
    ? ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleAddDay = () => {
    if (!newDay.day || !newDay.start || !newDay.end) {
      alert(ar ? "يرجى تعبئة جميع الحقول" : "Please fill all fields");
      return;
    }
    if (workingDays.find((d) => d.day === newDay.day)) {
      alert(ar ? "اليوم مضاف مسبقًا" : "This day is already added");
      return;
    }
    setWorkingDays((prev) => [...prev, { id: Date.now(), ...newDay }]);
    setNewDay({ day: "", start: "", end: "" });
  };

  const handleRemoveDay = (id: number) => {
    setWorkingDays((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSaveSchedule = () => {
    alert(ar ? "تم حفظ جدول العمل بنجاح" : "Schedule saved successfully");
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    alert(ar ? "تم حفظ المعلومات بنجاح" : "Profile saved successfully");
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert(ar ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    alert(ar ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div
      dir={ar ? "rtl" : "ltr"}
      className={`mx-auto w-full max-w-6xl px-6 py-8 ${ar ? "text-right" : "text-left"}`}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {ar ? "إعدادات المعالج" : "Therapist Settings"}
        </h1>
        <p className="text-gray-600 mt-1">
          {ar
            ? "قم بإدارة معلوماتك المهنية وتفضيلات الإشعارات"
            : "Manage your professional information and preferences"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <Card className="relative overflow-hidden hover:shadow-md transition-all">
          <div className="pointer-events-none absolute inset-0 z-0">
            <BorderBeam size={160} duration={10} delay={3} />
          </div>
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900 text-lg">
                {ar ? "المعلومات الشخصية والمهنية" : "Personal & Professional Info"}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label>{ar ? "الاسم الكامل" : "Full Name"}</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{ar ? "التخصص المهني" : "Specialization"}</Label>
                <Input
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{ar ? "رقم الترخيص المهني" : "License Number"}</Label>
                <Input
                  value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{ar ? "رقم الهاتف" : "Phone"}</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{ar ? "البريد الإلكتروني" : "Email"}</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {ar ? "جاري الحفظ..." : "Saving..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {ar ? "حفظ" : "Save"}
                </div>
              )}
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="relative overflow-hidden hover:shadow-md transition-all">
          <div className="pointer-events-none absolute inset-0 z-0">
            <BorderBeam size={180} duration={10} delay={5} />
          </div>
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900 text-lg">
                {ar ? "الإشعارات" : "Notifications"}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-800">
                      {ar ? "إشعارات البريد الإلكتروني" : "Email Notifications"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ar
                        ? "تلقي تنبيهات حول المواعيد الجديدة"
                        : "Get notified about new appointments"}
                    </div>
                  </div>
                </div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-800">
                      {ar ? "إشعارات الرسائل النصية" : "SMS Notifications"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ar
                        ? "تلقي تذكيرات الجلسات عبر الرسائل"
                        : "Receive appointment reminders via SMS"}
                    </div>
                  </div>
                </div>
                <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
              </div>
            </div>
          </div>
        </Card>

        {/* Working Hours */}
        <Card className="relative overflow-hidden hover:shadow-md transition-all col-span-1 lg:col-span-2">
          <div className="pointer-events-none absolute inset-0 z-0">
            <BorderBeam size={180} duration={10} delay={4} />
          </div>
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900 text-lg">
                {ar ? "جدول أوقات العمل" : "Working Hours"}
              </h2>
            </div>

            {/* Add Day Form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>{ar ? "اليوم" : "Day"}</Label>
                  <select
                    value={newDay.day}
                    onChange={(e) => setNewDay({ ...newDay, day: e.target.value })}
                    className="border border-gray-300 rounded-md p-2 w-full bg-white"
                  >
                    <option value="">{ar ? "اختر اليوم" : "Select Day"}</option>
                    {daysOfWeek.map((d, i) => (
                      <option key={i} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>{ar ? "من" : "From"}</Label>
                  <Input
                    type="time"
                    value={newDay.start}
                    onChange={(e) => setNewDay({ ...newDay, start: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{ar ? "إلى" : "To"}</Label>
                  <Input
                    type="time"
                    value={newDay.end}
                    onChange={(e) => setNewDay({ ...newDay, end: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={handleAddDay}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                {ar ? "إضافة يوم" : "Add Day"}
              </Button>
            </div>

            {/* Added Days */}
            <div className="space-y-3">
              {workingDays.map((day) => (
                <div
                  key={day.id}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div>
                    <div className="font-medium text-gray-900">{day.day}</div>
                    <div className="text-sm text-gray-500">
                      {ar ? "من" : "From"} {day.start} {ar ? "إلى" : "to"} {day.end}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveDay(day.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {ar ? "حذف" : "Delete"}
                  </Button>
                </div>
              ))}
            </div>

            {workingDays.length > 0 && (
              <Button
                onClick={handleSaveSchedule}
                className="mt-5 bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {ar ? "حفظ الجدول" : "Save Schedule"}
              </Button>
            )}
          </div>
        </Card>

        {/* Password */}
        <Card className="relative overflow-hidden hover:shadow-md transition-all">
          <div className="pointer-events-none absolute inset-0 z-0">
            <BorderBeam size={180} duration={10} delay={6} />
          </div>
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900 text-lg">
                {ar ? "تغيير كلمة المرور" : "Change Password"}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label>{ar ? "كلمة المرور الحالية" : "Current Password"}</Label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${ar ? "left-3" : "right-3"} inset-y-0 flex items-center`}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <Label>{ar ? "كلمة المرور الجديدة" : "New Password"}</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <Button
                onClick={handleChangePassword}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {ar ? "جاري الحفظ..." : "Updating..."}
                  </div>
                ) : (
                  ar ? "تحديث كلمة المرور" : "Update Password"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
