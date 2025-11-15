"use client";
import * as React from "react";
import type { Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Edit,
  Trash2,
  User,
  X,
  MessageCircle,
  CheckCircle,
  PlayCircle,
} from "lucide-react";

type TreatmentPlan = {
  id: string;
  patientName: string;
  title: string;
  steps: string[];
  status: "accepted" | "in-progress" | "completed" | "cancelled" | "pending";
  createdAt: string;
  completedSteps?: number;
  commitment?: "high" | "medium" | "low";
  notes?: string[];
  sessions?: number;
  duration?: number;
};

export default function TherapistPlansClient({ locale }: { locale: Locale }) {
  const ar = locale === "ar";

  const [plans, setPlans] = React.useState<TreatmentPlan[]>([]);
  const [expandedSteps, setExpandedSteps] = React.useState<Record<string, boolean>>({});
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editDialog, setEditDialog] = React.useState(false);
  const [noteDialog, setNoteDialog] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<TreatmentPlan | null>(null);
  const [editingPlan, setEditingPlan] = React.useState<TreatmentPlan | null>(null);
  const [filter, setFilter] = React.useState<"all" | "active" | "completed" | "pending">("all");
  const [newNote, setNewNote] = React.useState("");
  // flag to mark creation started from "Patients without a plan" list
  const [createFromPending, setCreateFromPending] = React.useState(false);

  const patients = [
    // إناث
    "نورة السبيعي",
    "ليلى المطيري",
    "ريم الزهراني",
    "سارة الحربي",
    "ابتسام الشمري",
    "هيفاء العتيبي",
    "مها الحربي",
    "شروق الدوسري",
    "أمل المطيري",
    "رهف القحطاني",
    // ذكور
    "عبدالله الغامدي",
    "سعود الحربي",
    "بندر العتيبي",
    "محمد الزهراني",
    "خالد المطيري",
    "راشد الدوسري",
    "فيصل الشمري",
    "عبدالرحمن السبيعي",
    "ناصر القحطاني",
    "تركي الحربي",
  ];

  const [newPlan, setNewPlan] = React.useState({
    patientName: "",
    title: "",
    steps: [""],
    sessions: 1,
    duration: 30,
  });

  React.useEffect(() => {
    setPlans([
      {
        id: "plan_001",
        patientName: "نورة السبيعي",
        title: ar ? "خطة إعادة تأهيل الركبة" : "Knee Rehab Plan",
        steps: [ar ? "تقييم شامل" : "Full assessment", ar ? "تمارين التوازن" : "Balance exercises"],
        status: "in-progress",
        createdAt: "2025-10-28",
        completedSteps: 1,
        commitment: "high",
        sessions: 5,
        duration: 45,
        notes: [],
      },
      {
        id: "plan_002",
        patientName: "ليلى المطيري",
        title: ar ? "خطة علاج آلام الكتف" : "Shoulder Pain Plan",
        steps: [ar ? "العلاج اليدوي" : "Manual therapy", ar ? "تمارين المرونة" : "Flexibility training"],
        status: "completed",
        createdAt: "2025-10-25",
        completedSteps: 2,
        commitment: "medium",
        sessions: 3,
        duration: 60,
        notes: ["تحسنت المريضة بنسبة 80%"],
      },
    ]);
  }, [ar]);

  const toggleSteps = (id: string) =>
    setExpandedSteps((p) => ({ ...p, [id]: !p[id] }));

  const handleProgressChange = (id: string, change: number) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const cur = p.completedSteps ?? 0;
          let next = cur + change;
          if (next < 0) next = 0;
          if (next > p.steps.length) next = p.steps.length;
          return { ...p, completedSteps: next };
        }
        return p;
      })
    );
  };

  const handleCommitmentChange = (id: string, value: "high" | "medium" | "low") => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, commitment: value } : p)));
  };
  
  const handleAddStep = (target: "new" | "edit") => {
    if (target === "new") setNewPlan((s) => ({ ...s, steps: [...s.steps, ""] }));
    else if (editingPlan)
      setEditingPlan({ ...editingPlan, steps: [...editingPlan.steps, ""] });
  };

  const handleRemoveStep = (i: number, target: "new" | "edit") => {
    if (target === "new") {
      setNewPlan((s) => {
        const updated = [...s.steps];
        updated.splice(i, 1);
        return { ...s, steps: updated };
      });
    } else if (editingPlan) {
      const updated = [...editingPlan.steps];
      updated.splice(i, 1);
      setEditingPlan({ ...editingPlan, steps: updated });
    }
  };

  const openNewPlanForPatient = (name: string) => {
    setNewPlan((s) => ({ ...s, patientName: name }));

    setCreateFromPending(true);
    setDialogOpen(true);
  };

  const handleCreatePlan = () => {
    if (!newPlan.patientName || !newPlan.title || newPlan.steps.some((s) => !s.trim())) {
      alert(ar ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    const newPlanObj: TreatmentPlan = {
      id: `plan_${Date.now()}`,
      patientName: newPlan.patientName,
      title: newPlan.title,
      steps: newPlan.steps,

      status: createFromPending ? "in-progress" : "pending",
      createdAt: new Date().toISOString(),
      completedSteps: 0,
      commitment: "medium",
      sessions: newPlan.sessions,
      duration: newPlan.duration,
      notes: [],
    };
    setPlans((prev) => [...prev, newPlanObj]);
    alert(ar ? "تم إنشاء الخطة بنجاح" : "Plan created successfully");
    setDialogOpen(false);
    setNewPlan({ patientName: "", title: "", steps: [""], sessions: 1, duration: 30 });
    setCreateFromPending(false);
  };

  const handleStartPlan = (id: string) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, status: "in-progress" } : p)));
  };

  const handleMarkDone = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "completed" } : p))
    );
  };

  const handleAddNote = () => {
    if (!selectedPlan || !newNote.trim()) return;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlan.id
          ? { ...p, notes: [...(p.notes ?? []), newNote] }
          : p
      )
    );
    setNewNote("");
    setNoteDialog(false);
  };

  const handleEditSave = () => {
    if (!editingPlan) return;
    if (!editingPlan.patientName || !editingPlan.title || editingPlan.steps.some((s) => !s.trim())) {
      alert(ar ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? editingPlan : p)));
    alert(ar ? "تم حفظ التعديلات بنجاح" : "Changes saved successfully");
    setEditDialog(false);
    setEditingPlan(null);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(ar ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const filteredPlans = plans.filter((plan) => {
    if (filter === "active") return plan.status === "in-progress" || plan.status === "accepted";
    if (filter === "completed") return plan.status === "completed";
    if (filter === "pending") return plan.status === "pending";
    return true;
  });

  const patientsWithoutPlan = patients.filter(
    (name) => !plans.some((pl) => pl.patientName === name)
  );

  const showEmpty =
    filteredPlans.length === 0 && !(filter === "pending" && patientsWithoutPlan.length > 0);

  return (
    <div dir={ar ? "rtl" : "ltr"} className={`mx-auto w-full max-w-7xl px-6 py-8 ${ar ? "text-right" : "text-left"}`}>
      {/* Header */}
{/* Header */}
<div
  className={`mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
>
  {/*   العنوان */}
  <div className={`${ar ? "order-1 text-right" : "order-2 text-left"}`}>
    <h1 className="text-3xl font-bold text-gray-900">
      {ar ? "خطط العلاج" : "Treatment Plans"}
    </h1>
    <p className="text-gray-600 mt-1">
      {ar
        ? "أنشئ خططًا وتابع التقدم والالتزام"
        : "Create, edit, and track patient progress"}
    </p>
  </div>

  {/*   زر إضافة خطة والفلتر */}
  <div
    className={`flex items-center gap-3 ${
      ar ? "order-2 flex-row" : "order-1 flex-row-reverse"
    }`}
  >
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value as any)}
      className="border border-gray-300 rounded-md text-sm p-2"
    >
      <option value="all">{ar ? "كل الخطط" : "All Plans"}</option>
      <option value="active">{ar ? "الخطط النشطة" : "Active Plans"}</option>
      <option value="completed">{ar ? "الخطط المكتملة" : "Completed Plans"}</option>
      <option value="pending">{ar ? "الخطط المعلقة" : "Pending Plans"}</option>
    </select>

    {/* Add Plan Dialog */}
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          onClick={() => setCreateFromPending(false)}
        >
          <PlusCircle className="h-4 w-4" />
          {ar ? "إضافة خطة جديدة" : "Add New Plan"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {ar ? "إنشاء خطة جديدة" : "Create New Plan"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>{ar ? "اسم المريض" : "Patient Name"}</Label>
            <select
              value={newPlan.patientName}
              onChange={(e) =>
                setNewPlan({ ...newPlan, patientName: e.target.value })
              }
              className="border border-gray-300 rounded-md text-sm p-2 w-full"
            >
              <option value="">
                {ar ? "اختر مريضًا" : "Select a patient"}
              </option>
              {patients.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>{ar ? "عنوان الخطة" : "Plan Title"}</Label>
            <Input
              value={newPlan.title}
              onChange={(e) =>
                setNewPlan({ ...newPlan, title: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label>{ar ? "عدد الجلسات" : "Number of Sessions"}</Label>
              <Input
                type="number"
                min={1}
                value={newPlan.sessions}
                onChange={(e) =>
                  setNewPlan({
                    ...newPlan,
                    sessions: parseInt(e.target.value || "1"),
                  })
                }
              />
            </div>
            <div className="flex-1">
              <Label>
                {ar ? "مدة الجلسة (دقائق)" : "Session Duration (min)"}
              </Label>
              <Input
                type="number"
                min={15}
                max={180}
                step={15}
                value={newPlan.duration}
                onChange={(e) =>
                  setNewPlan({
                    ...newPlan,
                    duration: parseInt(e.target.value || "30"),
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label>{ar ? "الخطوات العلاجية" : "Treatment Steps"}</Label>
            {newPlan.steps.map((s, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <Input
                  value={s}
                  onChange={(e) => {
                    const updated = [...newPlan.steps];
                    updated[i] = e.target.value;
                    setNewPlan({ ...newPlan, steps: updated });
                  }}
                  placeholder={ar ? `الخطوة ${i + 1}` : `Step ${i + 1}`}
                />
                {newPlan.steps.length > 1 && (
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveStep(i, "new")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleAddStep("new")}
              className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              + {ar ? "إضافة خطوة" : "Add Step"}
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={handleCreatePlan} className="bg-green-600 text-white">
            {ar ? "إنشاء الخطة" : "Create Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</div>

      {filter === "pending" && patientsWithoutPlan.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">{ar ? "مرضى بدون خطة" : "Patients without a plan"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientsWithoutPlan.map((name) => (
              <Card key={name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{name}</span>
                </div>
                <Button
                  onClick={() => openNewPlanForPatient(name)}
                  className="bg-green-600 text-white"
                >
                  {ar ? "إنشاء خطة" : "Create Plan"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Plans */}
      {showEmpty ? (
        <Card className="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
          <Calendar className="mx-auto h-24 w-24 text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {ar ? "لا توجد خطط مطابقة" : "No matching plans"}
          </h3>
          <p className="text-gray-600">
            {ar ? "جرب تغيير الفلتر أو إضافة خطة جديدة" : "Try changing the filter or add a new plan"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPlans.map((plan) => {
            const progress = Math.round(((plan.completedSteps ?? 0) / plan.steps.length) * 100);
            const expanded = expandedSteps[plan.id];
            const completed = plan.status === "completed";

            return (
              <Card key={plan.id} className={`relative overflow-hidden hover:shadow-lg transition-all ${ar ? "text-right" : "text-left"}`}>
                <div className="pointer-events-none absolute inset-0 z-0">
                  <BorderBeam size={180} duration={10} delay={3} />
                </div>

                <div className="relative z-10 p-6">
                  <div className={`flex items-start justify-between mb-4 ${ar ? "flex-row-reverse" : ""}`}>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <User className="h-4 w-4" /> {plan.patientName}
                      </p>
                    </div>
                    <Badge className={
                      plan.status === "pending" ? "bg-amber-100 text-amber-700"
                      : completed ? "bg-gray-100 text-gray-700"
                      : "bg-green-100 text-green-700"
                    }>
                      {plan.status === "pending"
                        ? (ar ? "معلقة" : "Pending")
                        : completed
                        ? (ar ? "مكتملة" : "Completed")
                        : (ar ? "نشطة" : "Active")}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-500 mb-2">
                    {ar ? "عدد الجلسات:" : "Sessions:"} {plan.sessions} • {ar ? "المدة:" : "Duration:"} {plan.duration} {ar ? "دقيقة" : "min"}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{ar ? "التقدم" : "Progress"}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  {(expanded ? plan.steps : plan.steps.slice(0, 3)).map((step, i) => {
                    const done = (plan.completedSteps ?? 0) > i;
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm mt-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                          {done ? "✓" : i + 1}
                        </div>
                        <span className={done ? "text-green-700" : undefined}>{step}</span>
                      </div>
                    );
                  })}

                  {plan.steps.length > 3 && (
                    <Button variant="ghost" size="sm" onClick={() => toggleSteps(plan.id)} className="mt-3">
                      {expanded ? (ar ? "عرض أقل" : "Show less") : (ar ? "عرض المزيد" : "Show more")}
                      {expanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                    </Button>
                  )}

                  {/* عرض الملاحظات داخل الكارد */}
                  {plan.notes && plan.notes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-sm text-gray-700">{ar ? "ملاحظات:" : "Notes:"}</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {plan.notes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleProgressChange(plan.id, -1)}>-</Button>
                      <div className="text-sm">{plan.completedSteps ?? 0}/{plan.steps.length}</div>
                      <Button variant="outline" size="sm" onClick={() => handleProgressChange(plan.id, 1)}>+</Button>
                    </div>

                    {/* التزام المريض: قائمة خيارات */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{ar ? "التزام المريض" : "Commitment"}</span>
                      <select
                        value={plan.commitment ?? "medium"}
                        onChange={(e) => handleCommitmentChange(plan.id, e.target.value as "low"|"medium"|"high")}
                        className="border border-gray-300 rounded-md text-sm p-2"
                      >
                        <option value="low">{ar ? "منخفض" : "Low"}</option>
                        <option value="medium">{ar ? "متوسط" : "Medium"}</option>
                        <option value="high">{ar ? "مرتفع" : "High"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    {/* زر بدء الخطة إذا كانت معلّقة */}
                    {plan.status === "pending" && (
                      <Button size="sm" onClick={() => handleStartPlan(plan.id)} className="flex items-center gap-2 bg-blue-600 text-white">
                        <PlayCircle className="h-4 w-4" />
                        {ar ? "بدء الخطة العلاجية" : "Start Plan"}
                      </Button>
                    )}

                    <Button size="sm" onClick={() => { setEditingPlan(plan); setEditDialog(true); }} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      {ar ? "تعديل" : "Edit"}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700">
                          <Trash2 className="h-4 w-4" />
                          {ar ? "حذف" : "Delete"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{ar ? "هل تريد حذف الخطة؟" : "Delete plan?"}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex gap-2">
                          <AlertDialogCancel>{ar ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => setPlans((prev) => prev.filter((p) => p.id !== plan.id))}
                          >
                            {ar ? "حذف" : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button size="sm" variant="outline" onClick={() => { setSelectedPlan(plan); setNoteDialog(true); }}>
                      <MessageCircle className="h-4 w-4" />
                      {ar ? "ملاحظة" : "Note"}
                    </Button>

                    {!completed && plan.status !== "pending" && (
                      <Button size="sm" onClick={() => handleMarkDone(plan.id)} className="bg-green-600 text-white">
                        <CheckCircle className="h-4 w-4" />
                        {ar ? "وضع كمكتملة" : "Mark Completed"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={(v) => { if (!v) { setEditDialog(false); setEditingPlan(null); } else setEditDialog(true); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{ar ? "تعديل الخطة" : "Edit Plan"}</DialogTitle>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>{ar ? "اسم المريض" : "Patient Name"}</Label>
                <select
                  value={editingPlan.patientName}
                  onChange={(e) => setEditingPlan({ ...editingPlan, patientName: e.target.value })}
                  className="border border-gray-300 rounded-md text-sm p-2 w-full"
                >
                  <option value="">{ar ? "اختر مريضًا" : "Select a patient"}</option>
                  {patients.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>{ar ? "عنوان الخطة" : "Plan Title"}</Label>
                <Input value={editingPlan.title} onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })} />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>{ar ? "عدد الجلسات" : "Number of Sessions"}</Label>
                  <Input type="number" min={1} value={editingPlan.sessions} onChange={(e) => setEditingPlan({ ...editingPlan, sessions: parseInt(e.target.value || "1") })} />
                </div>
                <div className="flex-1">
                  <Label>{ar ? "مدة الجلسة (دقائق)" : "Session Duration (min)"}</Label>
                  <Input type="number" min={15} step={15} value={editingPlan.duration} onChange={(e) => setEditingPlan({ ...editingPlan, duration: parseInt(e.target.value || "30") })} />
                </div>
              </div>

              <div>
                <Label>{ar ? "الخطوات" : "Steps"}</Label>
                {editingPlan.steps.map((s, i) => (
                  <div key={i} className="flex gap-2 mt-2">
                    <Input value={s} onChange={(e) => {
                      const updated = [...editingPlan.steps];
                      updated[i] = e.target.value;
                      setEditingPlan({ ...editingPlan, steps: updated });
                    }} />
                    {editingPlan.steps.length > 1 && (
                      <Button variant="ghost" onClick={() => handleRemoveStep(i, "edit")} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={() => handleAddStep("edit")} className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                  + {ar ? "إضافة خطوة" : "Add Step"}
                </Button>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => { setEditDialog(false); setEditingPlan(null); }}>
                  {ar ? "إلغاء" : "Cancel"}
                </Button>
                <Button onClick={handleEditSave} className="bg-green-600 text-white">
                  {ar ? "حفظ" : "Save"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={noteDialog} onOpenChange={(v) => { if (!v) setNoteDialog(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{ar ? "إضافة ملاحظة" : "Add Note"}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label>{ar ? "الملاحظة" : "Note"}</Label>
            <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} className="mt-2" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialog(false)}>{ar ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={handleAddNote} className="bg-blue-600 text-white">{ar ? "إضافة" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}