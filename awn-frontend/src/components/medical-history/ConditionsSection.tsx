"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Heart, Brain, Bone, Activity, Zap } from "lucide-react";
import type { ConditionItem, Locale } from "@/lib/types";

interface ConditionsSectionProps {
  conditions: ConditionItem[];
  locale: Locale; 
  onUpdate: (conditions: ConditionItem[]) => void;
}

export default function ConditionsSection({ conditions, locale, onUpdate }: ConditionsSectionProps) {
  const ar = locale === 'ar';
  const [isAddingCondition, setIsAddingCondition] = React.useState(false);
  const [editingCondition, setEditingCondition] = React.useState<string | null>(null);
  const [newCondition, setNewCondition] = React.useState<Partial<ConditionItem>>({
    name: "",
    category: "msk",
    notes: ""
  });

  const categoryOptions = [
    { value: "msk", label: ar ? "عضلي هيكلي" : "Musculoskeletal", icon: <Bone className="h-4 w-4" />, color: "bg-orange-100 text-orange-800" },
    { value: "neuro", label: ar ? "عصبي" : "Neurological", icon: <Brain className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" },
    { value: "cardio", label: ar ? "قلبي وعائي" : "Cardiovascular", icon: <Heart className="h-4 w-4" />, color: "bg-red-100 text-red-800" },
    { value: "metabolic", label: ar ? "أيضي" : "Metabolic", icon: <Activity className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
    { value: "mental", label: ar ? "نفسي" : "Mental Health", icon: <Zap className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" }
  ];

  const commonConditions = {
    msk: [
      ar ? "آلام أسفل الظهر" : "Lower back pain",
      ar ? "انزلاق غضروفي" : "Disc herniation", 
      ar ? "التهاب المفاصل" : "Arthritis",
      ar ? "متلازمة النفق الرسغي" : "Carpal tunnel syndrome",
      ar ? "إصابة الكتف" : "Shoulder injury"
    ],
    neuro: [
      ar ? "السكتة الدماغية" : "Stroke",
      ar ? "اعتلال الأعصاب الطرفية" : "Peripheral neuropathy",
      ar ? "الصرع" : "Epilepsy",
      ar ? "التصلب المتعدد" : "Multiple sclerosis"
    ],
    cardio: [
      ar ? "ارتفاع ضغط الدم" : "Hypertension",
      ar ? "أمراض القلب" : "Heart disease",
      ar ? "الربو" : "Asthma",
      ar ? "مرض الانسداد الرئوي المزمن" : "COPD"
    ],
    metabolic: [
      ar ? "السكري النوع الثاني" : "Type 2 Diabetes",
      ar ? "السكري النوع الأول" : "Type 1 Diabetes",
      ar ? "اضطرابات الغدة الدرقية" : "Thyroid disorders",
      ar ? "السمنة" : "Obesity"
    ],
    mental: [
      ar ? "الاكتئاب" : "Depression",
      ar ? "القلق" : "Anxiety",
      ar ? "اضطراب ما بعد الصدمة" : "PTSD"
    ]
  };

const handleAddCondition = () => {
  if (newCondition.name && newCondition.category) {
    const condition: ConditionItem = {
      id: Date.now().toString(),
      name: newCondition.name,
      category: newCondition.category as any,
      notes: newCondition.notes,
      authoredBy: 'user' // Add this required property
    };
    onUpdate([...conditions, condition]);
    setNewCondition({ name: "", category: "msk", notes: "" });
    setIsAddingCondition(false);
  }
};

  const handleEditCondition = (id: string, updates: Partial<ConditionItem>) => {
    onUpdate(conditions.map(condition => 
      condition.id === id ? { ...condition, ...updates } : condition
    ));
    setEditingCondition(null);
  };

  const handleDeleteCondition = (id: string) => {
    onUpdate(conditions.filter(condition => condition.id !== id));
  };

  const getCategoryInfo = (category: string) => {
    return categoryOptions.find(opt => opt.value === category) || categoryOptions[0];
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bone className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {ar ? "الحالات والتشخيصات" : "Conditions & Diagnoses"}
          </h2>
        </div>
        
        <Popover open={isAddingCondition} onOpenChange={setIsAddingCondition}>
          <PopoverTrigger asChild>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-1" />
              {ar ? "إضافة" : "Add"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  {ar ? "الفئة" : "Category"}
                </Label>
                <Select 
                  value={newCondition.category} 
                  onValueChange={(value) => setNewCondition(prev => ({ ...prev, category: value as any }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {ar ? "اسم الحالة" : "Condition Name"}
                </Label>
                <Input
                  value={newCondition.name}
                  onChange={(e) => setNewCondition(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={ar ? "اكتب اسم الحالة..." : "Enter condition name..."}
                  className="mt-1"
                />
                
                {/* Quick suggestions */}
                {newCondition.category && commonConditions[newCondition.category as keyof typeof commonConditions] && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">{ar ? "اقتراحات:" : "Suggestions:"}</p>
                    <div className="flex flex-wrap gap-1">
                      {commonConditions[newCondition.category as keyof typeof commonConditions].map(suggestion => (
                        <Badge
                          key={suggestion}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-gray-100"
                          onClick={() => setNewCondition(prev => ({ ...prev, name: suggestion }))}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {ar ? "ملاحظات" : "Notes"}
                </Label>
                <Textarea
                  value={newCondition.notes}
                  onChange={(e) => setNewCondition(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder={ar ? "ملاحظات إضافية..." : "Additional notes..."}
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAddingCondition(false)}>
                  {ar ? "إلغاء" : "Cancel"}
                </Button>
                <Button size="sm" onClick={handleAddCondition} className="bg-teal-600 hover:bg-teal-700">
                  {ar ? "إضافة" : "Add"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Conditions List */}
      <div className="space-y-3">
        {conditions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bone className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>{ar ? "لا توجد حالات مسجلة" : "No conditions recorded"}</p>
            <p className="text-sm">{ar ? "انقر على إضافة لإضافة حالة طبية" : "Click Add to record a medical condition"}</p>
          </div>
        ) : (
          conditions.map(condition => {
            const categoryInfo = getCategoryInfo(condition.category);
            return (
              <div key={condition.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={categoryInfo.color}>
                        {categoryInfo.icon}
                        <span className="ml-1">{categoryInfo.label}</span>
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1">
                      {condition.name}
                    </h3>
                    
                    {condition.notes && (
                      <p className="text-sm text-gray-600">
                        {condition.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingCondition(condition.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCondition(condition.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}