'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Activity, Briefcase, Moon, Home, Plus, X, Edit } from 'lucide-react';
import type { Lifestyle, Locale } from '@/lib/types';

interface Props {
  lifestyle: Lifestyle;
  locale: Locale;
  onUpdate: (lifestyle: Lifestyle) => void;
}

export default function LifestyleSection({ lifestyle, locale, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Lifestyle>(lifestyle);
  const [showSportsPopover, setShowSportsPopover] = useState(false);
  const [showDevicesPopover, setShowDevicesPopover] = useState(false);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const ar = locale === 'ar';

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(lifestyle);
    setIsEditing(false);
  };

  const addSport = (sport: string) => {
    if (sport && !(editData.sports || []).includes(sport)) {
      setEditData({
        ...editData,
        sports: [...(editData.sports || []), sport]
      });
      setSelectedSport('');
      setShowSportsPopover(false);
    }
  };

  const removeSport = (index: number) => {
    setEditData({
      ...editData,
      sports: (editData.sports || []).filter((_, i) => i !== index)
    });
  };

  const addDevice = (device: string) => {
    if (device && !(editData.assistiveDevices || []).includes(device)) {
      setEditData({
        ...editData,
        assistiveDevices: [...(editData.assistiveDevices || []), device]
      });
      setSelectedDevice('');
      setShowDevicesPopover(false);
    }
  };

  const removeDevice = (index: number) => {
    setEditData({
      ...editData,
      assistiveDevices: (editData.assistiveDevices || []).filter((_, i) => i !== index)
    });
  };

  const activityLevels = [
    { value: 'sedentary', label: ar ? 'خامل' : 'Sedentary', desc: ar ? 'قليل الحركة' : 'Little to no exercise' },
    { value: 'light', label: ar ? 'خفيف' : 'Light', desc: ar ? 'تمارين خفيفة' : 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: ar ? 'متوسط' : 'Moderate', desc: ar ? 'تمارين منتظمة' : 'Moderate exercise 3-5 days/week' },
    { value: 'vigorous', label: ar ? 'نشط' : 'Vigorous', desc: ar ? 'تمارين مكثفة' : 'Intense exercise 6-7 days/week' }
  ];

  const workTypes = [
    { value: 'desk', label: ar ? 'مكتبي' : 'Desk Work' },
    { value: 'manual', label: ar ? 'يدوي' : 'Manual Labor' },
    { value: 'standing', label: ar ? 'وقوف' : 'Standing Work' },
    { value: 'mixed', label: ar ? 'مختلط' : 'Mixed' },
    { value: 'retired', label: ar ? 'متقاعد' : 'Retired' }
  ];

  const sleepQualities = [
    { value: 'poor', label: ar ? 'سيء' : 'Poor' },
    { value: 'fair', label: ar ? 'متوسط' : 'Fair' },
    { value: 'good', label: ar ? 'جيد' : 'Good' }
  ];

  const sportsOptions = [
    ar ? 'كرة القدم' : 'Football',
    ar ? 'السباحة' : 'Swimming',
    ar ? 'الجري' : 'Running',
    ar ? 'كرة السلة' : 'Basketball',
    ar ? 'التنس' : 'Tennis',
    ar ? 'ركوب الدراجات' : 'Cycling',
    ar ? 'اليوغا' : 'Yoga',
    ar ? 'رفع الأثقال' : 'Weight lifting',
    ar ? 'المشي' : 'Walking',
    ar ? 'الجولف' : 'Golf'
  ];

  const deviceOptions = [
    ar ? 'عكازات' : 'Crutches',
    ar ? 'عصا المشي' : 'Walking stick',
    ar ? 'ووكر' : 'Walker',
    ar ? 'كرسي متحرك' : 'Wheelchair',
    ar ? 'دعامة الركبة' : 'Knee brace',
    ar ? 'دعامة الظهر' : 'Back brace',
    ar ? 'نظارات' : 'Glasses',
    ar ? 'سماعات أذن' : 'Hearing aids'
  ];

  return (
    <Card id="lifestyle" className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              {ar ? "نمط الحياة والمشاركة" : "Lifestyle & Participation"}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {ar ? "النشاط البدني والعمل والحياة اليومية" : "Physical activity, work, and daily living"}
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
            {/* Activity Level */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "مستوى النشاط البدني" : "Physical Activity Level"}
              </label>
              <Select
                value={editData.activityLevel}
                onValueChange={(value) => setEditData({ ...editData, activityLevel: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={ar ? "اختر مستوى النشاط" : "Select activity level"} />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-xs text-gray-500">{level.desc}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sports & Activities */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "الرياضات والأنشطة" : "Sports & Activities"}
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {(editData.sports || []).map((sport, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {sport}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeSport(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Popover open={showSportsPopover} onOpenChange={setShowSportsPopover}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      {ar ? "إضافة رياضة" : "Add Sport"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">{ar ? "إضافة رياضة أو نشاط" : "Add Sport or Activity"}</h3>
                      <Select value={selectedSport} onValueChange={setSelectedSport}>
                        <SelectTrigger>
                          <SelectValue placeholder={ar ? "اختر رياضة" : "Select sport"} />
                        </SelectTrigger>
                        <SelectContent>
                          {sportsOptions.map((sport) => (
                            <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addSport(selectedSport)} 
                          disabled={!selectedSport}
                          size="sm"
                        >
                          {ar ? "إضافة" : "Add"}
                        </Button>
                        <Button variant="outline" onClick={() => setShowSportsPopover(false)} size="sm">
                          {ar ? "إلغاء" : "Cancel"}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Work Type */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "نوع العمل" : "Work Type"}
              </label>
              <Select
                value={editData.workType}
                onValueChange={(value) => setEditData({ ...editData, workType: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={ar ? "اختر نوع العمل" : "Select work type"} />
                </SelectTrigger>
                <SelectContent>
                  {workTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Work Ergonomics */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "بيئة العمل" : "Work Environment"}
              </label>
              <textarea
                value={editData.workErgonomics || ''}
                onChange={(e) => setEditData({ ...editData, workErgonomics: e.target.value })}
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                placeholder={ar ? "وصف بيئة العمل والمعدات المستخدمة..." : "Describe work environment and equipment used..."}
              />
            </div>

            {/* Assistive Devices */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "الأجهزة المساعدة" : "Assistive Devices"}
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {(editData.assistiveDevices || []).map((device, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {device}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeDevice(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Popover open={showDevicesPopover} onOpenChange={setShowDevicesPopover}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      {ar ? "إضافة جهاز مساعد" : "Add Assistive Device"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">{ar ? "إضافة جهاز مساعد" : "Add Assistive Device"}</h3>
                      <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                        <SelectTrigger>
                          <SelectValue placeholder={ar ? "اختر جهاز" : "Select device"} />
                        </SelectTrigger>
                        <SelectContent>
                          {deviceOptions.map((device) => (
                            <SelectItem key={device} value={device}>{device}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addDevice(selectedDevice)} 
                          disabled={!selectedDevice}
                          size="sm"
                        >
                          {ar ? "إضافة" : "Add"}
                        </Button>
                        <Button variant="outline" onClick={() => setShowDevicesPopover(false)} size="sm">
                          {ar ? "إلغاء" : "Cancel"}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Home Setup */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "إعداد المنزل" : "Home Setup"}
              </label>
              <textarea
                value={editData.homeSetup || ''}
                onChange={(e) => setEditData({ ...editData, homeSetup: e.target.value })}
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                placeholder={ar ? "وصف المنزل (الدرج، إمكانية الوصول، إلخ)" : "Describe home layout (stairs, accessibility, etc.)"}
              />
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {ar ? "جودة النوم" : "Sleep Quality"}
              </label>
              <Select
                value={editData.sleepQuality}
                onValueChange={(value) => setEditData({ ...editData, sleepQuality: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={ar ? "اختر جودة النوم" : "Select sleep quality"} />
                </SelectTrigger>
                <SelectContent>
                  {sleepQualities.map((quality) => (
                    <SelectItem key={quality.value} value={quality.value}>{quality.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            {/* Activity Level Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-900">
                  {ar ? "مستوى النشاط" : "Activity Level"}
                </p>
                <p className="text-lg font-bold text-green-700">
                  {activityLevels.find(level => level.value === lifestyle.activityLevel)?.label || ar ? "غير محدد" : "Not set"}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-900">
                  {ar ? "نوع العمل" : "Work Type"}
                </p>
                <p className="text-lg font-bold text-blue-700">
                  {workTypes.find(type => type.value === lifestyle.workType)?.label || ar ? "غير محدد" : "Not set"}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <Moon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-900">
                  {ar ? "جودة النوم" : "Sleep Quality"}
                </p>
                <p className="text-lg font-bold text-purple-700">
                  {sleepQualities.find(quality => quality.value === lifestyle.sleepQuality)?.label || ar ? "غير محدد" : "Not set"}
                </p>
              </div>
            </div>

            {/* Sports & Activities */}
            {(lifestyle.sports || []).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {ar ? "الرياضات والأنشطة" : "Sports & Activities"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(lifestyle.sports || []).map((sport, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {sport}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Work Environment */}
            {lifestyle.workErgonomics && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {ar ? "بيئة العمل" : "Work Environment"}
                </h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {lifestyle.workErgonomics}
                </p>
              </div>
            )}

            {/* Assistive Devices */}
            {(lifestyle.assistiveDevices || []).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {ar ? "الأجهزة المساعدة" : "Assistive Devices"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(lifestyle.assistiveDevices || []).map((device, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {device}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Home Setup */}
            {lifestyle.homeSetup && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-4 w-4 text-gray-600" />
                  <h4 className="font-medium text-gray-900">
                    {ar ? "إعداد المنزل" : "Home Setup"}
                  </h4>
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {lifestyle.homeSetup}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}