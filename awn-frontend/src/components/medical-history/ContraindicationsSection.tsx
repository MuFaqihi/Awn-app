'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/base-button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield, Plus, X, Edit } from 'lucide-react';
import type { PhysioContraindications, Locale } from '@/lib/types';

interface Props {
  contraindications: PhysioContraindications;
  locale: Locale;
  onUpdate: (contraindications: PhysioContraindications) => void;
}

export default function ContraindicationsSection({ contraindications, locale, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<PhysioContraindications>(contraindications);
  const [showAbsolutePopover, setShowAbsolutePopover] = useState(false);
  const [showRelativePopover, setShowRelativePopover] = useState(false);
  const [selectedAbsolute, setSelectedAbsolute] = useState('');
  const [selectedRelative, setSelectedRelative] = useState('');
  const ar = locale === 'ar';

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(contraindications);
    setIsEditing(false);
  };

  const addAbsolute = (item: string) => {
    if (item && !editData.absolute.includes(item)) {
      setEditData({
        ...editData,
        absolute: [...editData.absolute, item]
      });
      setSelectedAbsolute('');
      setShowAbsolutePopover(false);
    }
  };

  const removeAbsolute = (index: number) => {
    setEditData({
      ...editData,
      absolute: editData.absolute.filter((_, i) => i !== index)
    });
  };

  const addRelative = (item: string) => {
    if (item && !editData.relative.includes(item)) {
      setEditData({
        ...editData,
        relative: [...editData.relative, item]
      });
      setSelectedRelative('');
      setShowRelativePopover(false);
    }
  };

  const removeRelative = (index: number) => {
    setEditData({
      ...editData,
      relative: editData.relative.filter((_, i) => i !== index)
    });
  };

  const absoluteOptions = [
    ar ? 'عدوى نشطة' : 'Active infection',
    ar ? 'جلطة حديثة' : 'Recent thrombosis',
    ar ? 'كسر غير مستقر' : 'Unstable fracture',
    ar ? 'ورم خبيث' : 'Malignancy',
    ar ? 'عدم استقرار عنق الرحم' : 'Cervical instability',
    ar ? 'حمى' : 'Fever',
    ar ? 'التهاب حاد' : 'Acute inflammation'
  ];

  const relativeOptions = [
    ar ? 'هشاشة العظام' : 'Osteoporosis',
    ar ? 'منظم ضربات القلب' : 'Pacemaker',
    ar ? 'الحمل' : 'Pregnancy',
    ar ? 'ضغط دم مرتفع غير مسيطر عليه' : 'Uncontrolled hypertension',
    ar ? 'جروح مفتوحة' : 'Open wounds',
    ar ? 'تغيرات في الحس' : 'Sensory changes',
    ar ? 'اضطرابات النزف' : 'Bleeding disorders',
    ar ? 'زرع مفصل حديث' : 'Recent joint replacement'
  ];

  const hasContraindications = contraindications.absolute.length > 0 || contraindications.relative.length > 0;

  return (
    <Card id="contraindications" className="relative">
      {contraindications.absolute.length > 0 && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-red-500 text-white rounded-full p-2">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              {ar ? "موانع الاستعمال والاحتياطات" : "Contraindications & Precautions"}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {ar ? "عوامل تمنع أو تتطلب حذر في العلاج" : "Factors that prevent or require caution in treatment"}
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
            {/* Absolute Contraindications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <h4 className="font-medium text-red-900">
                  {ar ? "موانع استعمال مطلقة" : "Absolute Contraindications"}
                </h4>
              </div>
              <p className="text-sm text-red-700 mb-4">
                {ar ? "حالات تمنع العلاج تماماً" : "Conditions that completely prevent treatment"}
              </p>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editData.absolute.map((item, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {item}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeAbsolute(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Popover open={showAbsolutePopover} onOpenChange={setShowAbsolutePopover}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">
                      <Plus className="w-4 h-4 mr-1" />
                      {ar ? "إضافة مانع مطلق" : "Add Absolute Contraindication"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">{ar ? "إضافة مانع استعمال مطلق" : "Add Absolute Contraindication"}</h3>
                      <Select value={selectedAbsolute} onValueChange={setSelectedAbsolute}>
                        <SelectTrigger>
                          <SelectValue placeholder={ar ? "اختر مانع استعمال" : "Select contraindication"} />
                        </SelectTrigger>
                        <SelectContent>
                          {absoluteOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addAbsolute(selectedAbsolute)} 
                          disabled={!selectedAbsolute}
                          size="sm"
                        >
                          {ar ? "إضافة" : "Add"}
                        </Button>
                        <Button variant="outline" onClick={() => setShowAbsolutePopover(false)} size="sm">
                          {ar ? "إلغاء" : "Cancel"}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Relative Contraindications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <h4 className="font-medium text-amber-900">
                  {ar ? "موانع استعمال نسبية" : "Relative Contraindications"}
                </h4>
              </div>
              <p className="text-sm text-amber-700 mb-4">
                {ar ? "حالات تتطلب حذر إضافي في العلاج" : "Conditions requiring extra caution in treatment"}
              </p>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editData.relative.map((item, index) => (
                    <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {item}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeRelative(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Popover open={showRelativePopover} onOpenChange={setShowRelativePopover}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                      <Plus className="w-4 h-4 mr-1" />
                      {ar ? "إضافة مانع نسبي" : "Add Relative Contraindication"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">{ar ? "إضافة مانع استعمال نسبي" : "Add Relative Contraindication"}</h3>
                      <Select value={selectedRelative} onValueChange={setSelectedRelative}>
                        <SelectTrigger>
                          <SelectValue placeholder={ar ? "اختر مانع استعمال" : "Select contraindication"} />
                        </SelectTrigger>
                        <SelectContent>
                          {relativeOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addRelative(selectedRelative)} 
                          disabled={!selectedRelative}
                          size="sm"
                        >
                          {ar ? "إضافة" : "Add"}
                        </Button>
                        <Button variant="outline" onClick={() => setShowRelativePopover(false)} size="sm">
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
            {!hasContraindications ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-green-700 font-medium">
                  {ar ? "لا توجد موانع استعمال مسجلة" : "No contraindications recorded"}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {ar ? "العلاج آمن للمتابعة" : "Treatment is safe to proceed"}
                </p>
              </div>
            ) : (
              <>
                {/* Absolute Contraindications */}
                {contraindications.absolute.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <h4 className="font-medium text-red-900">
                        {ar ? "موانع استعمال مطلقة" : "Absolute Contraindications"}
                      </h4>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 mb-3">
                        {ar ? "⚠️ العلاج ممنوع في هذه الحالات" : "⚠️ Treatment is contraindicated"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {contraindications.absolute.map((item, index) => (
                          <Badge key={index} variant="outline" className="bg-red-100 text-red-800 border-red-300">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Relative Contraindications */}
                {contraindications.relative.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <h4 className="font-medium text-amber-900">
                        {ar ? "موانع استعمال نسبية" : "Relative Contraindications"}
                      </h4>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-700 mb-3">
                        {ar ? "⚠️ العلاج ممكن مع توخي الحذر الإضافي" : "⚠️ Treatment possible with extra caution"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {contraindications.relative.map((item, index) => (
                          <Badge key={index} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}