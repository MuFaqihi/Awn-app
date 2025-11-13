// src/components/medical-history/setup/SetupSnapshot.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calendar, Zap } from 'lucide-react';
import type { Locale } from '@/lib/types';

interface Props {
  locale: Locale;
  onStepDataUpdate: (data: any) => void;
  stepData?: any;
}

export default function SetupSnapshot({ locale, onStepDataUpdate, stepData = {} }: Props) {
  const ar = locale === 'ar';
  const [painScore, setPainScore] = useState([stepData.painScore || 0]);
  const [functionalLimits, setFunctionalLimits] = useState<string[]>(stepData.functionalLimits || []);
  const [primaryConcern, setPrimaryConcern] = useState(stepData.primaryConcern || '');
  const [onsetType, setOnsetType] = useState<string>(stepData.onsetType || '');
  const [onsetDate, setOnsetDate] = useState(stepData.onsetDate || '');
  const [cause, setCause] = useState(stepData.cause || '');
  const [otherLimitation, setOtherLimitation] = useState('');

  const functionalOptions = ar ? [
    'المشي', 'صعود الدرج', 'رفع الأشياء', 'الجلوس أكثر من 30 دقيقة', 'النوم', 'العمل'
  ] : [
    'Walking', 'Stairs', 'Lifting', 'Sitting >30min', 'Sleeping', 'Working'
  ];

  const toggleLimit = useCallback((limit: string) => {
    setFunctionalLimits(prev => 
      prev.includes(limit) 
        ? prev.filter(l => l !== limit)
        : [...prev, limit]
    );
  }, []);

  const addOtherLimitation = useCallback(() => {
    if (otherLimitation.trim() && !functionalLimits.includes(otherLimitation.trim())) {
      setFunctionalLimits(prev => [...prev, otherLimitation.trim()]);
      setOtherLimitation('');
    }
  }, [otherLimitation, functionalLimits]);

  const handleYearInput = useCallback((value: string) => {
    // Only allow digits and limit to 4 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 4);
    setOnsetDate(digitsOnly);
  }, []);

  const getPainColor = (score: number) => {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPainBg = (score: number) => {
    if (score <= 3) return 'bg-green-50 border-green-200';
    if (score <= 6) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getPainLabel = (score: number) => {
    if (score === 0) return ar ? 'لا ألم' : 'No pain';
    if (score <= 3) return ar ? 'ألم خفيف' : 'Mild pain';
    if (score <= 6) return ar ? 'ألم متوسط' : 'Moderate pain';
    return ar ? 'ألم شديد' : 'Severe pain';
  };

  // Update parent without triggering navigation
  useEffect(() => {
    const data = {
      primaryConcern,
      onsetType,
      onsetDate,
      cause,
      painScore: painScore[0],
      functionalLimits
    };
    onStepDataUpdate(data);
  }, [primaryConcern, onsetType, onsetDate, cause, painScore, functionalLimits, onStepDataUpdate]);

  return (
    <div className="space-y-8">
      {/* Primary Concern */}
      <Card className="border-teal-200 bg-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-900">
            <AlertCircle className="h-5 w-5" />
            {ar ? 'المشكلة الأساسية' : 'Primary Concern'}
            <Badge variant="destructive" className="text-xs text-red-600 bg-red-50 border-red-200">
              {ar ? 'مطلوب' : 'Required'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-sm font-medium text-teal-800 mb-2 block">
              {ar ? 'اشرح المشكلة التي تواجهها بالتفصيل' : 'Describe the problem you\'re facing in detail'}
            </Label>
            <Textarea
              value={primaryConcern}
              onChange={(e) => setPrimaryConcern(e.target.value)}
              placeholder={ar ? 'مثال: ألم في أسفل الظهر منذ أسبوعين بسبب رفع شيء ثقيل. يزداد الألم عند الجلوس ويخف عند المشي...' : 'Example: Lower back pain for two weeks after lifting something heavy. Pain worsens when sitting and improves when walking...'}
              className="w-full resize-y max-h-64 overflow-auto bg-white border-teal-300 focus:border-teal-500 min-h-[120px]"
              rows={5}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${primaryConcern.length >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                {primaryConcern.length} {ar ? 'حرف' : 'characters'} 
                {primaryConcern.length < 100 && ` (${ar ? 'الحد الأدنى' : 'minimum'} 100)`}
              </span>
              {primaryConcern.length > 0 && primaryConcern.length < 100 && (
                <span className="text-xs text-orange-600">
                  {ar ? 'يرجى إضافة المزيد من التفاصيل' : 'Please add more details'}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onset Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {ar ? 'معلومات البداية' : 'Onset Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {ar ? 'تاريخ البداية *' : 'Onset Date *'}
              </Label>
              <Input 
                type="date" 
                value={onsetDate}
                onChange={(e) => setOnsetDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min="1900-01-01"
                className="bg-white border-gray-300"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {ar ? 'نوع البداية *' : 'Onset Type *'}
              </Label>
              <Select value={onsetType} onValueChange={setOnsetType} required>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder={ar ? 'اختر نوع البداية' : 'Select onset type'} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="acute">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-red-500" />
                      {ar ? 'مفاجئ/حاد' : 'Acute/Sudden'}
                    </div>
                  </SelectItem>
                  <SelectItem value="gradual">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                      {ar ? 'تدريجي' : 'Gradual'}
                    </div>
                  </SelectItem>
                  <SelectItem value="insidious">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-500 rounded-full"></div>
                      {ar ? 'خفي/غير محدد' : 'Insidious'}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {ar ? 'السبب (اختياري)' : 'Cause (optional)'}
              </Label>
              <Input 
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                placeholder={ar ? 'مثال: حادث سيارة، إصابة رياضية، غير معروف' : 'e.g., car accident, sports injury, unknown'}
                className="bg-white border-gray-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pain Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {ar ? 'مستوى الألم الحالي' : 'Current Pain Level'}
            </span>
            <div className={`px-4 py-2 rounded-lg border-2 ${getPainBg(painScore[0])}`}>
              <span className={`text-2xl font-bold ${getPainColor(painScore[0])}`}>
                {painScore[0]}/10
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Slider
              value={painScore}
              onValueChange={setPainScore}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{ar ? 'لا ألم' : 'No pain'}</span>
              <span>{ar ? 'أسوأ ألم ممكن' : 'Worst possible pain'}</span>
            </div>
          </div>
          
          <div className={`text-center p-4 rounded-lg border-2 ${getPainBg(painScore[0])}`}>
            <span className={`text-lg font-semibold ${getPainColor(painScore[0])}`}>
              {getPainLabel(painScore[0])}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Functional Limitations */}
      <Card>
        <CardHeader>
          <CardTitle>{ar ? 'القيود الوظيفية' : 'Functional Limitations'}</CardTitle>
          <p className="text-sm text-gray-600">
            {ar ? 'ما هي الأنشطة التي تواجه صعوبة في أدائها؟' : 'What activities do you have difficulty performing?'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {functionalOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleLimit(option)}
                  className={`h-auto py-3 px-4 text-sm transition-all duration-200 rounded-md border-2 ${
                    functionalLimits.includes(option) 
                      ? 'bg-teal-600 text-white border-teal-600 shadow-lg transform scale-105' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Other limitation input */}
            <div className="flex gap-2">
              <Input
                value={otherLimitation}
                onChange={(e) => setOtherLimitation(e.target.value)}
                placeholder={ar ? 'أضف قيد آخر (اختياري)' : 'Other limitation (optional)'}
                className="bg-white border-gray-300"
                onKeyPress={(e) => e.key === 'Enter' && addOtherLimitation()}
              />
              <button
                onClick={addOtherLimitation}
                disabled={!otherLimitation.trim() || functionalLimits.includes(otherLimitation.trim())}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {ar ? 'إضافة' : 'Add'}
              </button>
            </div>
            
            {functionalLimits.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {ar ? 'القيود المحددة:' : 'Selected limitations:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {functionalLimits.map((limit, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-teal-100 text-teal-800 cursor-pointer hover:bg-teal-200"
                      onClick={() => toggleLimit(limit)}
                    >
                      {limit} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}