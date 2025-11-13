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
import { Plus, Edit, Trash2, Shield, AlertTriangle } from "lucide-react";
import type { AllergyItem, Locale } from "@/lib/types";

interface AllergiesSectionProps {
  allergies: AllergyItem[];
  locale: Locale;
  onUpdate: (allergies: AllergyItem[]) => void;
}

export default function AllergiesSection({ allergies, locale, onUpdate }: AllergiesSectionProps) {
  const ar = locale === 'ar';
  const [isAddingAllergy, setIsAddingAllergy] = React.useState(false);
  const [newAllergy, setNewAllergy] = React.useState<Partial<AllergyItem>>({
    type: "drug",
    name: "",
    severity: "mild",
    reaction: ""
  });

  const allergyTypes = [
    { value: "drug", label: ar ? "دواء" : "Drug", icon: "💊" },
    { value: "food", label: ar ? "طعام" : "Food", icon: "🍎" },
    { value: "latex", label: ar ? "لاتكس" : "Latex", icon: "🧤" },
    { value: "adhesive", label: ar ? "لاصق" : "Adhesive", icon: "🩹" }
  ];

  const severityLevels = [
    { value: "mild", label: ar ? "خفيف" : "Mild", color: "bg-green-100 text-green-800" },
    { value: "moderate", label: ar ? "متوسط" : "Moderate", color: "bg-yellow-100 text-yellow-800" },
    { value: "severe", label: ar ? "شديد" : "Severe", color: "bg-red-100 text-red-800" }
  ];

  const commonAllergies = {
    drug: ["Penicillin", "Aspirin", "Ibuprofen", "Codeine", "Morphine"],
    food: [
      ar ? "الفول السوداني" : "Peanuts", 
      ar ? "البيض" : "Eggs", 
      ar ? "الحليب" : "Milk", 
      ar ? "الأسماك" : "Fish", 
      ar ? "الجوز" : "Tree nuts"
    ],
    latex: [ar ? "قفازات لاتكس" : "Latex gloves", ar ? "قسطرة" : "Catheters"],
    adhesive: [ar ? "شريط لاصق" : "Medical tape", ar ? "لصقات" : "Band-aids"]
  };

  const handleAddAllergy = () => {
    if (newAllergy.name && newAllergy.type) {
      const allergy: AllergyItem = {
        id: Date.now().toString(),
        type: newAllergy.type as any,
        name: newAllergy.name,
        severity: newAllergy.severity as any,
        reaction: newAllergy.reaction,
        authoredBy: 'user' // Make sure this is included
      };
      onUpdate([...allergies, allergy]);
      setNewAllergy({ name: "", type: "drug", severity: "mild", reaction: "" });
      setIsAddingAllergy(false);
    }
  };

  const handleDeleteAllergy = (id: string) => {
    onUpdate(allergies.filter(allergy => allergy.id !== id));
  };

  const getSeverityInfo = (severity: string) => {
    return severityLevels.find(level => level.value === severity) || severityLevels[0];
  };

  const getTypeInfo = (type: string) => {
    return allergyTypes.find(t => t.value === type) || allergyTypes[0];
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {ar ? "الحساسية والتفاعلات" : "Allergies & Reactions"}
          </h2>
        </div>
        
        <Popover open={isAddingAllergy} onOpenChange={setIsAddingAllergy}>
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
                  {ar ? "نوع الحساسية" : "Allergy Type"}
                </Label>
                <Select 
                  value={newAllergy.type} 
                  onValueChange={(value) => setNewAllergy(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allergyTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {ar ? "المادة المسببة للحساسية" : "Allergen"}
                </Label>
                <Input
                  value={newAllergy.name}
                  onChange={(e) => setNewAllergy(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={ar ? "اكتب اسم المادة..." : "Enter allergen name..."}
                  className="mt-1"
                />
                
                {/* Quick suggestions */}
                {newAllergy.type && commonAllergies[newAllergy.type as keyof typeof commonAllergies] && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">{ar ? "شائع:" : "Common:"}</p>
                    <div className="flex flex-wrap gap-1">
                      {commonAllergies[newAllergy.type as keyof typeof commonAllergies].map(suggestion => (
                        <Badge
                          key={suggestion}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-gray-100"
                          onClick={() => setNewAllergy(prev => ({ ...prev, name: suggestion }))}
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
                  {ar ? "شدة التفاعل" : "Severity"}
                </Label>
                <Select 
                  value={newAllergy.severity} 
                  onValueChange={(value) => setNewAllergy(prev => ({ ...prev, severity: value as any }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {ar ? "وصف التفاعل" : "Reaction Description"}
                </Label>
                <Textarea
                  value={newAllergy.reaction}
                  onChange={(e) => setNewAllergy(prev => ({ ...prev, reaction: e.target.value }))}
                  placeholder={ar ? "اكتب وصف التفاعل..." : "Describe the reaction..."}
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAddingAllergy(false)}>
                  {ar ? "إلغاء" : "Cancel"}
                </Button>
                <Button size="sm" onClick={handleAddAllergy} className="bg-teal-600 hover:bg-teal-700">
                  {ar ? "إضافة" : "Add"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Allergies List */}
      <div className="space-y-3">
        {allergies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>{ar ? "لا توجد حساسية مسجلة" : "No allergies recorded"}</p>
            <p className="text-sm">{ar ? "انقر على إضافة لإضافة حساسية" : "Click Add to record an allergy"}</p>
          </div>
        ) : (
          allergies.map(allergy => {
            const severityInfo = getSeverityInfo(allergy.severity);
            const typeInfo = getTypeInfo(allergy.type);
            return (
              <div key={allergy.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-blue-700 border-blue-300">
                        <span className="mr-1">{typeInfo.icon}</span>
                        {typeInfo.label}
                      </Badge>
                      <Badge className={severityInfo.color}>
                        {allergy.severity === "severe" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {severityInfo.label}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1">
                      {allergy.name}
                    </h3>
                    
                    {allergy.reaction && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{ar ? "التفاعل:" : "Reaction:"}</span> {allergy.reaction}
                      </p>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteAllergy(allergy.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}