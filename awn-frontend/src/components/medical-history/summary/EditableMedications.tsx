
"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { Locale, MedicationItem } from '@/lib/types';

interface Props {
  medications: MedicationItem[];
  locale: Locale;
  onSave: (data: MedicationItem[]) => void;
}

export default function EditableMedications({ medications, locale, onSave }: Props) {
  const ar = locale === 'ar';
  const [currentMedications, setCurrentMedications] = useState(medications);
  const [newMedication, setNewMedication] = useState({ 
    name: '', 
    dose: '', 
    frequency: '', 
    anticoagulant: false 
  });

  const addMedication = () => {
    if (newMedication.name) {
      const medication: MedicationItem = {
        id: Date.now().toString(),
        name: newMedication.name,
        dose: newMedication.dose,
        frequency: newMedication.frequency,
        anticoagulant: newMedication.anticoagulant,
        authoredBy: 'user'
      };
      setCurrentMedications([...currentMedications, medication]);
      setNewMedication({ name: '', dose: '', frequency: '', anticoagulant: false });
    }
  };

  const removeMedication = (id: string) => {
    const updatedMedications = currentMedications.filter(m => m.id !== id);
    setCurrentMedications(updatedMedications);
  };

  const handleSave = () => {
    onSave(currentMedications);
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{ar ? "اسم الدواء" : "Medication Name"}</Label>
          <Input
            value={newMedication.name}
            onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
            placeholder={ar ? "مثال: إيبوبروفين" : "Example: Ibuprofen"}
            className="mt-1"
          />
        </div>
        <div>
          <Label>{ar ? "الجرعة" : "Dose"}</Label>
          <Input
            value={newMedication.dose}
            onChange={(e) => setNewMedication({...newMedication, dose: e.target.value})}
            placeholder={ar ? "مثال: 400 مج" : "Example: 400mg"}
            className="mt-1"
          />
        </div>
        <div>
          <Label>{ar ? "التكرار" : "Frequency"}</Label>
          <Input
            value={newMedication.frequency}
            onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
            placeholder={ar ? "مثال: مرتين يومياً" : "Example: Twice daily"}
            className="mt-1"
          />
        </div>
        <div className="flex items-center space-x-2 mt-6">
          <Checkbox
            id="anticoagulant"
            checked={newMedication.anticoagulant}
            onCheckedChange={(checked) => setNewMedication({...newMedication, anticoagulant: !!checked})}
          />
          <Label htmlFor="anticoagulant" className="text-sm">
            {ar ? "مضاد للتخثر" : "Anticoagulant"}
          </Label>
        </div>
      </div>
      
      <Button onClick={addMedication} size="sm" className="mt-2">
        {ar ? "إضافة دواء" : "Add Medication"}
      </Button>
      
      <div className="space-y-2">
        {currentMedications.map((medication) => (
          <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium">{medication.name}</span>
              {medication.dose && <span className="text-sm text-gray-600">{medication.dose}</span>}
              {medication.frequency && <span className="text-sm text-gray-600">({medication.frequency})</span>}
              {medication.anticoagulant && (
                <Badge variant="destructive" className="text-xs">
                  {ar ? "مضاد تخثر" : "Anticoagulant"}
                </Badge>
              )}
            </div>
            <Button
              onClick={() => removeMedication(medication.id)}
              variant="ghost"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} className="flex-1 bg-teal-600 hover:bg-teal-700">
          {ar ? "حفظ التغييرات" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}