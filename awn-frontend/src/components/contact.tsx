// src/components/contact-section.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type Locale = "ar" | "en";

const BRAND = "#013D5B";

export default function ContactSection({ locale = "ar" }: { locale?: Locale }) {
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  // controlled selects (so we can re-open without jumping around)
  const [role, setRole] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [topic, setTopic] = React.useState<string>("");

  // simple submit shim
  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: wire to backend
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 900);
  }

  return (
    <section dir={dir} className="pb-24">
      {/* Page hero */}
      <div className="relative bg-gradient-to-b from-transparent to-zinc-50 dark:to-transparent">
        <div className="mx-auto max-w-6xl px-6 pt-14 sm:pt-16 md:pt-20">
          <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
            {isAr ? "تواصل معنا" : "Contact Us"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {isAr
              ? "سنساعدك في اختيار الخطة المناسبة والإجابة عن استفساراتك حول عون."
              : "We’ll help you choose the right plan and answer any questions about Awn."}
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="mx-auto mt-10 max-w-6xl px-6 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
        {/* Left: Form (larger, breathable) */}
        <Card className="p-6 sm:p-8 md:p-10 shadow-md">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  {isAr ? "الاسم الأول" : "First name"}
                </Label>
                <Input id="name" name="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last" className="text-sm">
                  {isAr ? "اسم العائلة" : "Last name"}
                </Label>
                <Input id="last" name="lastName" required />
              </div>
            </div>

            {/* Email / Phone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  {isAr ? "البريد الإلكتروني" : "Email"}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">
                  {isAr ? "رقم الجوال (اختياري)" : "Phone (optional)"}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  inputMode="tel"
                  placeholder={isAr ? "05xxxxxxxx" : "+966 5x xxx xxxx"}
                />
              </div>
            </div>

            {/* 3 selects in two rows; Select uses popper so it won't cover inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Role */}
              <div className="space-y-2">
                <Label className="text-sm">
                  {isAr ? "أنت" : "You are a"}
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isAr ? "اختر دورك" : "Select your role"}
                    />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={6}
                    className="z-[60] w-[var(--radix-select-trigger-width)]"
                  >
                    <SelectItem value="patient">
                      {isAr ? "مريض/مستفيد" : "Patient / Client"}
                    </SelectItem>
                    <SelectItem value="therapist">
                      {isAr ? "أخصائي علاج طبيعي" : "Physiotherapist"}
                    </SelectItem>
                    <SelectItem value="clinic">
                      {isAr ? "منشأة صحية" : "Clinic / Medical center"}
                    </SelectItem>
                    <SelectItem value="other">
                      {isAr ? "أخرى" : "Other"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label className="text-sm">
                  {isAr ? "المدينة/المنطقة" : "City / Region"}
                </Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isAr ? "اختر المدينة" : "Select city"}
                    />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={6}
                    className="z-[60] w-[var(--radix-select-trigger-width)]"
                  >
                    <SelectItem value="riyadh">
                      {isAr ? "الرياض" : "Riyadh"}
                    </SelectItem>
                    <SelectItem value="jeddah">
                      {isAr ? "جدة" : "Jeddah"}
                    </SelectItem>
                    <SelectItem value="dammam">
                      {isAr ? "الدمام" : "Dammam"}
                    </SelectItem>
                    <SelectItem value="khobar">
                      {isAr ? "الخبر" : "Khobar"}
                    </SelectItem>
                    <SelectItem value="makkah">
                      {isAr ? "مكة" : "Makkah"}
                    </SelectItem>
                    <SelectItem value="madinah">
                      {isAr ? "المدينة المنورة" : "Madinah"}
                    </SelectItem>
                    <SelectItem value="qassim">
                      {isAr ? "القصيم" : "Qassim"}
                    </SelectItem>
                    <SelectItem value="abha">
                      {isAr ? "أبها" : "Abha"}
                    </SelectItem>
                    <SelectItem value="tabuk">
                      {isAr ? "تبوك" : "Tabuk"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Topic (full width on next row) */}
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-sm">
                  {isAr ? "نوع الاستفسار" : "Inquiry type"}
                </Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isAr ? "اختر نوع الاستفسار" : "Select a topic"}
                    />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={6}
                    className="z-[60] w-[var(--radix-select-trigger-width)]"
                  >
                    <SelectItem value="booking">
                      {isAr ? "مشكلة في الحجز" : "Booking issue"}
                    </SelectItem>
                    <SelectItem value="verification">
                      {isAr ? "توثيق الأخصائيين" : "Therapist verification"}
                    </SelectItem>
                    <SelectItem value="partnership">
                      {isAr ? "شراكات/منشآت صحية" : "Partnerships / Clinics"}
                    </SelectItem>
                    <SelectItem value="pricing">
                      {isAr ? "الأسعار والباقات" : "Pricing & plans"}
                    </SelectItem>
                    <SelectItem value="other">
                      {isAr ? "أخرى" : "Other"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Message – bigger */}
            <div className="space-y-2">
              <Label htmlFor="msg" className="text-sm">
                {isAr ? "الرسالة" : "Message"}
              </Label>
              <Textarea
                id="msg"
                name="message"
                rows={8}
                className="min-h-40"
                placeholder={
                  isAr
                    ? "اكتب تفاصيل الاستفسار أو المشكلة باختصار..."
                    : "Briefly describe your question or issue…"
                }
              />
            </div>

            {/* Submit */}
            <div className={cn("flex justify-end")}>
              <Button
                type="submit"
                disabled={submitting}
                className="h-11 px-6 text-base font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                style={{ backgroundColor: BRAND }}
              >
                {submitting
                  ? isAr
                    ? "جارٍ الإرسال…"
                    : "Sending…"
                  : isAr
                  ? "إرسال"
                  : "Submit"}
              </Button>
            </div>

            {sent && (
              <p className="text-sm text-green-600">
                {isAr
                  ? "تم استلام رسالتك وسنعاود التواصل معك قريبًا."
                  : "Your message has been sent. We’ll get back to you soon."}
              </p>
            )}
          </form>
        </Card>

        {/* Right: Helpful info / contact details */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold">
              {isAr ? "معلومات التواصل" : "Contact details"}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="text-muted-foreground">
                  {isAr ? "البريد:" : "Email:"}
                </span>{" "}
                support@awn.sa
              </li>
              <li>
                <span className="text-muted-foreground">
                  {isAr ? "الهاتف:" : "Phone:"}
                </span>{" "}
                +966 55 000 0000
              </li>
              <li>
                <span className="text-muted-foreground">
                  {isAr ? "أوقات العمل:" : "Hours:"}
                </span>{" "}
                {isAr ? "الأحد - الخميس، 9ص–6م" : "Sun–Thu, 9am–6pm"}
              </li>
            </ul>

            <hr className="my-6 border-dashed" />

            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                {isAr
                  ? "إذا كان استفسارك عاجلًا، يُفضّل التواصل عبر الهاتف."
                  : "For urgent inquiries, please call us directly."}
              </p>
              <Button variant="outline" className="w-full">
                {isAr ? "الدعم عبر واتساب" : "WhatsApp Support"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <h3 className="text-base font-semibold">
              {isAr ? "الأسئلة الشائعة" : "Quick help"}
            </h3>
            <ul className="mt-3 list-disc ps-5 text-sm text-muted-foreground space-y-1.5">
              <li>{isAr ? "مشاكل الدفع والحجز" : "Payment & booking issues"}</li>
              <li>{isAr ? "توثيق الأخصائيين" : "Therapist verification"}</li>
              <li>{isAr ? "الأسعار والباقات" : "Pricing & plans"}</li>
            </ul>
            <Button asChild className="mt-4 w-full" style={{ backgroundColor: BRAND }}>
              <a href={`/${locale}/faq`}>{isAr ? "استكشف المساعدة" : "Explore help"}</a>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}