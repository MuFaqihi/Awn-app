// src/components/medical-history/VitalsSection.tsx
"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit, Activity, Heart, Thermometer, Scale } from "lucide-react";
import type { Vitals, Locale } from "@/lib/types";

interface VitalsSectionProps {
  vitals: Vitals;
  locale: Locale;
  onUpdate: (vitals: Vitals) => void;
}

export default function VitalsSection({ vitals, locale, onUpdate }: VitalsSectionProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editVitals, setEditVitals] = React.useState(vitals);
  const ar = locale === 'ar';

  // ... rest of your existing VitalsSection code remains the same
  const handleSave = () => {
    onUpdate(editVitals);
    setIsEditing(false);
  };

  const calculateBMICategory = (bmi?: number) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: ar ? "نقص وزن" : "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { label: ar ? "وزن طبيعي" : "Normal", color: "text-green-600" };
    if (bmi < 30) return { label: ar ? "زيادة وزن" : "Overweight", color: "text-yellow-600" };
    return { label: ar ? "سمنة" : "Obese", color: "text-red-600" };
  };

  const analyzeBP = (bp?: string) => {
    if (!bp) return null;
    const [systolic, diastolic] = bp.split('/').map(Number);
    if (systolic >= 140 || diastolic >= 90) {
      return { label: ar ? "مرتفع" : "High", color: "text-red-600", warning: true };
    }
    if (systolic >= 120 || diastolic >= 80) {
      return { label: ar ? "حدود عليا" : "Elevated", color: "text-yellow-600", warning: false };
    }
    return { label: ar ? "طبيعي" : "Normal", color: "text-green-600", warning: false };
  };

  const analyzeHR = (hr?: number) => {
    if (!hr) return null;
    if (hr < 60) return { label: ar ? "بطء" : "Low", color: "text-blue-600" };
    if (hr > 100) return { label: ar ? "سرعة" : "High", color: "text-red-600" };
    return { label: ar ? "طبيعي" : "Normal", color: "text-green-600" };
  };

  const bmiCategory = calculateBMICategory(vitals.bmi);
  const bpAnalysis = analyzeBP(vitals.bp);
  const hrAnalysis = analyzeHR(vitals.hr);

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {ar ? "العلامات الحيوية" : "Vital Signs"}
          </h2>
        </div>
        
        <Popover open={isEditing} onOpenChange={setIsEditing}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  {ar ? "ضغط الدم" : "Blood Pressure"}
                </Label>
                <Input
                  value={editVitals.bp || ""}
                  onChange={(e) => setEditVitals(prev => ({ ...prev, bp: e.target.value }))}
                  placeholder="120/80"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {ar ? "مثال: 120/80" : "Example: 120/80"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {ar ? "معدل ضربات القلب" : "Heart Rate"}
                </Label>
                <Input
                  type="number"
                  value={editVitals.hr || ""}
                  onChange={(e) => setEditVitals(prev => ({ ...prev, hr: parseInt(e.target.value) || undefined }))}
                  placeholder="72"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {ar ? "ضربة/دقيقة" : "beats per minute"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {ar ? "نسبة الأكسجين" : "Oxygen Saturation"}
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editVitals.spo2 || ""}
                  onChange={(e) => setEditVitals(prev => ({ ...prev, spo2: parseInt(e.target.value) || undefined }))}
                  placeholder="98"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {ar ? "%" : "%"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {ar ? "مؤشر كتلة الجسم" : "BMI"}
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={editVitals.bmi || ""}
                  onChange={(e) => setEditVitals(prev => ({ ...prev, bmi: parseFloat(e.target.value) || undefined }))}
                  placeholder="25.0"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {ar ? "كيلوغرام/متر²" : "kg/m²"}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  {ar ? "إلغاء" : "Cancel"}
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
                  {ar ? "حفظ" : "Save"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Vitals Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Blood Pressure */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-gray-600">
              {ar ? "ضغط الدم" : "Blood Pressure"}
            </span>
          </div>
          {vitals.bp ? (
            <div>
              <div className="text-lg font-bold text-gray-900">{vitals.bp}</div>
              {bpAnalysis && (
                <Badge 
                  variant={bpAnalysis.warning ? "destructive" : "outline"} 
                  className={`text-xs ${bpAnalysis.color}`}
                >
                  {bpAnalysis.label}
                </Badge>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-400">{ar ? "غير محدد" : "Not recorded"}</div>
          )}
        </div>

        {/* Heart Rate */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-pink-500" />
            <span className="text-sm font-medium text-gray-600">
              {ar ? "النبض" : "Heart Rate"}
            </span>
          </div>
          {vitals.hr ? (
            <div>
              <div className="text-lg font-bold text-gray-900">{vitals.hr}</div>
              <div className="text-xs text-gray-500">{ar ? "ض/د" : "bpm"}</div>
              {hrAnalysis && (
                <Badge variant="outline" className={`text-xs ${hrAnalysis.color}`}>
                  {hrAnalysis.label}
                </Badge>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-400">{ar ? "غير محدد" : "Not recorded"}</div>
          )}
        </div>

        {/* Oxygen Saturation */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">
              {ar ? "الأكسجين" : "SpO₂"}
            </span>
          </div>
          {vitals.spo2 ? (
            <div>
              <div className="text-lg font-bold text-gray-900">{vitals.spo2}%</div>
              <Badge 
                variant="outline" 
                className={`text-xs ${vitals.spo2 >= 95 ? 'text-green-600' : 'text-red-600'}`}
              >
                {vitals.spo2 >= 95 ? (ar ? "طبيعي" : "Normal") : (ar ? "منخفض" : "Low")}
              </Badge>
            </div>
          ) : (
            <div className="text-sm text-gray-400">{ar ? "غير محدد" : "Not recorded"}</div>
          )}
        </div>

        {/* BMI */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-600">
              {ar ? "مؤشر الكتلة" : "BMI"}
            </span>
          </div>
          {vitals.bmi ? (
            <div>
              <div className="text-lg font-bold text-gray-900">{vitals.bmi}</div>
              {bmiCategory && (
                <Badge variant="outline" className={`text-xs ${bmiCategory.color}`}>
                  {bmiCategory.label}
                </Badge>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-400">{ar ? "غير محدد" : "Not recorded"}</div>
          )}
        </div>
      </div>

      {/* Health Indicators */}
      {(bpAnalysis?.warning || (vitals.bmi && vitals.bmi >= 30) || (vitals.spo2 && vitals.spo2 < 95)) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              {ar ? "تنبيهات صحية" : "Health Alerts"}
            </span>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            {bpAnalysis?.warning && (
              <li>• {ar ? "ضغط الدم مرتفع - يحتاج مراقبة" : "High blood pressure - needs monitoring"}</li>
            )}
            {vitals.bmi && vitals.bmi >= 30 && (
              <li>• {ar ? "مؤشر كتلة الجسم يشير إلى السمنة" : "BMI indicates obesity"}</li>
            )}
            {vitals.spo2 && vitals.spo2 < 95 && (
              <li>• {ar ? "نسبة الأكسجين منخفضة" : "Low oxygen saturation"}</li>
            )}
          </ul>
        </div>
      )}
    </Card>
  );
}