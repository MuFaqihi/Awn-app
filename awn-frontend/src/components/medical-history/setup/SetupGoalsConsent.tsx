// src/components/medical-history/setup/SetupGoalsConsent.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target, Shield, Clock, Trophy, AlertCircle, MapPin, Monitor, Home } from 'lucide-react';
import type { Locale, Goals, Consent } from '@/lib/types';

interface Props {
  locale: Locale;
  onStepDataUpdate: (data: { goals: Goals; consent: Consent; sessionPreference: string }) => void;
  stepData?: { goals?: Goals; consent?: Consent; sessionPreference?: string };
}

export default function SetupGoalsConsent({ locale, onStepDataUpdate, stepData = {} }: Props) {
  const ar = locale === 'ar';
  const [shortTermGoals, setShortTermGoals] = useState(stepData.goals?.shortTerm?.join('\n') || '');
  const [longTermGoals, setLongTermGoals] = useState(stepData.goals?.longTerm?.join('\n') || '');
  const [selectedSessionPreference, setSelectedSessionPreference] = useState(stepData.sessionPreference || '');
  const [consentToTreatment, setConsentToTreatment] = useState(stepData.consent?.consentToTreatment || false);

  const sessionOptions = ar ? [
    { value: 'online', label: 'جلسات أونلاين', icon: Monitor, description: 'جلسات عبر الفيديو من المنزل' },
    { value: 'clinic', label: 'في العيادة', icon: MapPin, description: 'زيارة العيادة الطبية' },
    { value: 'home', label: 'زيارة منزلية', icon: Home, description: 'أخصائي يأتي إلى منزلك' }
  ] : [
    { value: 'online', label: 'Online Sessions', icon: Monitor, description: 'Video sessions from home' },
    { value: 'clinic', label: 'Clinic Visit', icon: MapPin, description: 'Visit the medical clinic' },
    { value: 'home', label: 'Home Visit', icon: Home, description: 'Therapist comes to your home' }
  ];

  // Update parent without triggering navigation
  useEffect(() => {
    const goalsData: Goals = {
      shortTerm: shortTermGoals.split('\n').filter(goal => goal.trim()),
      longTerm: longTermGoals.split('\n').filter(goal => goal.trim()),
      functionalGoals: [
        ...shortTermGoals.split('\n').filter(goal => goal.trim()),
        ...longTermGoals.split('\n').filter(goal => goal.trim())
      ]
    };

    const consentData: Consent = {
      consentToTreatment,
      informedOfRisks: consentToTreatment, // Auto-check if consenting to treatment
      shareWithAssignedTherapist: consentToTreatment, // Auto-check if consenting to treatment
      consentDate: consentToTreatment ? new Date().toISOString() : undefined
    };

    onStepDataUpdate({
      goals: goalsData,
      consent: consentData,
      sessionPreference: selectedSessionPreference
    });
  }, [shortTermGoals, longTermGoals, consentToTreatment, selectedSessionPreference, onStepDataUpdate]);

  const handleConsentChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      setConsentToTreatment(checked);
    }
  };

  return (
    <div className="space-y-8">
      {/* Short-term Goals */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Clock className="h-5 w-5" />
            {ar ? 'الأهداف قصيرة المدى' : 'Short-term Goals'}
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              {ar ? '1-4 أسابيع' : '1-4 weeks'}
            </Badge>
          </CardTitle>
          <p className="text-sm text-blue-700">
            {ar ? 'ما تريد تحقيقه في الأسابيع القليلة القادمة (اختياري)' : 'What you want to achieve in the next few weeks (optional)'}
          </p>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-blue-800 font-medium mb-2 block">
              {ar ? 'اكتب كل هدف في سطر منفصل' : 'Write each goal on a separate line'}
            </Label>
            <Textarea
              value={shortTermGoals}
              onChange={(e) => setShortTermGoals(e.target.value)}
              placeholder={ar ? 'مثال:\nتقليل الألم إلى 3/10\nتحسين النوم\nالمشي لمدة 15 دقيقة بدون ألم' : 'Example:\nReduce pain to 3/10\nImprove sleep quality\nWalk for 15 minutes without pain'}
              className="w-full resize-y max-h-64 overflow-auto bg-white border-blue-300 focus:border-blue-500 min-h-[100px]"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Long-term Goals */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Trophy className="h-5 w-5" />
            {ar ? 'الأهداف طويلة المدى' : 'Long-term Goals'}
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              {ar ? '1-3 أشهر' : '1-3 months'}
            </Badge>
          </CardTitle>
          <p className="text-sm text-green-700">
            {ar ? 'أهدافك النهائية للعلاج والتأهيل (اختياري)' : 'Your ultimate treatment and rehabilitation goals (optional)'}
          </p>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-green-800 font-medium mb-2 block">
              {ar ? 'اكتب كل هدف في سطر منفصل' : 'Write each goal on a separate line'}
            </Label>
            <Textarea
              value={longTermGoals}
              onChange={(e) => setLongTermGoals(e.target.value)}
              placeholder={ar ? 'مثال:\nالعودة إلى ممارسة الرياضة\nرفع الأوزان الثقيلة\nالعيش بدون ألم\nتحسين اللياقة العامة' : 'Example:\nReturn to sports\nLift heavy objects\nLive pain-free\nImprove overall fitness'}
              className="w-full resize-y max-h-64 overflow-auto bg-white border-green-300 focus:border-green-500 min-h-[100px]"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Session Preference */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <Target className="h-5 w-5" />
            {ar ? 'تفضيل الجلسات' : 'Session Preference'}
          </CardTitle>
          <p className="text-sm text-orange-700">
            {ar ? 'كيف تفضل تلقي جلسات العلاج الطبيعي؟ (اختياري)' : 'How would you prefer to receive physiotherapy sessions? (optional)'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessionOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedSessionPreference(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedSessionPreference === option.value
                      ? 'bg-orange-100 border-orange-400 shadow-md'
                      : 'bg-white border-orange-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className={`h-5 w-5 ${
                      selectedSessionPreference === option.value ? 'text-orange-600' : 'text-orange-500'
                    }`} />
                    <span className={`font-medium ${
                      selectedSessionPreference === option.value ? 'text-orange-900' : 'text-orange-800'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                  <p className="text-sm text-orange-600">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Consent */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Shield className="h-5 w-5" />
            {ar ? 'الموافقة على العلاج' : 'Treatment Consent'}
            <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
              {ar ? 'مطلوب' : 'Required'}
            </Badge>
          </CardTitle>
          <p className="text-sm text-purple-700">
            {ar ? 'موافقتك مطلوبة لبدء العلاج وضمان الخصوصية' : 'Your consent is required to begin treatment and ensure privacy'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-4 rounded-lg border-2 transition-all ${
            consentToTreatment ? 'bg-green-50 border-green-300' : 'bg-white border-purple-300'
          }`}>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={consentToTreatment}
                onCheckedChange={handleConsentChange}
                className="mt-1"
              />
              <div className="grid gap-2 leading-none flex-1">
                <Label htmlFor="consent" className="text-sm font-medium text-purple-900 cursor-pointer">
                  {ar ? 'أوافق على تلقي العلاج الطبيعي واستخدام بياناتي للرعاية' : 'I consent to receive physiotherapy treatment and the use of my data for care'}
                </Label>
                <div className="text-xs text-purple-700 space-y-1">
                  <p>{ar ? '• موافقتك تسمح للأخصائي ببدء العلاج وتقديم الرعاية المناسبة' : '• Your consent allows the therapist to begin treatment and provide appropriate care'}</p>
                  <p>{ar ? '• تم إبلاغك بالمخاطر المحتملة للعلاج الطبيعي (ألم مؤقت أو تعب)' : '• You have been informed of potential risks of physiotherapy (temporary soreness or fatigue)'}</p>
                  <p>{ar ? '• معلوماتك محمية وآمنة ولن تُشارك إلا مع الأخصائي المسؤول عن علاجك' : '• Your information is protected and secure, shared only with your assigned therapist'}</p>
                </div>
              </div>
            </div>
          </div>

          {!consentToTreatment && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                {ar ? 'الموافقة على العلاج مطلوبة لإنهاء الإعداد' : 'Treatment consent is required to complete setup'}
              </span>
            </div>
          )}

          {consentToTreatment && (
            <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-teal-600" />
                <span className="text-sm text-teal-800">
                  {ar ? 'جاهز لإنهاء الإعداد!' : 'Ready to complete setup!'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}