"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
  LogIn,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Locale = "ar" | "en";
type Step = 0 | 1 | 2;

const BLUE = "#013D5B";

/* ────────────────────────────────────────────────────────────────────────────
  Translations
──────────────────────────────────────────────────────────────────────────── */
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
    describePh: "ما هي الأعراض؟ كيف تؤثر على حياتك؟ مهتم/ة بماذا تحديدًا لدى الأخصائي؟",
    chars: "حرف",
    next: "التالي",
    back: "السابق",
    sessionType: "نوع الجلسة",
    home: "زيارة منزلية (الرياض فقط)",
    clinic: "في العيادة",
    online: "أونلاين",
    payTitle: "الدفع",
    name: "الاسم الكامل",
    cardNo: "رقم البطاقة",
    exp: "MM/YY",
    cvv: "CVV",
    payNow: "ادفع الآن",
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
    mustLoginTitle: "الرجاء تسجيل الدخول",
    mustLoginDesc: "للاستمرار في الحجز يجب تسجيل الدخول أو إنشاء حساب.",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    or: "أو",
    quickLogin: "تسجيل سريع",
    switchToSignup: "إنشاء حساب جديد",
    switchToLogin: "العودة لتسجيل الدخول",
    // Auth form translations
    emailLabel: "البريد الإلكتروني (أو رقم الهوية)",
    emailPlaceholder: "example@email.com",
    passwordLabel: "كلمة المرور",
    nameLabel: "الاسم الكامل",
    namePlaceholder: "أدخل اسمك الكامل",
    confirmPasswordLabel: "تأكيد كلمة المرور",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    orContinue: "أو المتابعة عبر",
    google: "Google",
    microsoft: "Microsoft",
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
    describePh: "Symptoms, how it affects life, what you prefer in a therapist…",
    chars: "chars",
    next: "Next",
    back: "Back",
    sessionType: "Session type",
    home: "Home visit (Riyadh only)",
    clinic: "In clinic",
    online: "Online",
    payTitle: "Payment",
    name: "Full name",
    cardNo: "Card number",
    exp: "MM/YY",
    cvv: "CVV",
    payNow: "Pay now",
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
    mustLoginTitle: "Please log in",
    mustLoginDesc: "You need to log in or create an account to continue booking.",
    login: "Log in",
    signup: "Sign up",
    or: "or",
    quickLogin: "Quick login",
    switchToSignup: "Create new account",
    switchToLogin: "Back to login",
    // Auth form translations
    emailLabel: "Email (or National ID)",
    emailPlaceholder: "example@email.com",
    passwordLabel: "Password",
    nameLabel: "Full name",
    namePlaceholder: "Enter your full name",
    confirmPasswordLabel: "Confirm password",
    signIn: "Sign In",
    signUp: "Sign Up",
    orContinue: "Or continue with",
    google: "Google",
    microsoft: "Microsoft",
  },
} as const;

/* clamp helper keeps Step as 0|1|2 and silences TS complaints */
function clampStep(n: number): Step {
  if (n <= 0) return 0;
  if (n >= 2) return 2;
  return n as Step;
}

export default function BookSession({ locale = "ar" as Locale }) {
  const i18n = t[locale];
  const isRTL = locale === "ar";

  // Move hook calls inside the component
  const pathname = usePathname();
  const sp = useSearchParams();
  const full = `${pathname}${sp.toString() ? `?${sp.toString()}` : ""}`;
  const next = encodeURIComponent(full);

  // ⬇️ AUTH STUB: wire this to real auth later (e.g. NextAuth useSession)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("login");

  // state
  const [step, setStep] = React.useState<Step>(0);
  const [gender, setGender] = React.useState<"male" | "female" | "any">("any");
  const [tags, setTags] = React.useState<string[]>([]);
  const [note, setNote] = React.useState("");
  const [type, setType] = React.useState<"home" | "clinic" | "online">("clinic");

  // persist in URL (so refresh keeps choices)
  const router = useRouter();
  const params = useSearchParams();
  React.useEffect(() => {
    const sp = new URLSearchParams(params.toString());
    sp.set("step", String(step));
    sp.set("gender", gender);
    sp.set("type", type);
    router.replace(`${pathname}?${sp.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, gender, type]);

  const toggleTag = (v: string) =>
    setTags((curr) =>
      curr.includes(v)
        ? curr.filter((c) => c !== v)
        : curr.length < 3
        ? [...curr, v]
        : curr
    );

  const canNext =
    step === 0 ? true : step === 1 ? true : note.trim().length >= 0; // tweak validation if needed

  // ⬇️ only change: wrap "go next" with login gate
  const goNext = () => {
    if (!isAuthenticated && step === 0) {
      setAuthMode("login");
      setShowLoginModal(true);
      return;
    }
    setStep((prev) => clampStep(prev + 1));
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
    // Continue to next step
    setStep((prev) => clampStep(prev + 1));
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real auth logic
    handleAuthSuccess();
  };

  const dir = isRTL ? "rtl" : "ltr";

  return (
    <section dir={dir} className="space-y-6">
      {/* Sticky sub-header (steps) */}
      <div
        className="sticky top-[4.25rem] z-10 rounded-xl border bg-white/70 backdrop-blur-md dark:bg-zinc-900/70"
        style={{ borderColor: "color-mix(in oklab, var(--color-border), transparent 0%)" }}
      >
        <Stepper current={step} labels={i18n.steps} rtl={isRTL} />
      </div>

      {/* Card */}
      <div className="rounded-2xl border bg-background shadow-sm">
        {step === 0 && (
          <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <h1 className="text-2xl font-semibold">{i18n.title}</h1>

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
                {i18n.chips.map((c) => (
                  <Chip key={c} label={c} selected={tags.includes(c)} onClick={() => toggleTag(c)} />
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{i18n.describe}</label>
              <Textarea
                rows={4}
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
                disabled={false /* toggle if Riyadh-only */}
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
              <Button className="mt-2 h-11 text-base" style={{ backgroundColor: BLUE }}>
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

          <div className="flex items-center gap-2">
            {/* ⬇️ Optional inline login entry (opens modal) */}
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setAuthMode("login");
                  setShowLoginModal(true);
                }}
              >
                <LogIn className="size-4" />
                <span>{i18n.login}</span>
              </Button>
            )}

            {step < 2 ? (
              <Button
                onClick={() => canNext && goNext()}
                className="h-10"
                style={{ backgroundColor: BLUE }}
              >
                {i18n.next}
                {isRTL ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ⬇️ Auth modal with custom inline forms */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {authMode === "login" ? i18n.mustLoginTitle : i18n.signup}
            </DialogTitle>
            <DialogDescription>
              {authMode === "login" ? i18n.mustLoginDesc : ""}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-sm font-medium">
                  {i18n.nameLabel}
                </Label>
                <Input
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder={i18n.namePlaceholder}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {i18n.emailLabel}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={i18n.emailPlaceholder}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {i18n.passwordLabel}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>

            {authMode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {i18n.confirmPasswordLabel}
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              style={{ backgroundColor: BLUE }}
            >
              {authMode === "login" ? i18n.signIn : i18n.signUp}
            </Button>
          </form>

          {/* Social login options */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {i18n.orContinue}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button">
                {i18n.google}
              </Button>
              <Button variant="outline" type="button">
                {i18n.microsoft}
              </Button>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-center">
            <Button 
              variant="ghost" 
              onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              className="text-sm"
            >
              {authMode === "login" ? i18n.switchToSignup : i18n.switchToLogin}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
  Small presentational components
──────────────────────────────────────────────────────────────────────────── */

function Stepper({
  current,
  labels,
  rtl,
}: {
  current: number;
  labels: readonly string[]; // keep readonly to avoid TS error
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
            <span className={cn(active ? "font-semibold" : "text-muted-foreground")}>{label}</span>
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