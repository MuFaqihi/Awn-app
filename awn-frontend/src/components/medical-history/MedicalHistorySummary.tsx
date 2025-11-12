"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, User, Shield, Calendar, Printer, Edit, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { useMedicalHistory } from '@/hooks/use-medical-history';
import { toastManager } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface Props {
  locale: Locale;
}

export default function MedicalHistorySummary({ locale }: Props) {
  const { history, isLoading, updateHistory } = useMedicalHistory();
  const router = useRouter();
  const ar = locale === 'ar';
  
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    snapshot: true,
    conditions: true,
    allergies: true,
    medications: true,
    goals: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'managed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        <div className="animate-pulse space-y-4 sm:space-y-6">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64"></div>
          <div className="h-64 sm:h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!history) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 text-center">
        <p className="text-gray-500">{ar ? "لم يتم العثور على التاريخ الطبي" : "No medical history found"}</p>
        <Button 
          onClick={() => router.push(`/${locale}/dashboard/medical-history`)}
          className="mt-4"
        >
          {ar ? "إعداد التاريخ الطبي" : "Setup Medical History"}
        </Button>
      </div>
    );
  }

  const lastUpdated = history.lastUpdated || new Date().toISOString();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-6" dir={ar ? 'rtl' : 'ltr'}>
      {/* Header - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {ar ? "ملخص التاريخ الطبي" : "Medical History Summary"}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 break-words">
            {ar ? "مراجعة شاملة لمعلوماتك الطبية" : "Comprehensive overview of your medical information"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={() => router.push(`/${locale}/dashboard/medical-history`)}
            variant="outline"
            size="sm"
            className="transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <Edit className="h-4 w-4 mr-2" />
            {ar ? "تعديل" : "Edit"}
          </Button>
          
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            className="transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <Printer className="h-4 w-4 mr-2" />
            {ar ? "طباعة" : "Print"}
          </Button>
        </div>
      </div>

      {/* Basic Information Summary */}
      {history.snapshot && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                {ar ? "المعلومات الأساسية" : "Basic Information"}
              </CardTitle>
              <button
                onClick={() => toggleSection('snapshot')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-center"
              >
                {expandedSections.snapshot ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {expandedSections.snapshot ? (ar ? "إخفاء" : "Hide") : (ar ? "إظهار" : "Show")}
              </button>
            </div>
          </CardHeader>
          
          {expandedSections.snapshot && (
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {history.snapshot.personalInfo?.age && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs sm:text-sm font-medium text-gray-600">
                      {ar ? "العمر" : "Age"}
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {history.snapshot.personalInfo.age} {ar ? "سنة" : "years"}
                    </div>
                  </div>
                )}
                
                {history.snapshot.personalInfo?.height && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs sm:text-sm font-medium text-gray-600">
                      {ar ? "الطول" : "Height"}
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {history.snapshot.personalInfo.height} {ar ? "سم" : "cm"}
                    </div>
                  </div>
                )}
                
                {history.snapshot.personalInfo?.weight && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs sm:text-sm font-medium text-gray-600">
                      {ar ? "الوزن" : "Weight"}
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {history.snapshot.personalInfo.weight} {ar ? "كجم" : "kg"}
                    </div>
                  </div>
                )}
                
                {history.snapshot.personalInfo?.bloodType && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs sm:text-sm font-medium text-gray-600">
                      {ar ? "فصيلة الدم" : "Blood Type"}
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {history.snapshot.personalInfo.bloodType}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Emergency Contact */}
              {history.snapshot.emergencyContact && (
                <div className="bg-red-50 border border-red-200 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">
                    {ar ? "جهة الاتصال في حالات الطوارئ" : "Emergency Contact"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-red-700">
                    <div>
                      <span className="font-medium">{ar ? "الاسم:" : "Name:"}</span> {history.snapshot.emergencyContact.name}
                    </div>
                    <div>
                      <span className="font-medium">{ar ? "العلاقة:" : "Relationship:"}</span> {history.snapshot.emergencyContact.relationship}
                    </div>
                    <div>
                      <span className="font-medium">{ar ? "الهاتف:" : "Phone:"}</span> {history.snapshot.emergencyContact.phone}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Medical Conditions */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              {ar ? "الحالات الطبية" : "Medical Conditions"}
              <Badge variant="outline" className="ml-2 text-xs">
                {history.conditions?.length || 0}
              </Badge>
            </CardTitle>
            <button
              onClick={() => toggleSection('conditions')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-center"
            >
              {expandedSections.conditions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {expandedSections.conditions ? (ar ? "إخفاء" : "Hide") : (ar ? "إظهار" : "Show")}
            </button>
          </div>
        </CardHeader>
        
        {expandedSections.conditions && (
          <CardContent>
            {history.conditions && history.conditions.length > 0 ? (
              <div className="space-y-3">
                {history.conditions.map((condition, index) => (
                  <div key={condition.id || index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{condition.name}</h4>
                        {condition.notes && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{condition.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={`text-xs ${getSeverityColor(condition.severity || 'mild')}`}>
                          {ar ? (condition.severity === 'mild' ? 'خفيف' : condition.severity === 'moderate' ? 'متوسط' : 'شديد') 
                             : (condition.severity || 'mild')}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(condition.status || 'active')}`}>
                          {ar ? (condition.status === 'active' ? 'نشط' : condition.status === 'managed' ? 'تحت السيطرة' : 'مُعالج') 
                             : (condition.status || 'active')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                {ar ? "لا توجد حالات طبية مسجلة" : "No medical conditions recorded"}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Allergies */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {ar ? "الحساسية" : "Allergies"}
              <Badge variant="outline" className="ml-2 text-xs">
                {history.allergies?.length || 0}
              </Badge>
            </CardTitle>
            <button
              onClick={() => toggleSection('allergies')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-center"
            >
              {expandedSections.allergies ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {expandedSections.allergies ? (ar ? "إخفاء" : "Hide") : (ar ? "إظهار" : "Show")}
            </button>
          </div>
        </CardHeader>
        
        {expandedSections.allergies && (
          <CardContent>
            {history.allergies && history.allergies.length > 0 ? (
              <div className="space-y-3">
                {history.allergies.map((allergy, index) => (
                  <div key={allergy.id || index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{allergy.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                          <span className="font-medium">{ar ? "التفاعل:" : "Reaction:"}</span> {allergy.reaction}
                        </p>
                        {allergy.notes && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{allergy.notes}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className={`text-xs ${getSeverityColor(allergy.severity)}`}>
                          {ar ? (allergy.severity === 'mild' ? 'خفيف' : allergy.severity === 'moderate' ? 'متوسط' : 'شديد') 
                             : allergy.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                {ar ? "لا توجد حساسية مسجلة" : "No allergies recorded"}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Medications */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              {ar ? "الأدوية" : "Medications"}
              <Badge variant="outline" className="ml-2 text-xs">
                {history.medications?.length || 0}
              </Badge>
            </CardTitle>
            <button
              onClick={() => toggleSection('medications')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-center"
            >
              {expandedSections.medications ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {expandedSections.medications ? (ar ? "إخفاء" : "Hide") : (ar ? "إظهار" : "Show")}
            </button>
          </div>
        </CardHeader>
        
        {expandedSections.medications && (
          <CardContent>
            {history.medications && history.medications.length > 0 ? (
              <div className="space-y-3">
                {history.medications.map((medication, index) => (
                  <div key={medication.id || index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words flex items-center gap-2">
                          {medication.name}
                          {medication.anticoagulant && (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs">
                              {ar ? "مضاد تخثر" : "Anticoagulant"}
                            </Badge>
                          )}
                        </h4>
                        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">{ar ? "الجرعة:" : "Dosage:"}</span> {medication.dose}
                          </p>
                          <p>
                            <span className="font-medium">{ar ? "التكرار:" : "Frequency:"}</span> {medication.frequency}
                          </p>
                          {medication.notes && (
                            <p className="break-words">{medication.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                {ar ? "لا توجد أدوية مسجلة" : "No medications recorded"}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Treatment Goals */}
      {history.goals && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                {ar ? "أهداف العلاج" : "Treatment Goals"}
              </CardTitle>
              <button
                onClick={() => toggleSection('goals')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-center"
              >
                {expandedSections.goals ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {expandedSections.goals ? (ar ? "إخفاء" : "Hide") : (ar ? "إظهار" : "Show")}
              </button>
            </div>
          </CardHeader>
          
          {expandedSections.goals && (
            <CardContent>
              <div className="space-y-3">
                {history.goals.shortTerm && history.goals.shortTerm.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {ar ? "الأهداف قصيرة المدى" : "Short-term Goals"}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {history.goals.shortTerm.map((goal, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <div className="text-sm text-green-800 break-words">{goal}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {history.goals.longTerm && history.goals.longTerm.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {ar ? "الأهداف طويلة المدى" : "Long-term Goals"}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {history.goals.longTerm.map((goal, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <div className="text-sm text-blue-800 break-words">{goal}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {history.goals.functionalGoals && history.goals.functionalGoals.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {ar ? "الأهداف الوظيفية" : "Functional Goals"}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {history.goals.functionalGoals.map((goal, index) => (
                        <div key={index} className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                          <div className="text-sm text-purple-800 break-words">{goal}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Last Updated */}
      <div className="text-center py-4">
        <p className="text-xs sm:text-sm text-gray-500">
          {ar ? "آخر تحديث:" : "Last updated:"} {' '}
          {new Date(lastUpdated).toLocaleDateString(ar ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}