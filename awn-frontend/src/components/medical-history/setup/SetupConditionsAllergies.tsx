// src/components/medical-history/setup/SetupConditionsAllergies.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/base-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Heart, Shield } from 'lucide-react';
import type { Locale, ConditionItem, AllergyItem } from '@/lib/types';

interface Props {
  locale: Locale;
  onStepDataUpdate: (data: { conditions: ConditionItem[]; allergies: AllergyItem[]; noAllergies: boolean }) => void;
  stepData?: { conditions?: ConditionItem[]; allergies?: AllergyItem[]; noAllergies?: boolean };
}

export default function SetupConditionsAllergies({ locale, onStepDataUpdate, stepData = {} }: Props) {
  const ar = locale === 'ar';
  const [currentConditions, setCurrentConditions] = useState<ConditionItem[]>(stepData.conditions || []);
  const [currentAllergies, setCurrentAllergies] = useState<AllergyItem[]>(stepData.allergies || []);
  const [hasNoAllergies, setHasNoAllergies] = useState(stepData.noAllergies || false);
  const [newCondition, setNewCondition] = useState({ name: '', category: '', yearDiagnosed: '' });
  const [newAllergy, setNewAllergy] = useState({ name: '', type: '', severity: '' });

  // Categories updated for physio relevance
  const categoryOptions = [
    { value: 'chronic', label: ar ? 'مزمن' : 'Chronic' },
    { value: 'musculoskeletal', label: ar ? 'عضلي هيكلي' : 'Musculoskeletal' },
    { value: 'neurological', label: ar ? 'عصبي' : 'Neurological' },
    { value: 'cardio-respiratory', label: ar ? 'قلبي تنفسي' : 'Cardio-respiratory' },
    { value: 'post-operative', label: ar ? 'ما بعد الجراحة/الإصابة' : 'Post-operative/Injury recovery' }
  ];

  const allergyTypes = [
    { value: 'drug', label: ar ? 'دواء' : 'Drug' },
    { value: 'food', label: ar ? 'طعام' : 'Food' },
    { value: 'latex', label: ar ? 'لاتكس' : 'Latex' },
    { value: 'adhesive', label: ar ? 'لاصق' : 'Adhesive' },
    { value: 'other', label: ar ? 'أخرى' : 'Other' }
  ];

  const severityLevels = [
    { value: 'mild', label: ar ? 'خفيف' : 'Mild' },
    { value: 'moderate', label: ar ? 'متوسط' : 'Moderate' },
    { value: 'severe', label: ar ? 'شديد' : 'Severe' }
  ];

  const addCondition = useCallback(() => {
    if (newCondition.name && newCondition.category) {
      const condition: ConditionItem = {
        id: Date.now().toString(),
        name: newCondition.name,
        category: newCondition.category as any,
        diagnosedYear: newCondition.yearDiagnosed ? parseInt(newCondition.yearDiagnosed) : undefined,
        authoredBy: 'user'
      };
      setCurrentConditions(prev => [...prev, condition]);
      setNewCondition({ name: '', category: '', yearDiagnosed: '' });
    }
  }, [newCondition]);

  const addAllergy = useCallback(() => {
    if (newAllergy.name && newAllergy.type && newAllergy.severity) {
      const allergy: AllergyItem = {
        id: Date.now().toString(),
        name: newAllergy.name,
        type: newAllergy.type as any,
        severity: newAllergy.severity as any,
        authoredBy: 'user'
      };
      setCurrentAllergies(prev => [...prev, allergy]);
      setNewAllergy({ name: '', type: '', severity: '' });
      // If adding allergy, uncheck "no allergies" but don't navigate
      setHasNoAllergies(false);
    }
  }, [newAllergy]);

  const removeCondition = useCallback((id: string) => {
    setCurrentConditions(prev => prev.filter(c => c.id !== id));
  }, []);

  const removeAllergy = useCallback((id: string) => {
    setCurrentAllergies(prev => prev.filter(a => a.id !== id));
  }, []);

  const handleNoAllergiesChange = useCallback((checked: boolean) => {
    setHasNoAllergies(checked);
    if (checked) {
      // Clear all allergies when "no allergies" is checked but don't navigate
      setCurrentAllergies([]);
    }
  }, []);

  const handleYearInput = useCallback((value: string) => {
    // Only allow digits and limit to 4 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 4);
    setNewCondition(prev => ({ ...prev, yearDiagnosed: digitsOnly }));
  }, []);

  // Update parent without triggering navigation
  useEffect(() => {
    onStepDataUpdate({
      conditions: currentConditions,
      allergies: currentAllergies,
      noAllergies: hasNoAllergies
    });
  }, [currentConditions, currentAllergies, hasNoAllergies, onStepDataUpdate]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      {/* Conditions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Heart className="h-5 w-5" />
            {ar ? 'الحالات الطبية' : 'Medical Conditions'}
          </CardTitle>
          <p className="text-sm text-blue-700">
            {ar ? 'أضف أي حالات طبية لديك (اختياري)' : 'Add any medical conditions you have (optional)'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label className="text-blue-800 font-medium">
                {ar ? 'اسم الحالة' : 'Condition Name'}
              </Label>
              <Input
                value={newCondition.name}
                onChange={(e) => setNewCondition({...newCondition, name: e.target.value})}
                placeholder={ar ? 'مثال: ارتفاع ضغط الدم' : 'Example: Hypertension'}
                className="mt-1 bg-white border-blue-300"
                onKeyPress={(e) => e.key === 'Enter' && addCondition()}
              />
            </div>
            <div>
              <Label className="text-blue-800 font-medium">
                {ar ? 'الفئة' : 'Category'}
              </Label>
              <Select 
                value={newCondition.category} 
                onValueChange={(value) => setNewCondition({...newCondition, category: value})}
              >
                <SelectTrigger className="mt-1 bg-white border-blue-300">
                  <SelectValue placeholder={ar ? 'اختر الفئة' : 'Select category'} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-blue-800 font-medium">
                {ar ? 'سنة التشخيص' : 'Year Diagnosed'}
              </Label>
              <Input
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                value={newCondition.yearDiagnosed}
                onChange={(e) => handleYearInput(e.target.value)}
                placeholder="YYYY"
                className="mt-1 bg-white border-blue-300"
                onKeyPress={(e) => e.key === 'Enter' && addCondition()}
              />
            </div>
          </div>
          
          <Button 
            onClick={addCondition} 
            disabled={!newCondition.name || !newCondition.category}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {ar ? 'إضافة حالة' : 'Add Condition'}
          </Button>
          
          {currentConditions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-800">
                {ar ? 'الحالات المضافة:' : 'Added conditions:'}
              </h4>
              <div className="space-y-2">
                {currentConditions.map((condition) => (
                  <div key={condition.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                    <div>
                      <span className="font-medium text-blue-900">{condition.name}</span>
                      <span className="text-sm text-blue-600 ml-2">
                        ({categoryOptions.find(c => c.value === condition.category)?.label})
                      </span>
                      {condition.diagnosedYear && (
                        <span className="text-sm text-blue-600 ml-2">- {condition.diagnosedYear}</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeCondition(condition.id)}
                      className="text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Allergies & Sensitivities */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <Shield className="h-5 w-5" />
            {ar ? 'الحساسية والحساسيات' : 'Allergies & Sensitivities'}
            <Badge variant="destructive" className="text-xs">
              {ar ? 'مطلوب' : 'Required'}
            </Badge>
          </CardTitle>
          <p className="text-sm text-red-700">
            {ar ? 'أضف أي حساسية لديك أو أكد عدم وجودها' : 'Add any allergies you have or confirm you have none'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* No Allergies Checkbox */}
          <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-red-200">
            <Checkbox
              id="no-allergies"
              checked={hasNoAllergies}
              onCheckedChange={handleNoAllergiesChange}
            />
            <Label htmlFor="no-allergies" className="text-red-800 font-medium cursor-pointer">
              {ar ? 'ليس لدي أي حساسية' : 'I have no allergies'}
            </Label>
          </div>

          {!hasNoAllergies && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-red-800 font-medium">
                    {ar ? 'اسم المادة' : 'Allergen'}
                  </Label>
                  <Input
                    value={newAllergy.name}
                    onChange={(e) => setNewAllergy({...newAllergy, name: e.target.value})}
                    placeholder={ar ? 'مثال: البنسلين' : 'Example: Penicillin'}
                    className="mt-1 bg-white border-red-300"
                    onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  />
                </div>
                <div>
                  <Label className="text-red-800 font-medium">
                    {ar ? 'النوع' : 'Type'}
                  </Label>
                  <Select 
                    value={newAllergy.type} 
                    onValueChange={(value) => setNewAllergy({...newAllergy, type: value})}
                  >
                    <SelectTrigger className="mt-1 bg-white border-red-300">
                      <SelectValue placeholder={ar ? 'النوع' : 'Type'} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {allergyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-red-800 font-medium">
                    {ar ? 'الشدة' : 'Severity'}
                  </Label>
                  <Select 
                    value={newAllergy.severity} 
                    onValueChange={(value) => setNewAllergy({...newAllergy, severity: value})}
                  >
                    <SelectTrigger className="mt-1 bg-white border-red-300">
                      <SelectValue placeholder={ar ? 'الشدة' : 'Severity'} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {severityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={addAllergy} 
                disabled={!newAllergy.name || !newAllergy.type || !newAllergy.severity}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {ar ? 'إضافة حساسية' : 'Add Allergy'}
              </Button>
              
              {currentAllergies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-800">
                    {ar ? 'الحساسية المضافة:' : 'Added allergies:'}
                  </h4>
                  <div className="space-y-2">
                    {currentAllergies.map((allergy) => (
                      <div key={allergy.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200 shadow-sm">
                        <div>
                          <span className="font-medium text-red-900">{allergy.name}</span>
                          <span className="text-sm text-red-600 ml-2">
                            ({allergyTypes.find(t => t.value === allergy.type)?.label} - {severityLevels.find(s => s.value === allergy.severity)?.label})
                          </span>
                        </div>
                        <button
                          onClick={() => removeAllergy(allergy.id)}
                          className="text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}