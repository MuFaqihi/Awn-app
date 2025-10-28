"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginPage from "@/components/login";
import SignUpPage from "@/components/sign-up";


import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  CircleDot,
  MapPin,
  ShieldCheck,
  CalendarDays,
  CreditCard,
  UserRound,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

type Locale = "ar" | "en";
type Step = 0 | 1 | 2;

const BLUE = "#013D5B";

/* i18n */
const t = {
  ar: {
    title: "حجز جلسة فورية",
    steps: ["خصائص الجلسة", "نوع الجلسة", "الدفع"],
    therapistGender: "جنس الأخصائي",
    male: "ذكر",
    female: "أنثى",
    any: "الكل",
    howFeel: "بماذا تشعر؟",
    howFeelHint: "يمكنك اختيار ٣ خيارات على الأكثر",
    describe: "صف حالتك بشكل مختصر",
    describePh:
      "ما هي الأعراض؟ كيف تؤثر على حياتك؟ مهتم/ة بماذا تحديدًا لدى الأخصائي؟",
    chars: "حرف",
    next: "التالي",
    back: "السابق",
    sessionType: "نوع الجلسة",
    home: "زيارة منزلية (الرياض فقط)",
    clinic: "في العيادة",
    online: "أونلاين",
    preferredDate: "التاريخ المفضّل",
    pickDate: "اختر تاريخًا",
    payTitle: "الدفع",
    name: "الاسم الكامل",
    cardNo: "رقم البطاقة",
    exp: "MM/YY",
    cvv: "CVV",
    agree: "أوافق على الشروط والأحكام",
    payNow: "ادفع الآن",
    mustLoginTitle: "تسجيل الدخول مطلوب",
    mustLoginText:
      "لا يمكن المتابعة بدون تسجيل الدخول. من فضلك سجّل الدخول أو أنشئ حسابًا جديدًا.",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    continueGuest: "متابعة كضيف (تعطيل)",
    // ADD THIS:
    chips: [
      "آلام الظهر",
      "إصابات رياضية",
      "إعادة تأهيل ما بعد الجراحة",
      "آلام الرقبة والكتف",
      "آلام الركبة",
      "الدوار/مشاكل الاتزان",
      "العلاج الوظيفي",
      "تأهيل ما بعد الولادة",
      "مشاكل الأطفال الحركية",
    ],
  },
  en: {
    title: "Instant booking",
    steps: ["Session details", "Session type", "Payment"],
    therapistGender: "Therapist gender",
    male: "Male",
    female: "Female",
    any: "Any",
    howFeel: "What do you feel?",
    howFeelHint: "You can select up to 3",
    describe: "Describe your case briefly",
    describePh:
      "Symptoms, how it affects life, and what you prefer in a therapist…",
    chars: "chars",
    next: "Next",
    back: "Back",
    sessionType: "Session type",
    home: "Home visit (Riyadh only)",
    clinic: "In clinic",
    online: "Online",
    preferredDate: "Preferred date",
    pickDate: "Pick a date",
    payTitle: "Payment",
    name: "Full name",
    cardNo: "Card number",
    exp: "MM/YY",
    cvv: "CVV",
    agree: "I agree to the Terms & Conditions",
    payNow: "Pay now",
    mustLoginTitle: "Login required",
    mustLoginText:
      "You need to be logged in to continue. Please sign in or create a new account.",
    login: "Log in",
    signup: "Create account",
    continueGuest: "Continue as guest (disabled)",
    // ADD THIS:
    chips: [
      "Low back pain",
      "Sports injury",
      "Post-surgery rehab",
      "Neck/shoulder pain",
      "Knee pain",
      "Dizziness/balance",
      "Occupational therapy",
      "Postpartum rehab",
      "Pediatric motor issues",
    ],
  },
} as const;

/* helpers */
function clampStep(n: number): Step {
  if (n <= 0) return 0;
  if (n >= 2) return 2;
  return n as Step;
}

export default function BookSession({ locale = "ar" as Locale }) {
  const i18n = t[locale];
  const isRTL = locale === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  // --- fake auth (replace with real auth later)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  // keep “isLoggedIn” in query for demo (so refresh preserves)
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // --- form state
  const [step, setStep] = React.useState<Step>(0);
  const [gender, setGender] = React.useState<"male" | "female" | "any">("any");
  const [tags, setTags] = React.useState<string[]>([]);
  const [note, setNote] = React.useState("");
  const [type, setType] = React.useState<"home" | "clinic" | "online">("clinic");
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [agree, setAgree] = React.useState(false);
const [authOpen, setAuthOpen] = React.useState(false);
const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login');
const [logged, setLogged] = React.useState(false); 

  // --- login gate modal
  const [showLoginGate, setShowLoginGate] = React.useState(false);

  // persist in URL (so refresh keeps choices)
  React.useEffect(() => {
    const sp = new URLSearchParams(params.toString());
    sp.set("step", String(step));
    sp.set("gender", gender);
    sp.set("type", type);
    sp.set("logged", isLoggedIn ? "1" : "0");
    router.replace(`${pathname}?${sp.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, gender, type, isLoggedIn]);

  // restore login demo flag on first render (optional)
  React.useEffect(() => {
    if (params.get("logged") === "1") setIsLoggedIn(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTag = (v: string) =>
    setTags((curr) =>
      curr.includes(v)
        ? curr.filter((c) => c !== v)
        : curr.length < 3
        ? [...curr, v]
        : curr
    );

  const canNext =
    step === 0
      ? true
      : step === 1
      ? true
      : note.trim().length >= 0; // keep your current logic

  // next handler – blocks moving to step 2 if not logged in
  const handleNext = () => {
    if (step === 0 && !isLoggedIn) {
      setShowLoginGate(true);
      return;
    }
    if (canNext) setStep((prev) => clampStep(prev + 1));
  };

  return (
    <section dir={dir} className="space-y-6">
      {/* top strip: Stepper + demo login toggle (replace with your real header auth later) */}
      <div className="sticky top-[4.25rem] z-10 rounded-xl border bg-white/70 backdrop-blur-md dark:bg-zinc-900/70">
        <div className="flex items-center justify-between gap-3 px-2 sm:px-4">
          <Stepper current={step} labels={i18n.steps} rtl={isRTL} />
          {/* demo auth buttons */}
          {!isLoggedIn ? (
            <div className="hidden sm:flex gap-2 py-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/login`}>{i18n.login}</Link>
              </Button>
              <Button asChild size="sm" className="bg-[#013D5B] hover:bg-[#013D5B]/90">
                <Link href={`/${locale}/signup`}>{i18n.signup}</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 py-2">
              <span className="text-xs text-muted-foreground">Demo: logged in</span>
              <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border bg-background shadow-sm">
        {step === 0 && (
          <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">{i18n.title}</h1>
              {/* Mobile quick auth buttons */}
              {!isLoggedIn && (
                <div className="flex sm:hidden gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/${locale}/login`}>{i18n.login}</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-[#013D5B] hover:bg-[#013D5B]/90">
                    <Link href={`/${locale}/signup`}>{i18n.signup}</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <label className="text-sm font-medium">{i18n.therapistGender}</label>
              <div className="flex flex-wrap gap-2">
                <TogglePill selected={gender === "any"} onClick={() => setGender("any")}>
                  {i18n.any}
                </TogglePill>
                <TogglePill
                  selected={gender === "male"}
                  onClick={() => setGender("male")}
                  icon={<UserRound className="size-4" />}
                >
                  {i18n.male}
                </TogglePill>
                <TogglePill
                  selected={gender === "female"}
                  onClick={() => setGender("female")}
                  icon={<UserRound className="size-4" />}
                >
                  {i18n.female}
                </TogglePill>
              </div>
            </div>

            {/* Chips */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{i18n.howFeel}</span>
                <span className="text-xs text-muted-foreground">{i18n.howFeelHint}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {t[locale].chips.map((c) => (
                  <Chip key={c} label={c} selected={tags.includes(c)} onClick={() => toggleTag(c)} />
                ))}
              </div>
            </div>

            {/* Preferred date (new: Popover + Calendar) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{i18n.preferredDate}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-fit">
                    <CalendarDays className="size-4" />
                    <span className="ms-2">
                      {date
                        ? date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")
                        : i18n.pickDate}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{i18n.describe}</label>
              <Textarea
                rows={4}
                maxLength={300}
                placeholder={i18n.describePh}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                {note.length} / 300 {i18n.chars}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-semibold">{i18n.sessionType}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <SelectCard
                icon={<MapPin className="size-5" />}
                label={i18n.home}
                selected={type === "home"}
                onClick={() => setType("home")}
              />
              <SelectCard
                icon={<ShieldCheck className="size-5" />}
                label={i18n.clinic}
                selected={type === "clinic"}
                onClick={() => setType("clinic")}
              />
              <SelectCard
                icon={<CalendarDays className="size-5" />}
                label={i18n.online}
                selected={type === "online"}
                onClick={() => setType("online")}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-semibold">{i18n.payTitle}</h2>
            <div className="grid gap-4 sm:max-w-md">
              <Input placeholder={i18n.name} />
              <Input placeholder={i18n.cardNo} inputMode="numeric" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder={i18n.exp} inputMode="numeric" />
                <Input placeholder={i18n.cvv} inputMode="numeric" />
              </div>

              {/* Terms checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(!!v)} />
                <label htmlFor="agree" className="text-sm select-none cursor-pointer">
                  {i18n.agree}
                </label>
              </div>

              <Button
                className="mt-2 h-11 text-base disabled:opacity-60"
                style={{ backgroundColor: BLUE }}
                disabled={!agree}
              >
                <CreditCard className="size-4" />
                <span>{i18n.payNow}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t px-4 py-3 sm:px-6">
          <Button
            variant="ghost"
            onClick={() => setStep((prev) => clampStep(prev - 1))}
            disabled={step === 0}
          >
            {isRTL ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            {i18n.back}
          </Button>

          <div className="flex gap-2">
            {step < 2 ? (
              <Button onClick={handleNext} className="h-10" style={{ backgroundColor: BLUE }}>
                {i18n.next}
                {isRTL ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Login gate modal */}
      <AlertDialog open={showLoginGate} onOpenChange={setShowLoginGate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{i18n.mustLoginTitle}</AlertDialogTitle>
            <AlertDialogDescription>{i18n.mustLoginText}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse gap-2" : ""}>
            <AlertDialogCancel asChild>
              <Button variant="outline">{/* closes modal */}OK</Button>
            </AlertDialogCancel>
            <Button asChild variant="outline">
              <Link href={`/${locale}/login`}>{i18n.login}</Link>
            </Button>
            <Button asChild className="bg-[#013D5B] hover:bg-[#013D5B]/90">
              <Link href={`/${locale}/signup`}>{i18n.signup}</Link>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
  Small presentational components (kept from your version)
──────────────────────────────────────────────────────────────────────────── */

function Stepper({
  current,
  labels,
  rtl,
}: {
  current: number;
  labels: readonly string[];
  rtl?: boolean;
}) {
  return (
    <ol className={cn("grid grid-cols-3 gap-2 p-2 text-sm", rtl ? "direction-rtl" : "")}>
      {labels.map((label, idx) => {
        const active = idx === current;
        const done = idx < current;
        return (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2",
              active && "border-transparent",
              done && "border-transparent"
            )}
            style={
              active
                ? { backgroundColor: "color-mix(in oklab, #013D5B 12%, transparent)" }
                : done
                ? { backgroundColor: "color-mix(in oklab, #013D5B 7%, transparent)" }
                : {}
            }
          >
            {done ? (
              <CheckCircle2 className="size-4" style={{ color: BLUE }} />
            ) : active ? (
              <CircleDot className="size-4" style={{ color: BLUE }} />
            ) : (
              <span className="inline-block size-2 rounded-full border" />
            )}
            <span className={cn(active ? "font-semibold" : "text-muted-foreground")}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function TogglePill({
  children,
  selected,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
        "hover:-translate-y-0.5 hover:shadow-sm",
        selected ? "text-white" : "bg-white/70 dark:bg-zinc-900/60"
      )}
      style={{
        backgroundColor: selected ? BLUE : undefined,
        borderColor: selected ? BLUE : undefined,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition",
        "hover:-translate-y-0.5 hover:shadow-sm",
        selected ? "text-white" : "bg-white/70 dark:bg-zinc-900/60"
      )}
      style={{
        backgroundColor: selected ? BLUE : undefined,
        borderColor: selected ? BLUE : undefined,
      }}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

function SelectCard({
  icon,
  label,
  selected,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-4 text-start transition",
        "hover:-translate-y-0.5 hover:shadow-md",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{
        outline: selected ? `2px solid ${BLUE}` : undefined,
        backgroundColor: selected ? "color-mix(in oklab, #013D5B 6%, transparent)" : undefined,
        borderColor: selected ? BLUE : undefined,
      }}
    >
      <div
        className="grid place-items-center rounded-lg border p-2"
        style={{
          borderColor: selected ? BLUE : undefined,
          backgroundColor: selected ? "#013D5B0F" : undefined,
        }}
      >
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </button>
  );
}