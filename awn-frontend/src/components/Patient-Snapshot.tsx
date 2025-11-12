"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BorderBeam } from "@/components/ui/border-beam";
import { Edit, AlertCircle, Calendar } from "lucide-react";

interface SnapshotData {
  primaryConcern: string;
  onsetDate?: string;
  mechanism?: string;
  painScore?: number;
  functionalLimits: string[];
  precautions: string[];
}

interface PatientSnapshotProps {
  snapshot: SnapshotData;
  ar: boolean;
  onUpdate: (updated: SnapshotData) => void;
}

export default function PatientSnapshot({ snapshot, ar, onUpdate }: PatientSnapshotProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState(snapshot);

  const functionalLimitOptions = [
    { value: "walking", label: ar ? "المشي" : "Walking" },
    { value: "stairs", label: ar ? "الدرج" : "Stairs" },
    { value: "lifting", label: ar ? "الرفع" : "Lifting" },
    { value: "sitting", label: ar ? "الجلوس أكثر من 30 دقيقة" : "Sitting >30min" },
    { value: "standing", label: ar ? "الوقوف طويلاً" : "Prolonged standing" },
    { value: "bending", label: ar ? "الانحناء" : "Bending" }
  ];

  const precautionOptions = [
    { value: "weight_bearing", label: ar ? "تحمل الوزن" : "Weight bearing" },
    { value: "rom_limits", label: ar ? "قيود الحركة" : "ROM limits" },
    { value: "bending", label: ar ? "الانحناء" : "Bending restrictions" },
    { value: "pacemaker", label: ar ? "جهاز تنظيم ضربات القلب" : "Pacemaker" },
    { value: "osteoporosis", label: ar ? "هشاشة العظام" : "Osteoporosis" }
  ];

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const toggleFunctionalLimit = (limit: string) => {
    setEditData(prev => ({
      ...prev,
      functionalLimits: prev.functionalLimits.includes(limit)
        ? prev.functionalLimits.filter(l => l !== limit)
        : [...prev.functionalLimits, limit]
    }));
  };

  const togglePrecaution = (precaution: string) => {
    setEditData(prev => ({
      ...prev,
      precautions: prev.precautions.includes(precaution)
        ? prev.precautions.filter(p => p !== precaution)
        : [...prev.precautions, precaution]
    }));
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm relative">
      <BorderBeam size={60} duration={12} delay={9} />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {ar ? "ملخص المريض" : "Patient Snapshot"}
          </h2>
        </div>
        
        <Popover open={isEditing} onOpenChange={setIsEditing}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4" align="end">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  {ar ? "الشكوى الأساسية" : "Primary Concern"}
                </Label>
                <Input
                  value={editData.primaryConcern}
                  onChange={(e) => setEditData(prev => ({ ...prev, primaryConcern: e.target.value }))}
                  placeholder={ar ? "اكتب الشكوى الأساسية..." : "Enter primary concern..."}
                  className="mt-1"
                  maxLength={280}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editData.primaryConcern.length}/280
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">
                    {ar ? "تاريخ البداية" : "Onset Date"}
                  </Label>
                  <Input
                    type="date"
                    value={editData.onsetDate || ""}
                    onChange={(e) => setEditData(prev => ({ ...prev, onsetDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    {ar ? "آلية الحدوث" : "Mechanism"}
                  </Label>
                  <Select 
                    value={editData.mechanism || ""} 
                    onValueChange={(value) => setEditData(prev => ({ ...prev, mechanism: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acute">{ar ? "مفاجئ" : "Acute"}</SelectItem>
                      <SelectItem value="gradual">{ar ? "تدريجي" : "Gradual"}</SelectItem>
                      <SelectItem value="unknown">{ar ? "غير معروف" : "Unknown"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {ar ? "مقياس الألم (0-10)" : "Pain Scale (0-10)"}
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={editData.painScore || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, painScore: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {ar ? "القيود الوظيفية" : "Functional Limits"}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {functionalLimitOptions.map(option => (
                    <Badge
                      key={option.value}
                      variant={editData.functionalLimits.includes(option.value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFunctionalLimit(option.value)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {ar ? "الاحتياطات الحالية" : "Current Precautions"}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {precautionOptions.map(option => (
                    <Badge
                      key={option.value}
                      variant={editData.precautions.includes(option.value) ? "secondary" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePrecaution(option.value)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
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

      {/* Display Data */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700 mb-1">
            {ar ? "الشكوى الأساسية" : "Primary Concern"}
          </h3>
          <p className="text-gray-900">{snapshot.primaryConcern}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {snapshot.onsetDate && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                {ar ? "تاريخ البداية" : "Onset"}
              </h4>
              <p className="text-sm text-gray-900">
                {new Date(snapshot.onsetDate).toLocaleDateString(ar ? 'ar-SA' : 'en-US')}
              </p>
            </div>
          )}
          
          {snapshot.mechanism && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                {ar ? "آلية الحدوث" : "Mechanism"}
              </h4>
              <p className="text-sm text-gray-900 capitalize">{snapshot.mechanism}</p>
            </div>
          )}

          {snapshot.painScore !== undefined && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                {ar ? "مقياس الألم" : "Pain Scale"}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-red-600">{snapshot.painScore}</span>
                <span className="text-sm text-gray-500">/10</span>
              </div>
            </div>
          )}
        </div>

        {snapshot.functionalLimits.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              {ar ? "القيود الوظيفية" : "Functional Limits"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {snapshot.functionalLimits.map(limit => {
                const option = functionalLimitOptions.find(opt => opt.value === limit);
                return (
                  <Badge key={limit} variant="outline" className="text-orange-700 border-orange-300">
                    {option?.label || limit}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {snapshot.precautions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              {ar ? "الاحتياطات" : "Precautions"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {snapshot.precautions.map(precaution => {
                const option = precautionOptions.find(opt => opt.value === precaution);
                return (
                  <Badge key={precaution} variant="secondary" className="text-red-700 bg-red-100">
                    {option?.label || precaution}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}