"use client";
import * as React from "react";
import type { Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Globe, 
  Phone, 
  Mail, 
  Save,
  Eye,
  EyeOff
} from "lucide-react";

export default function SettingsClient({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  
  // Basic user info
  const [firstName, setFirstName] = React.useState(ar ? 'أحمد' : 'Ahmed');
  const [lastName, setLastName] = React.useState(ar ? 'محمد' : 'Mohammed');
  const [email, setEmail] = React.useState('ahmed.mohammed@example.com');
  const [phone, setPhone] = React.useState('+966 50 123 4567');
  
  // Basic preferences
  const [language, setLanguage] = React.useState(locale);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(true);
  
  // Password change
  const [showPassword, setShowPassword] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  
  // Loading state
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLanguageChange = (value: string) => {
    if (value === 'ar' || value === 'en') {
      setLanguage(value);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert(ar ? 'تم حفظ البيانات بنجاح' : 'Profile saved successfully');
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert(ar ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert(ar ? 'تم تغيير كلمة المرور' : 'Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{ar ? "الإعدادات" : "Settings"}</h1>
        <p className="text-gray-600 mt-2">
          {ar ? "أدِر إعدادات حسابك الأساسية" : "Manage your basic account settings"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              {ar ? "المعلومات الشخصية" : "Profile Information"}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{ar ? "الاسم الأول" : "First Name"}</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">{ar ? "اسم العائلة" : "Last Name"}</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">{ar ? "البريد الإلكتروني" : "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">{ar ? "رقم الهاتف" : "Phone Number"}</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
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
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              {ar ? "الإشعارات" : "Notifications"}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-900">{ar ? "إشعارات البريد الإلكتروني" : "Email Notifications"}</div>
                  <div className="text-sm text-gray-500">{ar ? "تلقي إشعارات المواعيد عبر البريد" : "Receive appointment notifications via email"}</div>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-900">{ar ? "الرسائل النصية" : "SMS Notifications"}</div>
                  <div className="text-sm text-gray-500">{ar ? "تلقي تذكيرات المواعيد عبر الرسائل" : "Receive appointment reminders via SMS"}</div>
                </div>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
          </div>
        </Card>

        {/* Language & Preferences */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              {ar ? "اللغة والتفضيلات" : "Language & Preferences"}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="max-w-xs">
              <Label htmlFor="language">{ar ? "اللغة" : "Language"}</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {ar ? "تغيير كلمة المرور" : "Change Password"}
            </h2>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="currentPassword">{ar ? "كلمة المرور الحالية" : "Current Password"}</Label>
              <div className="relative mt-1">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={ar ? "أدخل كلمة المرور الحالية" : "Enter current password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">{ar ? "كلمة المرور الجديدة" : "New Password"}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={ar ? "أدخل كلمة المرور الجديدة" : "Enter new password"}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleChangePassword} 
              disabled={isLoading || !currentPassword || !newPassword}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {ar ? "جاري التحديث..." : "Updating..."}
                </div>
              ) : (
                ar ? "تحديث كلمة المرور" : "Update Password"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}