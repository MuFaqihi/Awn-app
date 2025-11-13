"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BorderBeam } from "@/components/ui/border-beam";
import { Plus, Edit, Trash2, Pill, AlertTriangle } from "lucide-react";
import type { MedicationItem, Locale } from "@/lib/types";

interface MedicationsSectionProps {
  medications: MedicationItem[];
  locale: Locale;
  onUpdate: (medications: MedicationItem[]) => void;
}

export default function MedicationsSection({ medications, locale, onUpdate }: MedicationsSectionProps) {
   const ar = locale === 'ar';
  const [isAddingMedication, setIsAddingMedication] = React.useState(false);
  const [newMedication, setNewMedication] = React.useState<Partial<MedicationItem>>({
    name: "",
    dose: "",
    frequency: "",
    purpose: "",
    startDate: "",
    anticoagulant: false
  });

  const commonMedications = [
    "Ibuprofen", "Paracetamol", "Aspirin", "Omeprazole", "Metformin",
    "Lisinopril", "Amlodipine", "Simvastatin", "Warfarin", "Clopidogrel"
  ];

  const frequencyOptions = ar ? [
    "مرة واحدة يومياً", "مرتين يومياً", "ثلاث مرات يومياً", "كل 8 ساعات", "كل 12 ساعة", "عند الحاجة"
  ] : [
    "Once daily", "Twice daily", "Three times daily", "Every 8 hours", "Every 12 hours", "As needed"
  ];

 const handleAddMedication = () => {
    if (newMedication.name) {
      const medication: MedicationItem = {
        id: Date.now().toString(),
        name: newMedication.name,
        dose: newMedication.dose,
        frequency: newMedication.frequency,
        purpose: newMedication.purpose,
        startDate: newMedication.startDate,
        anticoagulant: newMedication.anticoagulant || false,
        authoredBy: 'user'
      };
      onUpdate([...medications, medication]);
      setNewMedication({ name: "", dose: "", frequency: "", purpose: "", startDate: "", anticoagulant: false });
      setIsAddingMedication(false);
    }
  };
  const handleDeleteMedication = (id: string) => {
    onUpdate(medications.filter(med => med.id !== id));
  };

  const anticoagulantMeds = medications.filter(med => med.anticoagulant);

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm relative">
      {anticoagulantMeds.length > 0 && <BorderBeam size={60} duration={8} delay={3} />}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Pill className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {ar ? "الأدوية والمكملات" : "Medications & Supplements"}
          </h2>
        </div>
        
        <Popover open={isAddingMedication} onOpenChange={setIsAddingMedication}>
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
                  {ar ? "اسم الدواء" : "Medication Name"}
                </Label>
                <Input
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={ar ? "اكتب اسم الدواء..." : "Enter medication name..."}
                  className="mt-1"
                />
                
                {/* Quick suggestions */}
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-2">{ar ? "أدوية شائعة:" : "Common medications:"}</p>
                  <div className="flex flex-wrap gap-1">
                    {commonMedications.map(med => (
                      <Badge
                        key={med}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-gray-100"
                        onClick={() => setNewMedication(prev => ({ ...prev, name: med }))}
                      >
                        {med}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">
                    {ar ? "الجرعة" : "Dose"}
                  </Label>
                  <Input
                    value={newMedication.dose}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, dose: e.target.value }))}
                    placeholder={ar ? "مثال: 500mg" : "e.g., 500mg"}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    {ar ? "تاريخ البداية" : "Start Date"}
                  </Label>
                  <Input
                    type="date"
                    value={newMedication.startDate}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, startDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {ar ? "معدل التكرار" : "Frequency"}
                </Label>
                <Input
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                  placeholder={ar ? "مثال: مرتين يومياً" : "e.g., Twice daily"}
                  className="mt-1"
                />
                
                {/* Frequency suggestions */}
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {frequencyOptions.map(freq => (
                      <Badge
                        key={freq}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-gray-100"
                        onClick={() => setNewMedication(prev => ({ ...prev, frequency: freq }))}
                      >
                        {freq}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {ar ? "الغرض من الدواء" : "Purpose"}
                </Label>
                <Input
                  value={newMedication.purpose}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder={ar ? "مثال: تسكين الألم" : "e.g., Pain relief"}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-yellow-800">
                    {ar ? "مضاد للتخثر" : "Anticoagulant"}
                  </Label>
                  <p className="text-xs text-yellow-600">
                    {ar ? "مهم للعلاج اليدوي" : "Important for manual therapy"}
                  </p>
                </div>
                <Switch
                  checked={newMedication.anticoagulant}
                  onCheckedChange={(checked) => setNewMedication(prev => ({ ...prev, anticoagulant: checked }))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAddingMedication(false)}>
                  {ar ? "إلغاء" : "Cancel"}
                </Button>
                <Button size="sm" onClick={handleAddMedication} className="bg-teal-600 hover:bg-teal-700">
                  {ar ? "إضافة" : "Add"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Anticoagulant Warning */}
      {anticoagulantMeds.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              {ar ? "تحذير: المريض يتناول أدوية مضادة للتخثر" : "Warning: Patient on anticoagulant medication"}
            </span>
          </div>
        </div>
      )}

      {/* Medications List */}
      <div className="space-y-3">
        {medications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Pill className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>{ar ? "لا توجد أدوية مسجلة" : "No medications recorded"}</p>
            <p className="text-sm">{ar ? "انقر على إضافة لإضافة دواء" : "Click Add to record a medication"}</p>
          </div>
        ) : (
          medications.map(medication => (
            <div key={medication.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {medication.name}
                    </h3>
                    {medication.anticoagulant && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {ar ? "مضاد تخثر" : "Anticoagulant"}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    {medication.dose && (
                      <div>
                        <span className="font-medium">{ar ? "الجرعة:" : "Dose:"}</span> {medication.dose}
                      </div>
                    )}
                    {medication.frequency && (
                      <div>
                        <span className="font-medium">{ar ? "التكرار:" : "Frequency:"}</span> {medication.frequency}
                      </div>
                    )}
                    {medication.purpose && (
                      <div>
                        <span className="font-medium">{ar ? "الغرض:" : "Purpose:"}</span> {medication.purpose}
                      </div>
                    )}
                    {medication.startDate && (
                      <div>
                        <span className="font-medium">{ar ? "بداية:" : "Started:"}</span> {new Date(medication.startDate).toLocaleDateString(ar ? 'ar-SA' : 'en-US')}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" onClick={() => handleDeleteMedication(medication.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}