"use client";
import * as React from "react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, History, Clock } from "lucide-react";

type Gender = "male" | "female";
type Status = "active" | "completed";

type MedicalNote = {
  date: string;
  progress: string;
  plan: string;
};

type Patient = {
  id: string;
  nameAr: string;
  nameEn: string;
  age: number;
  gender: Gender;
  status: Status;
  history: string;
  sessions: number;
  record: MedicalNote[];
};

const translateGender = (gender: Gender, ar: boolean) => {
  if (ar) return gender === "male" ? "ذكر" : "أنثى";
  return gender.charAt(0).toUpperCase() + gender.slice(1);
};

const translateStatus = (status: Status, ar: boolean) => {
  if (ar) return status === "active" ? "نشط" : "مكتمل";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
      {children}
    </span>
  );
}

export default function PatientsTherapists({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newNote, setNewNote] = useState({ progress: "", plan: "" });

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      nameAr: "نورة السبيعي",
      nameEn: "Noura Alsubaie",
      age: 29,
      gender: "female",
      status: "active",
      sessions: 5,
      history: ar
        ? "آلام مزمنة في الرقبة منذ 3 أشهر بسبب طبيعة العمل المكتبي والجلوس الطويل."
        : "Chronic neck pain for 3 months due to the nature of office work and prolonged sitting.",
      record: [
        {
          date: "2025-10-20",
          progress: ar
            ? "تحسن في الحركة بعد الجلسة الخامسة."
            : "Improved mobility after the 5th session.",
          plan: ar
            ? "الاستمرار بجلسات العلاج مرتين أسبوعيًا."
            : "Continue therapy sessions twice a week.",
        },
      ],
    },
    {
      id: "2",
      nameAr: "محمد العتيبي",
      nameEn: "Mohammed Alotaibi",
      age: 36,
      gender: "male",
      status: "completed",
      sessions: 10,
      history: ar
        ? "إصابة رياضية في الكتف بعد السقوط."
        : "Sports injury to the shoulder after a fall.",
      record: [
        {
          date: "2025-09-15",
          progress: ar ? "تماثل للشفاء بنسبة 95%." : "95% recovery achieved.",
          plan: ar
            ? "متابعة تمارين التقوية المنزلية."
            : "Follow-up with home strengthening exercises.",
        },
      ],
    },
    {
      id: "7",
      nameAr: "فاطمة الدوسري",
      nameEn: "Fatimah Aldosari",
      age: 33,
      gender: "female",
      status: "active",
      sessions: 0,
      history: ar
        ? "بدأت العلاج الطبيعي مؤخراً لمشكلة خشونة في الركبة."
        : "Recently started physiotherapy for knee osteoarthritis.",
      record: [],
    },
    {
      id: "8",
      nameAr: "سالم الماجد",
      nameEn: "Salem Almajed",
      age: 62,
      gender: "male",
      status: "active",
      sessions: 0,
      history: ar
        ? "جلسة تقييم أولية لتأخر في الحركة بعد عملية قلب مفتوح."
        : "Initial assessment session for delayed mobility after open-heart surgery.",
      record: [],
    },
    {
      id: "3",
      nameAr: "سارة القحطاني",
      nameEn: "Sarah Alqahtani",
      age: 40,
      gender: "female",
      status: "active",
      sessions: 3,
      history: ar
        ? "مشاكل في أسفل الظهر بسبب الجلوس الطويل."
        : "Lower back problems due to prolonged sitting.",
      record: [
        {
          date: "2025-10-10",
          progress: ar
            ? "تحسن متوسط بعد الجلسة الثالثة."
            : "Moderate improvement after the third session.",
          plan: ar
            ? "إضافة تمارين تمدد عضلي يومية."
            : "Add daily muscle stretching exercises.",
        },
      ],
    },
    {
      id: "4",
      nameAr: "خالد الزهراني",
      nameEn: "Khaled Alzahrani",
      age: 55,
      gender: "male",
      status: "active",
      sessions: 8,
      history: ar
        ? "تأهيل ما بعد جراحة استبدال مفصل الركبة."
        : "Post-knee replacement surgery rehabilitation.",
      record: [
        {
          date: "2025-11-01",
          progress: ar
            ? "زيادة نطاق الحركة بنسبة 10 درجات إضافية."
            : "Increased range of motion by an additional 10 degrees.",
          plan: ar
            ? "بدء تمارين تحمل الوزن الجزئي."
            : "Begin partial weight-bearing exercises.",
        },
      ],
    },
    {
      id: "5",
      nameAr: "ليلى العمري",
      nameEn: "Layla Alamri",
      age: 22,
      gender: "female",
      status: "active",
      sessions: 2,
      history: ar
        ? "التواء في الكاحل أثناء التدريب الرياضي."
        : "Ankle sprain during sports training.",
      record: [
        {
          date: "2025-11-05",
          progress: ar
            ? "انخفاض التورم بشكل ملحوظ، لا يوجد ألم حاد."
            : "Swelling significantly decreased, no sharp pain.",
          plan: ar
            ? "العلاج بالثلج، بدء حركات خفيفة ومحدودة."
            : "Ice therapy, begin light, restricted movements.",
        },
      ],
    },
    {
      id: "6",
      nameAr: "يوسف الرشيدي",
      nameEn: "Yousef Alrashidi",
      age: 48,
      gender: "male",
      status: "completed",
      sessions: 15,
      history: ar
        ? "علاج طبيعي لمتلازمة النفق الرسغي."
        : "Physical therapy for Carpal Tunnel Syndrome.",
      record: [
        {
          date: "2025-09-01",
          progress: ar
            ? "اختفاء الأعراض تمامًا، استعادة قوة الإمساك."
            : "Symptoms fully resolved, grip strength restored.",
          plan: ar
            ? "إنهاء جلسات العلاج والعودة للأنشطة الطبيعية."
            : "End therapy sessions and return to normal activities.",
        },
      ],
    },
  ]);

  const filteredPatients = patients.filter((p) => {
    const normalizedSearch = search.toLowerCase();
    const displayName = ar ? p.nameAr : p.nameEn;
    const matchSearch =
      displayName.includes(search) ||
      displayName.toLowerCase().includes(normalizedSearch);
    const matchFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? p.status === "active"
        : p.status === "completed";
    return matchSearch && matchFilter;
  });

  const handleAddNote = () => {
    if (!selectedPatient || !newNote.progress.trim()) return;

    const updatedPatients = patients.map((p) =>
      p.id === selectedPatient.id
        ? {
            ...p,
            record: [
              ...p.record,
              {
                date: new Date().toISOString().split("T")[0],
                progress: newNote.progress,
                plan: newNote.plan,
              },
            ],
            sessions: p.sessions + 1,
          }
        : p
    );

    setPatients(updatedPatients);
    setSelectedPatient(null);
    setNewNote({ progress: "", plan: "" });
  };

  const getStatusBadge = (status: Status) => {
    if (status === "active") {
      return (
        <Badge className="bg-sky-100 text-sky-700">
          {translateStatus(status, ar)}
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-700">
        {translateStatus(status, ar)}
      </Badge>
    );
  };

  const handleCardClick = (patient: Patient) => {
    if (patient.status === "active") {
      setSelectedPatient(patient);
      setNewNote({ progress: "", plan: "" });
    }
  };

  return (

<div dir={ar ? "rtl" : "ltr"} className="space-y-8 p-4 md:p-8">
  <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <h1 className="text-3xl font-extrabold text-black pb-1">
      {ar ? "قائمة المرضى" : "Patients List"}
    </h1>
 <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search
              className={`absolute ${
                ar ? "right-3" : "left-3"
              } top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`}
            />
            <Input
              placeholder={ar ? "بحث بالاسم..." : "Search by name..."}
              className={`w-full md:w-64 h-10 ${ar ? "pr-10" : "pl-10"}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm h-10 hover:border-sky-500 transition cursor-pointer"
          >
            <option value="all">{ar ? "جميع الحالات" : "All Cases"}</option>
            <option value="active">{ar ? "حالات نشطة" : "Active Cases"}</option>
            <option value="completed">
              {ar ? "حالات مكتملة" : "Completed Cases"}
            </option>
          </select>
        </div>
      </header>

      <hr className="border-t border-gray-200" />

      {/* شبكة كروت المرضى */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPatients.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full py-12 text-lg bg-gray-50 rounded-lg border border-dashed">
            {ar
              ? "لا يوجد مرضى مطابقين لمعايير البحث أو التصفية."
              : "No patients matching the search or filter criteria."}
          </p>
        ) : (
          filteredPatients.map((p) => {
            const displayName = ar ? p.nameAr : p.nameEn;
            return (
              <Card
                key={p.id}
                className={`p-4 flex flex-col gap-2 shadow-md border-l-4 ${
                  p.status === "active"
                    ? "border-sky-500 hover:shadow-xl cursor-pointer"
                    : "border-green-500 opacity-80 cursor-default"
                } transition-all duration-300`}
                onClick={() => handleCardClick(p)}
              >
                <div className="flex justify-between items-start border-b pb-1">
                  <h3 className="font-bold text-lg text-sky-900 leading-snug">
                    {displayName}
                  </h3>
                  {getStatusBadge(p.status)}
                </div>

                <div className="space-y-0.5 text-xs text-gray-700 pt-1">
                  <p className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-sky-500 flex-shrink-0" />
                    {translateGender(p.gender, ar)} • {p.age}{" "}
                    {ar ? "سنة" : "years"}
                  </p>
                  <p className="flex items-center gap-1">
                    <History className="h-3.5 w-3.5 text-sky-500 flex-shrink-0" />
                    {ar ? "الجلسات المنجزة:" : "Sessions:"}{" "}
                    <strong className="text-sky-700 font-extrabold">
                      {p.sessions}
                    </strong>
                  </p>
                </div>

                <div className="mt-1 pt-2 border-t border-gray-100 text-sm">
                  <p className="font-semibold text-gray-800 text-sm">
                    {ar ? "الشكوى الرئيسية" : "Main Complaint"}
                  </p>
                  <div className="h-10 overflow-hidden text-ellipsis whitespace-nowrap">
                    <p className="text-xs text-gray-500 mt-0.5">{p.history}</p>
                  </div>
                </div>

                {p.record.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                    <p className="font-bold text-xs text-sky-800">
                      {ar ? "آخر ملاحظة:" : "Latest Note:"}
                    </p>
                    <div className="text-[10px] bg-white border border-gray-200 p-2 rounded-md shadow-inner">
                      <p className="text-gray-500 mb-0.5 font-mono">
                        {p.record[p.record.length - 1].date}
                      </p>
                      <p className="font-medium text-gray-700">
                        <strong>{ar ? "التقدم:" : "Progress:"}</strong>{" "}
                        {p.record[p.record.length - 1].progress}
                      </p>
                    </div>
                  </div>
                )}

                {p.record.length === 0 && p.status === "active" && (
                  <p className="mt-3 text-xs p-2 rounded-md bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200">
                    {ar
                      ? "⚠️ أول جلسة. اضغط لإضافة ملاحظة."
                      : "⚠️ First session. Click to add a note."}
                  </p>
                )}

                {p.status === "completed" && (
                  <p className="mt-3 text-xs p-2 rounded-md bg-green-50 text-green-700 font-semibold border border-green-200">
                    {ar
                      ? "  حالة مكتملة. (القراءة فقط)"
                      : "  Completed case. (Read-only)"}
                  </p>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* نافذة الملاحظات */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-lg rounded-lg shadow-2xl">
          {selectedPatient && (
            <>
              <DialogHeader className={ar ? "text-right" : "text-left"}>
                <DialogTitle className="text-2xl font-bold text-sky-800">
                  {ar
                    ? `إضافة ملاحظة لـ ${selectedPatient.nameAr}`
                    : `Add Note for ${selectedPatient.nameEn}`}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {ar
                    ? `التاريخ: ${new Date().toISOString().split("T")[0]}`
                    : `Date: ${new Date().toISOString().split("T")[0]}`}
                </p>
              </DialogHeader>

              <Card className="p-4 bg-sky-50 border-sky-300 shadow-inner rounded-md">
                <h4 className="font-bold text-base mb-2 text-sky-900 border-b border-sky-200 pb-1">
                  {ar ? "ملخص الحالة السريع" : "Quick Case Summary"}
                </h4>
                <p className="text-sm text-gray-700">
                  <strong>
                    {ar ? "الجلسات المنجزة:" : "Sessions Completed:"}
                  </strong>{" "}
                  <span className="text-lg text-sky-700 font-extrabold">
                    {selectedPatient.sessions}
                  </span>
                </p>
                <p className="text-xs text-gray-600 mt-1 italic">
                  <strong>{ar ? "تاريخ الحالة:" : "Case History:"}</strong>{" "}
                  {selectedPatient.history}
                </p>
              </Card>

              <div className="space-y-4 mt-3">
                <div>
                  <Label
                    htmlFor="progress-input"
                    className="font-semibold text-gray-700"
                  >
                    {ar
                      ? "ملاحظة التقدم في الجلسة (مطلوب)"
                      : "Session Progress Note (Required)"}
                  </Label>
                  <Input
                    id="progress-input"
                    value={newNote.progress}
                    onChange={(e) =>
                      setNewNote((p) => ({ ...p, progress: e.target.value }))
                    }
                    placeholder={
                      ar
                        ? "ماذا حدث في الجلسة اليوم؟ تحسن، ثبات، شكاوى جديدة..."
                        : "What happened in today's session? Improvement, stability, new complaints..."
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="plan-input"
                    className="font-semibold text-gray-700"
                  >
                    {ar
                      ? "الخطة العلاجية/التمارين القادمة (اختياري)"
                      : "Treatment Plan/Next Exercises (optional)"}
                  </Label>
                  <Input
                    id="plan-input"
                    value={newNote.plan}
                    onChange={(e) =>
                      setNewNote((p) => ({ ...p, plan: e.target.value }))
                    }
                    placeholder={
                      ar
                        ? "تمارين منزلية، موعد الجلسة القادمة، أي تعليمات إضافية..."
                        : "Home exercises, next session date, additional instructions..."
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  className="bg-sky-600 text-white hover:bg-sky-700 font-bold"
                  onClick={handleAddNote}
                  disabled={!newNote.progress.trim()}
                >
                  {ar ? "حفظ الملاحظة" : "Save Note"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
