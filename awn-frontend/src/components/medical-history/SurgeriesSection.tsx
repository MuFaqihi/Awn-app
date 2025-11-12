/*'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/base-button';
import { Badge } from '@/components/ui/badge';
import { PopoverForm } from '@/components/ui/popover-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPicker } from '@/components/ui/calendar-picker';
import { Scalpel, Calendar, User, Plus, Edit, Trash2 } from 'lucide-react';
import type { PhysioSurgery, Locale } from '@/lib/types';

interface Props {
  surgeries: PhysioSurgery[];
  locale: Locale;
  onUpdate: (surgeries: PhysioSurgery[]) => void;
}

export default function SurgeriesSection({ surgeries, locale, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<PhysioSurgery[]>(surgeries);
  const ar = locale === 'ar';

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(surgeries);
    setIsEditing(false);
  };

  const addSurgery = (surgeryData: any) => {
    const newSurgery: PhysioSurgery = {
      id: `surgery_${Date.now()}`,
      procedure: surgeryData.procedure,
      bodyPart: surgeryData.bodyPart,
      date: surgeryData.date,
      surgeon: surgeryData.surgeon,
      complications: surgeryData.complications,
      currentStatus: surgeryData.currentStatus || 'healed',
      authoredBy: 'user'
    };
    setEditData([...editData, newSurgery]);
  };

  const removeSurgery = (id: string) => {
    setEditData(editData.filter(surgery => surgery.id !== id));
  };

  const updateSurgery = (id: string, updates: Partial<PhysioSurgery>) => {
    setEditData(editData.map(surgery => 
      surgery.id === id ? { ...surgery, ...updates } : surgery
    ));
  };

  const procedureOptions = [
    ar ? 'جراحة الرباط الصليبي' : 'ACL Reconstruction',
    ar ? 'استبدال مفصل الركبة' : 'Knee Replacement',
    ar ? 'استبدال مفصل الورك' : 'Hip Replacement',
    ar ? 'جراحة العمود الفقري' : 'Spinal Surgery',
    ar ? 'إصلاح الغضروف المفصلي' : 'Meniscus Repair',
    ar ? 'جراحة الكتف' : 'Shoulder Surgery',
    ar ? 'جراحة الكاحل' : 'Ankle Surgery',
    ar ? 'إزالة الغضروف' : 'Arthroscopy',
    ar ? 'تثبيت الكسر' : 'Fracture Fixation'
  ];

  const bodyPartOptions = [
    ar ? 'الركبة' : 'Knee',
    ar ? 'الورك' : 'Hip',
    ar ? 'الكتف' : 'Shoulder',
    ar ? 'الكاحل' : 'Ankle',
    ar ? 'الرسغ' : 'Wrist',
    ar ? 'المرفق' : 'Elbow',
    ar ? 'العمود الفقري' : 'Spine',
    ar ? 'القدم' : 'Foot',
    ar ? 'اليد' : 'Hand'
  ];

  const statusOptions = [
    { value: 'healing', label: ar ? 'في طور الشفاء' : 'Healing', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { value: 'healed', label: ar ? 'تم الشفاء' : 'Healed', color: 'bg-green-50 text-green-700 border-green-200' },
    { value: 'complications', label: ar ? 'مضاعفات' : 'Complications', color: 'bg-red-50 text-red-700 border-red-200' }
  ];

  const getStatusBadge = (status: string) => {
    const statusInfo = statusOptions.find(s => s.value === status);
    return statusInfo ? { label: statusInfo.label, className: statusInfo.color } : { label: status, className: '' };
  };

  return (
    <Card id="surgeries" className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scalpel className="h-5 w-5 text-blue-600" />
              {ar ? "العمليات الجراحية والاستشفاء" : "Surgeries & Hospitalizations"}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {ar ? "تاريخ العمليات الجراحية والحالة الحالية" : "Surgical history and current status"}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <PopoverForm
                trigger={
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    {ar ? "إضافة عملية" : "Add Surgery"}
                  </Button>
                }
                title={ar ? "إضافة عملية جراحية" : "Add Surgery"}
                onSubmit={addSurgery}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      {ar ? "نوع العملية *" : "Procedure *"}
                    </label>
                    <Select name="procedure" required>
                      <SelectTrigger>
                        <SelectValue placeholder={ar ? "اختر نوع العملية" : "Select procedure"} />
                      </SelectTrigger>
                      <SelectContent>
                        {procedureOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      {ar ? "جزء الجسم *" : "Body Part *"}
                    </label>
                    <Select name="bodyPart" required>
                      <SelectTrigger>
                        <SelectValue placeholder={ar ? "اختر جزء الجسم" : "Select body part"} />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyPartOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">
                      {ar ? "تاريخ العملية" : "Surgery Date"}
                    </label>
                    <input
                      type="date"
                      name="date"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">
                      {ar ? "اسم الجراح" : "Surgeon Name"}
                    </label>
                    <input
                      type="text"
                      name="surgeon"
                      className="w-full p-2 border rounded-md"
                      placeholder={ar ? "اسم الجراح" : "Surgeon name"}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">
                      {ar ? "الحالة الحالية *" : "Current Status *"}
                    </label>
                    <Select name="currentStatus" defaultValue="healed" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">
                      {ar ? "المضاعفات" : "Complications"}
                    </label>
                    <textarea
                      name="complications"
                      className="w-full p-2 border rounded-md resize-none"
                      rows={2}
                      placeholder={ar ? "اذكر أي مضاعفات..." : "Describe any complications..."}
                    />
                  </div>
                </div>
              </PopoverForm>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-1" />
              {ar ? "تعديل" : "Edit"}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {editData.length === 0 ? (
          <div className="text-center py-8">
            <Scalpel className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {ar ? "لم يتم تسجيل أي عمليات جراحية" : "No surgeries recorded"}
            </p>
            <PopoverForm
              trigger={
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  {ar ? "إضافة العملية الأولى" : "Add First Surgery"}
                </Button>
              }
              title={ar ? "إضافة عملية جراحية" : "Add Surgery"}
              onSubmit={addSurgery}
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    {ar ? "نوع العملية *" : "Procedure *"}
                  </label>
                  <Select name="procedure" required>
                    <SelectTrigger>
                      <SelectValue placeholder={ar ? "اختر نوع العملية" : "Select procedure"} />
                    </SelectTrigger>
                    <SelectContent>
                      {procedureOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    {ar ? "جزء الجسم *" : "Body Part *"}
                  </label>
                  <Select name="bodyPart" required>
                    <SelectTrigger>
                      <SelectValue placeholder={ar ? "اختر جزء الجسم" : "Select body part"} />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyPartOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">
                    {ar ? "تاريخ العملية" : "Surgery Date"}
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">
                    {ar ? "الحالة الحالية *" : "Current Status *"}
                  </label>
                  <Select name="currentStatus" defaultValue="healed" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverForm>
          </div>
        ) : (
          <div className="space-y-4">
            {editData.map((surgery) => {
              const statusBadge = getStatusBadge(surgery.currentStatus);
              return (
                <div key={surgery.id} className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-lg">{surgery.procedure}</h4>
                        <Badge variant="outline" className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{ar ? "جزء الجسم:" : "Body part:"}</span>
                          <span className="font-medium">{surgery.bodyPart}</span>
                        </div>
                        
                        {surgery.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{ar ? "التاريخ:" : "Date:"}</span>
                            <span className="font-medium">
                              {new Date(surgery.date).toLocaleDateString(ar ? 'ar-SA' : 'en-US')}
                            </span>
                          </div>
                        )}
                        
                        {surgery.surgeon && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{ar ? "الجراح:" : "Surgeon:"}</span>
                            <span className="font-medium">{surgery.surgeon}</span>
                          </div>
                        )}
                      </div>

                      {surgery.complications && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-800">
                            <span className="font-medium">{ar ? "المضاعفات: " : "Complications: "}</span>
                            {surgery.complications}
                          </p>
                        </div>
                      )}
                    </div>

                    {isEditing && surgery.authoredBy === 'user' && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSurgery(surgery.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isEditing && (
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSave}>
                  {ar ? "حفظ التغييرات" : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  {ar ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}*/