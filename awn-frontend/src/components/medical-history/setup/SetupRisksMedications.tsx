// src/components/medical-history/setup/SetupRisksMedications.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/base-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Pill, Plus, X, Zap, Info } from 'lucide-react';
import type { Locale, MedicationItem } from '@/lib/types';

interface Props {
  locale: Locale;
  onStepDataUpdate: (data: { medications: MedicationItem[] }) => void;
  stepData?: { medications?: MedicationItem[] };
}

export default function SetupRisksMedications({ locale, onStepDataUpdate, stepData = {} }: Props) {
  const ar = locale === 'ar';
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [currentMedications, setCurrentMedications] = useState<MedicationItem[]>(stepData.medications || []);
  const [newMedication, setNewMedication] = useState({ 
    name: '', 
    dose: '', 
    frequency: '', 
    isAnticoagulant: false 
  });

  // 7 risk factors including the new one
  const riskFactors = ar ? [
    'فقدان وزن غير مبرر',
    'ألم ليلي شديد',
    'حمى أو قشعريرة',
    'تنميل في المنطقة التناسلية',
    'ضعف متزايد في الأطراف',
    'ألم مستمر في الراحة',
    'فقدان السيطرة على المثانة',
    'إصابة أو حادث حديث'
  ] : [
    'Unexplained weight loss',
    'Severe night pain',
    'Fever or chills',
    'Saddle anesthesia',
    'Progressive limb weakness',
    'Unremitting rest pain',
    'Loss of bladder control',
    'Recent trauma or accident'
  ];

  const frequencyOptions = ar ? [
    { value: 'once-daily', label: 'مرة واحدة يومياً' },
    { value: 'bid', label: 'مرتين يومياً' },
    { value: 'tid', label: 'ثلاث مرات يومياً' },
    { value: 'qid', label: 'أربع مرات يومياً' },
    { value: 'prn', label: 'عند الحاجة' },
    { value: 'weekly', label: 'أسبوعياً' },
    { value: 'other', label: 'أخرى' }
  ] : [
    { value: 'once-daily', label: 'Once daily' },
    { value: 'bid', label: 'Twice daily (BID)' },
    { value: 'tid', label: 'Three times daily (TID)' },
    { value: 'qid', label: 'Four times daily (QID)' },
    { value: 'prn', label: 'As needed (PRN)' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'other', label: 'Other' }
  ];

  const commonMedications = ar ? [
    'مسكنات الألم', 'أدوية الضغط', 'أدوية السكري', 'مضادات الالتهاب', 'فيتامينات'
  ] : [
    'Pain medications', 'Blood pressure meds', 'Diabetes medications', 'Anti-inflammatories', 'Vitamins'
  ];

  const toggleRisk = useCallback((risk: string) => {
    setSelectedRisks(prev => 
      prev.includes(risk) 
        ? prev.filter(r => r !== risk)
        : [...prev, risk]
    );
  }, []);

  const addMedication = useCallback(() => {
    if (newMedication.name.trim()) {
      const medication: MedicationItem = {
        id: Date.now().toString(),
        name: newMedication.name.trim(),
        dose: newMedication.dose.trim() || undefined,
        frequency: newMedication.frequency || undefined,
        anticoagulant: newMedication.isAnticoagulant,
        authoredBy: 'user'
      };
      setCurrentMedications(prev => [...prev, medication]);
      setNewMedication({ name: '', dose: '', frequency: '', isAnticoagulant: false });
    }
  }, [newMedication]);

  const removeMedication = useCallback((id: string) => {
    setCurrentMedications(prev => prev.filter(med => med.id !== id));
  }, []);

  const addQuickMedication = useCallback((name: string) => {
    if (!currentMedications.some(med => med.name === name)) {
      const medication: MedicationItem = {
        id: Date.now().toString(),
        name,
        authoredBy: 'user'
      };
      setCurrentMedications(prev => [...prev, medication]);
    }
  }, [currentMedications]);

  // Update parent without triggering navigation
  useEffect(() => {
    onStepDataUpdate({
      medications: currentMedications
    });
  }, [currentMedications, onStepDataUpdate]);

  return (
    <div className="space-y-8">
      {/* Red Flags */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-5 w-5" />
            {ar ? 'علامات الخطر' : 'Red Flags'}
            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
              {ar ? 'فحص أمان' : 'Safety Check'}
            </Badge>
          </CardTitle>
          <p className="text-sm text-red-700">
            {ar ? 'حدد أي أعراض تحذيرية قد تتطلب انتباه طبي فوري' : 'Check any warning signs that may require immediate medical attention'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskFactors.map((risk) => (
              <div 
                key={risk} 
                className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  selectedRisks.includes(risk) 
                    ? 'bg-red-100 border-red-300 shadow-md' 
                    : 'bg-white border-red-200 hover:border-red-300'
                }`}
                onClick={() => toggleRisk(risk)}
              >
                <Checkbox
                  id={risk}
                  checked={selectedRisks.includes(risk)}
                  onCheckedChange={() => toggleRisk(risk)}
                  className="mt-1"
                />
                <Label htmlFor={risk} className="text-sm text-red-800 cursor-pointer flex-1">
                  {risk}
                </Label>
              </div>
            ))}
          </div>

          {/* Help note */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              {ar ? 'إذا كان أي من هذه ينطبق عليك، سيقوم أخصائيك بالمراجعة قبل المتابعة.' : 'If any of these apply, your therapist will review before proceeding.'}
            </p>
          </div>

          {selectedRisks.length > 0 && (
            <div className="bg-red-100 p-4 rounded-lg border border-red-300">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {ar ? 'علامات خطر محددة:' : 'Selected warning signs:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedRisks.map((risk) => (
                  <Badge key={risk} variant="destructive" className="text-xs">
                    {risk}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Pill className="h-5 w-5" />
            {ar ? 'الأدوية الحالية' : 'Current Medications'}
          </CardTitle>
          <p className="text-sm text-purple-700">
            {ar ? 'أضف الأدوية التي تتناولها حالياً (اختياري ولكن مهم للتفاعلات)' : 'Add medications you are currently taking (optional but important for interactions)'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Add Common Medications */}
          <div>
            <Label className="text-purple-800 font-medium mb-2 block">
              {ar ? 'إضافة سريعة:' : 'Quick add:'}
            </Label>
            <div className="flex flex-wrap gap-2">
              {commonMedications.map((med) => (
                <Button
                  key={med}
                  variant="outline"
                  size="sm"
                  onClick={() => addQuickMedication(med)}
                  className="text-purple-700 border-purple-300 hover:bg-purple-100"
                  disabled={currentMedications.some(m => m.name === med)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {med}
                </Button>
              ))}
            </div>
          </div>

          {/* Manual Add with enhanced fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-purple-800 font-medium">
                  {ar ? 'اسم الدواء' : 'Medication Name'}
                </Label>
                <Input
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  placeholder={ar ? 'مثال: باراسيتامول' : 'Example: Paracetamol'}
                  onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                  className="mt-1 bg-white border-purple-300"
                />
              </div>
              <div>
                <Label className="text-purple-800 font-medium">
                  {ar ? 'الجرعة' : 'Dose'}
                </Label>
                <Input
                  value={newMedication.dose}
                  onChange={(e) => setNewMedication({...newMedication, dose: e.target.value})}
                  placeholder={ar ? 'مثال: 500 مجم' : 'Example: 500mg'}
                  onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                  className="mt-1 bg-white border-purple-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-purple-800 font-medium">
                  {ar ? 'التكرار' : 'Frequency'}
                </Label>
                <Select 
                  value={newMedication.frequency} 
                  onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}
                >
                  <SelectTrigger className="mt-1 bg-white border-purple-300">
                    <SelectValue placeholder={ar ? 'اختر التكرار' : 'Select frequency'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="anticoagulant"
                  checked={newMedication.isAnticoagulant}
                  onCheckedChange={(checked) => setNewMedication({...newMedication, isAnticoagulant: !!checked})}
                />
                <Label htmlFor="anticoagulant" className="text-purple-800 cursor-pointer text-sm">
                  {ar ? 'هذا الدواء مميع للدم (مضاد تخثر)' : 'This medication is a blood thinner (anticoagulant)'}
                </Label>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={addMedication} 
            disabled={!newMedication.name.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {ar ? 'إضافة دواء' : 'Add Medication'}
          </Button>
          
          {/* Medications List */}
          {currentMedications.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-purple-800">
                {ar ? 'الأدوية المضافة:' : 'Added medications:'}
              </h4>
              <div className="space-y-2">
                {currentMedications.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-purple-900">{med.name}</span>
                        {med.anticoagulant && (
                          <Badge variant="destructive" className="text-xs">
                            {ar ? 'مميع دم' : 'Blood thinner'}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-purple-600 mt-1">
                        {med.dose && <span>{med.dose}</span>}
                        {med.dose && med.frequency && <span> • </span>}
                        {med.frequency && (
                          <span>{frequencyOptions.find(f => f.value === med.frequency)?.label || med.frequency}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeMedication(med.id)}
                      className="text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors ml-2"
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
    </div>
  );
}