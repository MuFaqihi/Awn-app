
"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { Locale, AllergyItem } from '@/lib/types';

interface Props {
  allergies: AllergyItem[];
  locale: Locale;
  onSave: (data: AllergyItem[]) => void;
}

export default function EditableAllergies({ allergies, locale, onSave }: Props) {
  const ar = locale === 'ar';
  const [currentAllergies, setCurrentAllergies] = useState(allergies);
  const [newAllergy, setNewAllergy] = useState({ 
    name: '', 
    type: '' as 'drug' | 'food' | 'latex' | 'adhesive' | 'other' | '',
    severity: '' as 'mild' | 'moderate' | 'severe' | '',
    reaction: ''
  });

  const addAllergy = () => {
    if (newAllergy.name && newAllergy.type && newAllergy.severity) {
      const allergy: AllergyItem = {
        id: Date.now().toString(),
        name: newAllergy.name,
        type: newAllergy.type as 'drug' | 'food' | 'latex' | 'adhesive' | 'other',
        severity: newAllergy.severity as 'mild' | 'moderate' | 'severe',
        reaction: newAllergy.reaction,
        authoredBy: 'user'
      };
      setCurrentAllergies([...currentAllergies, allergy]);
      setNewAllergy({ name: '', type: '' as any, severity: '' as any, reaction: '' });
    }
  };

  const removeAllergy = (id: string) => {
    const updatedAllergies = currentAllergies.filter(a => a.id !== id);
    setCurrentAllergies(updatedAllergies);
  };

  const handleSave = () => {
    onSave(currentAllergies);
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{ar ? "اسم المادة" : "Allergen"}</Label>
          <Input
            value={newAllergy.name}
            onChange={(e) => setNewAllergy({...newAllergy, name: e.target.value})}
            placeholder={ar ? "مثال: البنسلين" : "Example: Penicillin"}
            className="mt-1"
          />
        </div>
        <div>
          <Label>{ar ? "النوع" : "Type"}</Label>
          <Select 
            value={newAllergy.type} 
            onValueChange={(value) => setNewAllergy({...newAllergy, type: value as any})}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={ar ? "النوع" : "Type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="drug">{ar ? "دواء" : "Drug"}</SelectItem>
              <SelectItem value="food">{ar ? "طعام" : "Food"}</SelectItem>
              <SelectItem value="latex">{ar ? "لاتكس" : "Latex"}</SelectItem>
              <SelectItem value="adhesive">{ar ? "لاصق" : "Adhesive"}</SelectItem>
              <SelectItem value="other">{ar ? "أخرى" : "Other"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{ar ? "الشدة" : "Severity"}</Label>
          <Select 
            value={newAllergy.severity} 
            onValueChange={(value) => setNewAllergy({...newAllergy, severity: value as any})}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={ar ? "الشدة" : "Severity"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">{ar ? "خفيف" : "Mild"}</SelectItem>
              <SelectItem value="moderate">{ar ? "متوسط" : "Moderate"}</SelectItem>
              <SelectItem value="severe">{ar ? "شديد" : "Severe"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{ar ? "رد الفعل" : "Reaction"}</Label>
          <Input
            value={newAllergy.reaction}
            onChange={(e) => setNewAllergy({...newAllergy, reaction: e.target.value})}
            placeholder={ar ? "مثال: طفح جلدي" : "Example: rash"}
            className="mt-1"
          />
        </div>
      </div>
      
      <Button onClick={addAllergy} size="sm" className="mt-2">
        {ar ? "إضافة حساسية" : "Add Allergy"}
      </Button>
      
      <div className="space-y-2">
        {currentAllergies.map((allergy) => (
          <div key={allergy.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium">{allergy.name}</span>
              <Badge variant="outline">{allergy.type}</Badge>
              <Badge 
                variant={allergy.severity === 'severe' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {allergy.severity}
              </Badge>
              {allergy.reaction && (
                <span className="text-sm text-gray-500">({allergy.reaction})</span>
              )}
            </div>
            <Button
              onClick={() => removeAllergy(allergy.id)}
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