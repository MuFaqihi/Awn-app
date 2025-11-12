
"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { Locale, ConditionItem } from '@/lib/types';

interface Props {
  conditions: ConditionItem[];
  locale: Locale;
  onSave: (data: ConditionItem[]) => void;
}

export default function EditableConditions({ conditions, locale, onSave }: Props) {
  const ar = locale === 'ar';
  const [currentConditions, setCurrentConditions] = useState(conditions);
  const [newCondition, setNewCondition] = useState({ 
    name: '', 
    category: '' as 'chronic' | 'msk' | 'neuro' | 'cardio' | 'metabolic' | 'mental' | '',
    diagnosedYear: new Date().getFullYear()
  });

  const addCondition = () => {
    if (newCondition.name && newCondition.category) {
      const condition: ConditionItem = {
        id: Date.now().toString(),
        name: newCondition.name,
        category: newCondition.category as 'chronic' | 'msk' | 'neuro' | 'cardio' | 'metabolic' | 'mental',
        diagnosedYear: newCondition.diagnosedYear,
        authoredBy: 'user'
      };
      setCurrentConditions([...currentConditions, condition]);
      setNewCondition({ name: '', category: '' as any, diagnosedYear: new Date().getFullYear() });
    }
  };

  const removeCondition = (id: string) => {
    const updatedConditions = currentConditions.filter(c => c.id !== id);
    setCurrentConditions(updatedConditions);
  };

  const handleSave = () => {
    onSave(currentConditions);
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>{ar ? "اسم الحالة" : "Condition Name"}</Label>
          <Input
            value={newCondition.name}
            onChange={(e) => setNewCondition({...newCondition, name: e.target.value})}
            placeholder={ar ? "مثال: ارتفاع ضغط الدم" : "Example: Hypertension"}
            className="mt-1"
          />
        </div>
        <div>
          <Label>{ar ? "الفئة" : "Category"}</Label>
          <Select 
            value={newCondition.category} 
            onValueChange={(value) => setNewCondition({...newCondition, category: value as any})}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={ar ? "اختر الفئة" : "Select category"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chronic">{ar ? "مزمن" : "Chronic"}</SelectItem>
              <SelectItem value="msk">{ar ? "عضلي هيكلي" : "Musculoskeletal"}</SelectItem>
              <SelectItem value="neuro">{ar ? "عصبي" : "Neurological"}</SelectItem>
              <SelectItem value="cardio">{ar ? "قلبي وعائي" : "Cardiovascular"}</SelectItem>
              <SelectItem value="metabolic">{ar ? "استقلابي" : "Metabolic"}</SelectItem>
              <SelectItem value="mental">{ar ? "نفسي" : "Mental Health"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{ar ? "سنة التشخيص" : "Diagnosed Year"}</Label>
          <Input
            type="number"
            value={newCondition.diagnosedYear}
            onChange={(e) => setNewCondition({...newCondition, diagnosedYear: parseInt(e.target.value)})}
            className="mt-1"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>
      </div>
      
      <Button onClick={addCondition} size="sm" className="mt-2">
        {ar ? "إضافة حالة" : "Add Condition"}
      </Button>
      
      <div className="space-y-2">
        {currentConditions.map((condition) => (
          <div key={condition.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium">{condition.name}</span>
              <Badge variant="outline">
                {condition.category}
              </Badge>
              {condition.diagnosedYear && (
                <span className="text-sm text-gray-500">({condition.diagnosedYear})</span>
              )}
              <Badge variant="secondary" className="text-xs">
                {condition.authoredBy === 'user' ? (ar ? "المريض" : "Patient") : (ar ? "الأخصائي" : "Therapist")}
              </Badge>
            </div>
            {condition.authoredBy === 'user' && (
              <Button
                onClick={() => removeCondition(condition.id)}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
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