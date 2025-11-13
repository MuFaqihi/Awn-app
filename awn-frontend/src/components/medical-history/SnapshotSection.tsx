'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/base-button';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/ui/border-beam';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Edit, Plus, X, Calendar } from 'lucide-react';
import type { Snapshot, Locale } from '@/lib/types';

interface Props {
  snapshot: Snapshot;
  locale: Locale;
  onUpdate: (snapshot: Snapshot) => void;
}

export default function SnapshotSection({ snapshot, locale, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Snapshot>(snapshot);
  const [showFunctionalPopover, setShowFunctionalPopover] = useState(false);
  const [showPrecautionsPopover, setShowPrecautionsPopover] = useState(false);
  const [selectedFunctionalLimit, setSelectedFunctionalLimit] = useState('');
  const [selectedPrecaution, setSelectedPrecaution] = useState('');
  const ar = locale === 'ar';

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(snapshot);
    setIsEditing(false);
  };

  const addFunctionalLimit = (limit: string) => {
    if (limit && !editData.functionalLimits.includes(limit)) {
      setEditData({
        ...editData,
        functionalLimits: [...editData.functionalLimits, limit]
      });
      setSelectedFunctionalLimit('');
      setShowFunctionalPopover(false);
    }
  };

  const removeFunctionalLimit = (index: number) => {
    setEditData({
      ...editData,
      functionalLimits: editData.functionalLimits.filter((_, i) => i !== index)
    });
  };

  const addPrecaution = (precaution: string) => {
    if (precaution && !editData.precautions.includes(precaution)) {
      setEditData({
        ...editData,
        precautions: [...editData.precautions, precaution]
      });
      setSelectedPrecaution('');
      setShowPrecautionsPopover(false);
    }
  };

  const removePrecaution = (index: number) => {
    setEditData({
      ...editData,
      precautions: editData.precautions.filter((_, i) => i !== index)
    });
  };

  const getPainColor = (score: number) => {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPainLabel = (score: number) => {
    if (score === 0) return ar ? 'لا ألم' : 'No pain';
    if (score <= 3) return ar ? 'ألم خفيف' : 'Mild';
    if (score <= 6) return ar ? 'ألم متوسط' : 'Moderate';
    return ar ? 'ألم شديد' : 'Severe';
  };

  const functionalLimitOptions = [
    ar ? 'الانحناء' : 'Bending',
    ar ? 'الرفع' : 'Lifting',
    ar ? 'الجلوس المطول' : 'Prolonged sitting',
    ar ? 'الوقوف المطول' : 'Prolonged standing',
    ar ? 'المشي' : 'Walking',
    ar ? 'صعود الدرج' : 'Climbing stairs',
    ar ? 'النوم' : 'Sleeping',
    ar ? 'القيادة' : 'Driving'
  ];

  const precautionOptions = [
    ar ? 'قيود تحمل الوزن' : 'Weight-bearing restrictions',
    ar ? 'قيود نطاق الحركة' : 'Range of motion restrictions',
    ar ? 'تجنب الالتواء' : 'Avoid twisting',
    ar ? 'تجنب الرفع الثقيل' : 'Avoid heavy lifting',
    ar ? 'استخدام المساعدات' : 'Use assistive devices'
  ];

  return (
    <Card id="snapshot" className="relative">
      <BorderBeam size={250} duration={12} delay={9} />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {ar ? "لمحة عامة" : "Patient Snapshot"}
              <Badge variant="outline" className="text-xs">
                {ar ? "الشكوى الأساسية" : "Chief Complaint"}
              </Badge>
            </CardTitle>
            <CardDescription>
              {ar ? "المعلومات الأساسية عن الحالة الحالية" : "Essential information about current condition"}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-1" />
            {ar ? "تعديل" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            {/* Primary Concern */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "الشكوى الأساسية *" : "Primary Concern *"}
              </label>
              <textarea
                value={editData.primaryConcern}
                onChange={(e) => setEditData({ ...editData, primaryConcern: e.target.value })}
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                placeholder={ar ? "اكتب الشكوى الأساسية..." : "Describe the main complaint..."}
              />
            </div>

            {/* Pain Score */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "درجة الألم (0-10) *" : "Pain Score (0-10) *"}
              </label>
              <div className="space-y-4">
                <Slider
                  value={[editData.painScore]}
                  onValueChange={(value) => setEditData({ ...editData, painScore: value[0] })}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className={`text-2xl font-bold ${getPainColor(editData.painScore)}`}>
                    {editData.painScore}
                  </span>
                  <span className={getPainColor(editData.painScore)}>
                    {getPainLabel(editData.painScore)}
                  </span>
                </div>
              </div>
            </div>

            {/* Onset Type and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {ar ? "نوع البداية" : "Onset Type"}
                </label>
                <Select
                  value={editData.onsetType || ''}
                  onValueChange={(value) => setEditData({ ...editData, onsetType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={ar ? "اختر نوع البداية" : "Select onset type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acute">{ar ? "حاد" : "Acute"}</SelectItem>
                    <SelectItem value="gradual">{ar ? "تدريجي" : "Gradual"}</SelectItem>
                    <SelectItem value="insidious">{ar ? "خفي" : "Insidious"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {ar ? "تاريخ البداية" : "Onset Date"}
                </label>
                <input
                  type="date"
                  value={editData.onsetDate || ''}
                  onChange={(e) => setEditData({ ...editData, onsetDate: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Mechanism */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "آلية الإصابة" : "Mechanism of Injury"}
              </label>
              <textarea
                value={editData.mechanism || ''}
                onChange={(e) => setEditData({ ...editData, mechanism: e.target.value })}
                className="w-full p-3 border rounded-lg resize-none"
                rows={2}
                placeholder={ar ? "كيف حدثت الإصابة؟" : "How did the injury occur?"}
              />
            </div>

            {/* Functional Limitations */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "القيود الوظيفية" : "Functional Limitations"}
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editData.functionalLimits.map((limit, index) => (
                    <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {limit}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeFunctionalLimit(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Popover open={showFunctionalPopover} onOpenChange={setShowFunctionalPopover}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      {ar ? "إضافة قيد" : "Add Limitation"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">{ar ? "إضافة قيد وظيفي" : "Add Functional Limitation"}</h3>
                      <Select value={selectedFunctionalLimit} onValueChange={setSelectedFunctionalLimit}>
                        <SelectTrigger>
                          <SelectValue placeholder={ar ? "اختر قيد" : "Select limitation"} />
                        </SelectTrigger>
                        <SelectContent>
                          {functionalLimitOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addFunctionalLimit(selectedFunctionalLimit)} 
                          disabled={!selectedFunctionalLimit}
                          size="sm"
                        >
                          {ar ? "إضافة" : "Add"}
                        </Button>
                        <Button variant="outline" onClick={() => setShowFunctionalPopover(false)} size="sm">
                          {ar ? "إلغاء" : "Cancel"}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Precautions */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "الاحتياطات" : "Precautions"}
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editData.precautions.map((precaution, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {precaution}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removePrecaution(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Popover open={showPrecautionsPopover} onOpenChange={setShowPrecautionsPopover}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      {ar ? "إضافة احتياط" : "Add Precaution"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">{ar ? "إضافة احتياط" : "Add Precaution"}</h3>
                      <Select value={selectedPrecaution} onValueChange={setSelectedPrecaution}>
                        <SelectTrigger>
                          <SelectValue placeholder={ar ? "اختر احتياط" : "Select precaution"} />
                        </SelectTrigger>
                        <SelectContent>
                          {precautionOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addPrecaution(selectedPrecaution)} 
                          disabled={!selectedPrecaution}
                          size="sm"
                        >
                          {ar ? "إضافة" : "Add"}
                        </Button>
                        <Button variant="outline" onClick={() => setShowPrecautionsPopover(false)} size="sm">
                          {ar ? "إلغاء" : "Cancel"}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave}>
                {ar ? "حفظ التغييرات" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                {ar ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Primary Concern */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                {ar ? "الشكوى الأساسية" : "Primary Concern"}
              </label>
              <p className="text-gray-900 mt-1 text-lg">{snapshot.primaryConcern}</p>
            </div>

            {/* Pain Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {ar ? "درجة الألم" : "Pain Score"}
                </label>
                <div className="flex flex-col items-center">
                  <span className={`text-4xl font-bold ${getPainColor(snapshot.painScore)}`}>
                    {snapshot.painScore}
                  </span>
                  <span className="text-sm text-gray-500">/10</span>
                  <span className={`text-sm font-medium ${getPainColor(snapshot.painScore)}`}>
                    {getPainLabel(snapshot.painScore)}
                  </span>
                </div>
              </div>

              {snapshot.onsetType && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {ar ? "نوع البداية" : "Onset Type"}
                  </label>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {snapshot.onsetType === 'acute' 
                      ? (ar ? 'حاد' : 'Acute')
                      : snapshot.onsetType === 'gradual'
                      ? (ar ? 'تدريجي' : 'Gradual')
                      : (ar ? 'خفي' : 'Insidious')
                    }
                  </Badge>
                </div>
              )}

              {snapshot.onsetDate && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {ar ? "تاريخ البداية" : "Onset Date"}
                  </label>
                  <p className="text-lg font-medium">
                    {new Date(snapshot.onsetDate).toLocaleDateString(ar ? 'ar-SA' : 'en-US')}
                  </p>
                </div>
              )}
            </div>

            {/* Mechanism */}
            {snapshot.mechanism && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {ar ? "آلية الإصابة" : "Mechanism of Injury"}
                </label>
                <p className="text-gray-900 mt-1">{snapshot.mechanism}</p>
              </div>
            )}

            {/* Functional Limitations */}
            {snapshot.functionalLimits.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {ar ? "القيود الوظيفية" : "Functional Limitations"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {snapshot.functionalLimits.map((limit, index) => (
                    <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {limit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Precautions */}
            {snapshot.precautions.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {ar ? "الاحتياطات" : "Precautions"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {snapshot.precautions.map((precaution, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {precaution}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}