'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/base-button';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Shield, CheckCircle, AlertTriangle, Edit } from 'lucide-react';
import { format } from 'date-fns';
import type { PhysioConsent, Locale } from '@/lib/types';

interface Props {
  consent: PhysioConsent;
  locale: Locale;
  onUpdate: (consent: PhysioConsent) => void;
}

export default function ConsentSection({ consent, locale, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<PhysioConsent>(consent);
  const [showCalendar, setShowCalendar] = useState(false);
  const ar = locale === 'ar';

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(consent);
    setIsEditing(false);
  };

  const handleConsentChange = (field: keyof PhysioConsent, value: any) => {
    const updatedConsent = { ...editData, [field]: value };
    
    // Auto-set consent date when consent is given
    if (field === 'consentToTreatment' && value === true && !updatedConsent.consentDate) {
      updatedConsent.consentDate = new Date().toISOString().split('T')[0];
    }
    
    setEditData(updatedConsent);
  };

const handleDateSelect = (date: Date | undefined) => {
  if (date) {
    handleConsentChange('consentDate', date.toISOString().split('T')[0]);
    setShowCalendar(false);
  }
};

  const handleSwipeComplete = () => {
    if (editData.consentToTreatment && editData.informedOfRisks) {
      handleSave();
    }
  };

  const isConsentComplete = consent.consentToTreatment && consent.informedOfRisks;

  return (
    <Card id="consent" className="relative">
      {isConsentComplete && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-green-500 text-white rounded-full p-2">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              {ar ? "الموافقة والإقرار" : "Consent & Acknowledgment"}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {ar ? "الموافقة على العلاج والإقرار بالمخاطر" : "Treatment consent and risk acknowledgment"}
            </p>
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
            {/* Treatment Consent */}
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">
                    {ar ? "الموافقة على العلاج" : "Consent to Treatment"}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {ar 
                      ? "أوافق على تلقي العلاج الطبيعي وفقاً للخطة المحددة من قبل المعالج المختص"
                      : "I consent to receive physiotherapy treatment according to the plan determined by the qualified therapist"
                    }
                  </p>
                </div>
                <Switch
                  checked={editData.consentToTreatment}
                  onCheckedChange={(checked) => handleConsentChange('consentToTreatment', checked)}
                />
              </div>
            </div>

            {/* Risk Acknowledgment */}
            <div className="p-4 border rounded-lg bg-amber-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-amber-900">
                    {ar ? "إقرار بالمخاطر" : "Risk Acknowledgment"}
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    {ar 
                      ? "أقر بأنني تم إبلاغي بالمخاطر المحتملة للعلاج الطبيعي وأفهم هذه المخاطر"
                      : "I acknowledge that I have been informed of the potential risks of physiotherapy and understand these risks"
                    }
                  </p>
                </div>
                <Switch
                  checked={editData.informedOfRisks}
                  onCheckedChange={(checked) => handleConsentChange('informedOfRisks', checked)}
                />
              </div>
            </div>

            {/* Consent Date */}
            {editData.consentToTreatment && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {ar ? "تاريخ الموافقة" : "Consent Date"}
                </label>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editData.consentDate ? (
                        format(new Date(editData.consentDate), "PPP")
                      ) : (
                        <span>{ar ? "اختر التاريخ" : "Select date"}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">

                    <Calendar
                      selected={editData.consentDate ? new Date(editData.consentDate) : undefined}
                      onSelect={handleDateSelect}
                      disabled={(date: Date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                {ar ? "جهة الاتصال في حالات الطوارئ" : "Emergency Contact"}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({ar ? "اختياري" : "Optional"})
                </span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    {ar ? "الاسم" : "Name"}
                  </label>
                  <input
                    type="text"
                    value={editData.emergencyContact?.name || ''}
                    onChange={(e) => handleConsentChange('emergencyContact', {
                      ...editData.emergencyContact,
                      name: e.target.value
                    })}
                    className="w-full p-2 border rounded-md"
                    placeholder={ar ? "اسم جهة الاتصال" : "Contact name"}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    {ar ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={editData.emergencyContact?.phone || ''}
                    onChange={(e) => handleConsentChange('emergencyContact', {
                      ...editData.emergencyContact,
                      phone: e.target.value
                    })}
                    className="w-full p-2 border rounded-md"
                    placeholder={ar ? "رقم الهاتف" : "Phone number"}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    {ar ? "صلة القرابة" : "Relationship"}
                  </label>
                  <input
                    type="text"
                    value={editData.emergencyContact?.relationship || ''}
                    onChange={(e) => handleConsentChange('emergencyContact', {
                      ...editData.emergencyContact,
                      relationship: e.target.value
                    })}
                    className="w-full p-2 border rounded-md"
                    placeholder={ar ? "مثل: زوج/ة، أخ/أخت" : "e.g., Spouse, Sibling"}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSwipeComplete}
                disabled={!editData.consentToTreatment || !editData.informedOfRisks}
                className="flex-1"
              >
                {ar ? "احفظ الموافقة" : "Save Consent"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                {ar ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${consent.consentToTreatment ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {consent.consentToTreatment ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${consent.consentToTreatment ? 'text-green-900' : 'text-red-900'}`}>
                    {ar ? "الموافقة على العلاج" : "Treatment Consent"}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${consent.consentToTreatment ? 'text-green-700' : 'text-red-700'}`}>
                  {consent.consentToTreatment 
                    ? (ar ? "تم منح الموافقة" : "Consent granted")
                    : (ar ? "لم يتم منح الموافقة" : "Consent not granted")
                  }
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${consent.informedOfRisks ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {consent.informedOfRisks ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${consent.informedOfRisks ? 'text-green-900' : 'text-red-900'}`}>
                    {ar ? "إقرار بالمخاطر" : "Risk Acknowledgment"}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${consent.informedOfRisks ? 'text-green-700' : 'text-red-700'}`}>
                  {consent.informedOfRisks 
                    ? (ar ? "تم الإقرار بالمخاطر" : "Risks acknowledged")
                    : (ar ? "لم يتم الإقرار بالمخاطر" : "Risks not acknowledged")
                  }
                </p>
              </div>
            </div>

            {/* Consent Date */}
            {consent.consentDate && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {ar ? "تاريخ الموافقة" : "Consent Date"}
                </label>
                <p className="text-gray-900 mt-1">
                  {new Date(consent.consentDate).toLocaleDateString(ar ? 'ar-SA' : 'en-US')}
                </p>
              </div>
            )}

            {/* Emergency Contact */}
            {consent.emergencyContact && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {ar ? "جهة الاتصال في حالات الطوارئ" : "Emergency Contact"}
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">{ar ? "الاسم:" : "Name:"}</span>
                      <p className="text-gray-900">{consent.emergencyContact.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{ar ? "الهاتف:" : "Phone:"}</span>
                      <p className="text-gray-900">{consent.emergencyContact.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{ar ? "العلاقة:" : "Relationship:"}</span>
                      <p className="text-gray-900">{consent.emergencyContact.relationship}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warning if incomplete */}
            {!isConsentComplete && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">
                    {ar ? "الموافقة غير مكتملة" : "Consent Incomplete"}
                  </span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  {ar 
                    ? "يجب الموافقة على العلاج والإقرار بالمخاطر لبدء العلاج"
                    : "Treatment consent and risk acknowledgment are required to begin therapy"
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}