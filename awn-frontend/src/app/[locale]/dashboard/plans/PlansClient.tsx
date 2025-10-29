"use client";
import * as React from "react";
import type { Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { BorderBeam } from "@/components/ui/border-beam";
import { getTherapistById } from "@/lib/therapists";
import type { TreatmentPlan } from "@/lib/types";
import { Calendar, CheckCircle, Clock, User, FileText, Activity, BarChart3, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function PlansClient({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [expandedSteps, setExpandedSteps] = React.useState<Record<string, boolean>>({});
  
  // Mock data - replace with API call
  const plans: TreatmentPlan[] = [
    {
      id: "plan_aa",
      therapistId: "t_dr_mona",
      title: ar ? "خطة علاج إصابة الكتف" : "Shoulder Injury Treatment Plan",
      steps: [
        ar ? "جلسة تقييم أولية" : "Initial assessment session",
        ar ? "تمارين تقوية العضلات" : "Muscle strengthening exercises", 
        ar ? "العلاج اليدوي" : "Manual therapy",
        ar ? "تمارين المرونة" : "Flexibility exercises",
        ar ? "متابعة أسبوعية" : "Weekly follow-ups"
      ],
      createdAt: "2025-10-20",
      status: "proposed",
    },
    {
      id: "plan_bb",
      therapistId: "t_dr_basel",
      title: ar ? "برنامج تأهيل الركبة" : "Knee Rehabilitation Program",
      steps: [
        ar ? "تقييم شامل للركبة" : "Comprehensive knee assessment",
        ar ? "تخفيف الالتهاب" : "Inflammation reduction", 
        ar ? "استعادة المدى الحركي" : "Range of motion restoration",
        ar ? "تقوية العضلات المحيطة" : "Surrounding muscle strengthening",
        ar ? "تدريبات التوازن" : "Balance training"
      ],
      createdAt: "2025-10-18",
      status: "accepted",
      completedSteps: 2, // Mock progress
    },
    {
      id: "plan_cc",
      therapistId: "t_dr_mona",
      title: ar ? "خطة علاج الظهر" : "Back Pain Treatment Plan",
      steps: [
        ar ? "تقييم أولي للعمود الفقري" : "Initial spine assessment",
        ar ? "تمارين تقوية الجذع" : "Core strengthening exercises",
        ar ? "تقنيات الاسترخاء" : "Relaxation techniques",
        ar ? "تصحيح الوضعية" : "Posture correction"
      ],
      createdAt: "2025-10-25",
      status: "accepted",
      completedSteps: 0, // Just accepted, therapist will contact
    },
  ];

  const handleAcceptPlan = (planId: string) => {
    console.log(`Accepting plan ${planId}`);
    alert(ar ? "تم قبول الخطة بنجاح" : "Plan accepted successfully");
  };

  const handleContactTherapist = (therapistId: string) => {
    console.log(`Contacting therapist ${therapistId}`);
    alert(ar ? "تم فتح المحادثة" : "Chat opened");
  };

  const toggleSteps = (planId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(ar ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: TreatmentPlan['status']) => {
  const statusConfig: Record<TreatmentPlan['status'], { label: string; className: string }> = {
    proposed: {
      label: ar ? "مقترحة" : "Proposed",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200"
    },
    pending: {
      label: ar ? "في الانتظار" : "Pending",
      className: "bg-blue-50 text-blue-700 border-blue-200"
    },
    accepted: {
      label: ar ? "مقبولة" : "Active", 
      className: "bg-green-50 text-green-700 border-green-200"
    },
    declined: {
      label: ar ? "مرفوضة" : "Declined",
      className: "bg-red-50 text-red-700 border-red-200"
    },
    'in-progress': {
      label: ar ? "قيد التنفيذ" : "In Progress",
      className: "bg-purple-50 text-purple-700 border-purple-200"
    },
    completed: {
      label: ar ? "مكتملة" : "Completed",
      className: "bg-gray-50 text-gray-700 border-gray-200"
    },
    cancelled: {
      label: ar ? "ملغية" : "Cancelled",
      className: "bg-red-50 text-red-700 border-red-200"
    }
  };

  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {config.label}
    </Badge>
  );
};


  // Calculate plan statistics
  const activePlans = plans.filter(p => p.status === 'accepted').length;
  const pendingProposals = plans.filter(p => p.status === 'proposed').length;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{ar ? "خطط العلاج" : "Treatment Plans"}</h1>
        <p className="text-gray-600 mt-2">
          {ar ? "راجع وأدِر خطط العلاج المقترحة من معالجيك" : "Review and manage treatment plans proposed by your therapists"}
        </p>
      </div>

      {/* Smaller Plan Summary Overview */}
      {plans.length > 0 && (
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-gray-900">
                  {ar ? "ملخص خطط العلاج" : "Treatment Plans Overview"}
                </h3>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <span className="font-bold text-green-600">{activePlans}</span>
                  <span className="text-gray-600 ml-1">
                    {ar ? "نشطة" : "active"}
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-yellow-600">{pendingProposals}</span>
                  <span className="text-gray-600 ml-1">
                    {ar ? "معلقة" : "pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {plans.length === 0 ? (
        <Card className="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-md mx-auto">
            <Calendar className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {ar ? "لا توجد خطط علاج بعد" : "No treatment plans yet"}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {ar ? "ستظهر خطط العلاج المقترحة من معالجيك هنا" : "Treatment plans proposed by your therapists will appear here"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const therapist = getTherapistById(plan.therapistId);
            const progressPercentage = plan.completedSteps ? Math.round((plan.completedSteps / plan.steps.length) * 100) : 0;
            const isExpanded = expandedSteps[plan.id];
            const showToggle = plan.steps.length > 3 && plan.status !== 'proposed';
            
            return (
              <Card key={plan.id} className="relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                {plan.status === 'proposed' && <BorderBeam size={250} duration={12} delay={3} />}
                
                <div className="p-6">
                  {/* Header with therapist info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={therapist?.avatar || "/avatar-placeholder.jpg"} 
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300" 
                        alt={therapist?.name || "Therapist"} 
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {ar ? therapist?.nameAr : therapist?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ar ? therapist?.specialtyAr : therapist?.specialty}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(plan.status)}
                  </div>

                  {/* Plan title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{plan.title}</h3>

                  {/* Progress for accepted plans - Show percentage out of 100 */}
                  {plan.status === 'accepted' && plan.completedSteps !== undefined && plan.completedSteps > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {ar ? "تقدم العلاج" : "Treatment Progress"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Steps preview */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {ar ? "خطوات العلاج" : "Treatment Steps"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {/* For proposed cards, show ALL steps */}
                      {plan.status === 'proposed' ? (
                        plan.steps.map((step: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium bg-gray-200 text-gray-600">
                              {i + 1}
                            </div>
                            <span className="text-gray-600">{step}</span>
                          </div>
                        ))
                      ) : (
                        /* For accepted cards, show first 3 with expand option */
                        <>
                          {(isExpanded ? plan.steps : plan.steps.slice(0, 3)).map((step: string, i: number) => {
                            const isCompleted = plan.completedSteps && i < plan.completedSteps;
                            return (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                                  isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {isCompleted ? '✓' : i + 1}
                                </div>
                                <span className={isCompleted ? 'text-green-700' : 'text-gray-600'}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                          
                          {/* Toggle button for more steps */}
                          {showToggle && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSteps(plan.id);
                              }}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline ml-7 transition-colors duration-200"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-3 w-3" />
                                  {ar ? "عرض أقل" : "Show less"}
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3" />
                                  +{plan.steps.length - 3} {ar ? "خطوات إضافية" : "more steps"}
                                </>
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status message for accepted plans */}
                  {plan.status === 'accepted' && (
                    <div className={`p-3 rounded-lg border mb-4 ${
                      plan.completedSteps === 0 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className={`flex items-center gap-2 ${
                        plan.completedSteps === 0 ? 'text-blue-700' : 'text-green-700'
                      }`}>
                        {plan.completedSteps === 0 ? (
                          <MessageCircle className="h-4 w-4" />
                        ) : (
                          <Activity className="h-4 w-4" />
                        )}
                        <span className="font-medium text-sm">
                          {plan.completedSteps === 0 
                            ? (ar ? "سيتواصل معك المعالج قريباً" : "Your therapist will contact you soon")
                            : (ar ? "العلاج يسير وفقاً للخطة" : "Treatment progressing as planned")
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action buttons - For proposed cards, move to bottom */}
                  <div className="space-y-3 mt-auto">
                    {plan.status === 'proposed' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleContactTherapist(plan.therapistId)}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 h-9 px-3"
                        >
                          <User className="h-4 w-4 mr-2" />
                          {ar ? "تواصل" : "Contact"}
                        </button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:scale-105 active:scale-95 h-9 px-3"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {ar ? "قبول" : "Accept"}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {ar ? "تأكيد قبول الخطة" : "Confirm Plan Acceptance"}
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="py-4">
                              <p className="text-gray-600 mb-4">
                                {ar 
                                  ? "هل تريد قبول هذه الخطة العلاجية؟ سيتم إشعار المعالج وبدء العلاج."
                                  : "Do you want to accept this treatment plan? The therapist will be notified and treatment will begin."
                                }
                              </p>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="font-medium mb-2">{plan.title}</h4>
                                <div className="text-sm text-gray-600">
                                  {plan.steps.length} {ar ? "خطوة علاجية" : "treatment steps"}
                                </div>
                              </div>
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="transition-all duration-200 hover:scale-105 active:scale-95">
                                {ar ? "إلغاء" : "Cancel"}
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleAcceptPlan(plan.id)}
                                className="transition-all duration-200 hover:scale-105 active:scale-95 bg-green-600 hover:bg-green-700"
                              >
                                {ar ? "تأكيد القبول" : "Confirm Accept"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleContactTherapist(plan.therapistId)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 h-9 px-3 w-full"
                      >
                        <User className="h-4 w-4 mr-2" />
                        {ar ? "تواصل مع المعالج" : "Contact Therapist"}
                      </button>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-4">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(plan.createdAt)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}