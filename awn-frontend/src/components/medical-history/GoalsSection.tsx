'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Target, Calendar, MapPin, User, Plus, X, Edit } from 'lucide-react';
import type { Goals, Locale } from '@/lib/types';

interface Props {
  goals: Goals;
  locale: Locale;
  onUpdate: (goals: Goals) => void;
}

export default function GoalsSection({ goals, locale, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Goals>(goals);
  const [showShortTermPopover, setShowShortTermPopover] = useState(false);
  const [showLongTermPopover, setShowLongTermPopover] = useState(false);
  const [showFunctionalPopover, setShowFunctionalPopover] = useState(false);
  const [selectedShortTermGoal, setSelectedShortTermGoal] = useState('');
  const [selectedLongTermGoal, setSelectedLongTermGoal] = useState('');
  const [selectedFunctionalGoal, setSelectedFunctionalGoal] = useState('');
  const ar = locale === 'ar';

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(goals);
    setIsEditing(false);
  };

  const addShortTermGoal = (goal: string) => {
    if (goal && !editData.shortTerm.includes(goal)) {
      setEditData({
        ...editData,
        shortTerm: [...editData.shortTerm, goal]
      });
      setSelectedShortTermGoal('');
      setShowShortTermPopover(false);
    }
  };

  const removeShortTermGoal = (index: number) => {
    setEditData({
      ...editData,
      shortTerm: editData.shortTerm.filter((_, i) => i !== index)
    });
  };

  const addLongTermGoal = (goal: string) => {
    if (goal && !editData.longTerm.includes(goal)) {
      setEditData({
        ...editData,
        longTerm: [...editData.longTerm, goal]
      });
      setSelectedLongTermGoal('');
      setShowLongTermPopover(false);
    }
  };

  const removeLongTermGoal = (index: number) => {
    setEditData({
      ...editData,
      longTerm: editData.longTerm.filter((_, i) => i !== index)
    });
  };

  const addFunctionalGoal = (goal: string) => {
    if (goal && !editData.functionalGoals.includes(goal)) {
      setEditData({
        ...editData,
        functionalGoals: [...editData.functionalGoals, goal]
      });
      setSelectedFunctionalGoal('');
      setShowFunctionalPopover(false);
    }
  };

  const removeFunctionalGoal = (index: number) => {
    setEditData({
      ...editData,
      functionalGoals: editData.functionalGoals.filter((_, i) => i !== index)
    });
  };

  const shortTermOptions = [
    ar ? 'تقليل الألم إلى 3/10' : 'Reduce pain to 3/10',
    ar ? 'تحسين نطاق الحركة' : 'Improve range of motion',
    ar ? 'زيادة القوة' : 'Increase strength',
    ar ? 'تحسين التوازن' : 'Improve balance',
    ar ? 'تقليل التورم' : 'Reduce swelling',
    ar ? 'تحسين الوضعة' : 'Improve posture'
  ];

  const longTermOptions = [
    ar ? 'العودة للأنشطة الطبيعية' : 'Return to normal activities',
    ar ? 'منع تكرار الإصابة' : 'Prevent re-injury',
    ar ? 'تحسين اللياقة العامة' : 'Improve overall fitness',
    ar ? 'العودة للعمل' : 'Return to work',
    ar ? 'العودة للرياضة' : 'Return to sports',
    ar ? 'الاستقلالية الكاملة' : 'Complete independence'
  ];

  const functionalOptions = [
    ar ? 'المشي لمسافة كيلومتر' : 'Walk 1 kilometer',
    ar ? 'صعود الدرج بدون ألم' : 'Climb stairs pain-free',
    ar ? 'حمل الأطفال' : 'Lift children',
    ar ? 'الجلوس لساعتين' : 'Sit for 2 hours',
    ar ? 'النوم بدون ألم' : 'Sleep without pain',
    ar ? 'القيادة' : 'Drive',
    ar ? 'العمل المكتبي' : 'Desk work',
    ar ? 'الأعمال المنزلية' : 'Household tasks'
  ];

  const sessionPreferences = [
    { value: 'online', label: ar ? 'عبر الإنترنت' : 'Online' },
    { value: 'clinic', label: ar ? 'في العيادة' : 'In Clinic' },
    { value: 'home', label: ar ? 'في المنزل' : 'At Home' }
  ];

  const therapistGenderOptions = [
    { value: '', label: ar ? 'لا يهم' : 'No Preference' },
    { value: 'male', label: ar ? 'ذكر' : 'Male' },
    { value: 'female', label: ar ? 'أنثى' : 'Female' }
  ];

  return (
    <Card id="goals" className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              {ar ? "أهداف التأهيل" : "Rehabilitation Goals"}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {ar ? "أهداف العلاج وتفضيلات الجلسات" : "Treatment objectives and session preferences"}
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
            {/* Short-term Goals */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-green-600" />
                <h4 className="font-medium text-green-900">
                  {ar ? "أهداف قصيرة المدى (2-4 أسابيع)" : "Short-term Goals (2-4 weeks)"}
                </h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editData.shortTerm.map((goal, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {goal}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeShortTermGoal(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Popover open={showShortTermPopover} onOpenChange={setShowShortTermPopover}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      {ar ? "إضافة هدف قصير المدى" : "Add Short-term Goal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">{ar ? "إضافة هدف قصير المدى" : "Add Short-term Goal"}</h3>
                      <Select value={selectedShortTermGoal} onValueChange={setSelectedShortTermGoal}>
                        <SelectTrigger>
                          <SelectValue placeholder={ar ? "اختر هدف" : "Select goal"} />
                        </SelectTrigger>
                        <SelectContent>
                          {shortTermOptions.map((goal) => (
                            <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addShortTermGoal(selectedShortTermGoal)} 
                          disabled={!selectedShortTermGoal}
                          size="sm"
                        >
                          {ar ? "إضافة" : "Add"}
                        </Button>
                        <Button variant="outline" onClick={() => setShowShortTermPopover(false)} size="sm">
                          {ar ? "إلغاء" : "Cancel"}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Long-term Goals */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-blue-900">
                  {ar ? "أهداف طويلة المدى (3+ أشهر)" : "Long-term Goals (3+ months)"}
                </h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editData.longTerm.map((goal, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {goal}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeLongTermGoal(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Popover open={showLongTermPopover} onOpenChange={setShowLongTermPopover}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      {ar ? "إضافة هدف طويل المدى" : "Add Long-term Goal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">{ar ? "إضافة هدف طويل المدى" : "Add Long-term Goal"}</h3>
                      <Select value={selectedLongTermGoal} onValueChange={setSelectedLongTermGoal}>
                        <SelectTrigger>
                          <SelectValue placeholder={ar ? "اختر هدف" : "Select goal"} />
                        </SelectTrigger>
                        <SelectContent>
                          {longTermOptions.map((goal) => (
                            <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addLongTermGoal(selectedLongTermGoal)} 
                          disabled={!selectedLongTermGoal}
                          size="sm"
                        >
                          {ar ? "إضافة" : "Add"}
                        </Button>
                        <Button variant="outline" onClick={() => setShowLongTermPopover(false)} size="sm">
                          {ar ? "إلغاء" : "Cancel"}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Functional Goals */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium text-purple-900">
                  {ar ? "أهداف وظيفية" : "Functional Goals"}
                </h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editData.functionalGoals.map((goal, index) => (
                    <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {goal}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeFunctionalGoal(index)}
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
                      {ar ? "إضافة هدف وظيفي" : "Add Functional Goal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">{ar ? "إضافة هدف وظيفي" : "Add Functional Goal"}</h3>
                      <Select value={selectedFunctionalGoal} onValueChange={setSelectedFunctionalGoal}>
                        <SelectTrigger>
                          <SelectValue placeholder={ar ? "اختر هدف" : "Select goal"} />
                        </SelectTrigger>
                        <SelectContent>
                          {functionalOptions.map((goal) => (
                            <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addFunctionalGoal(selectedFunctionalGoal)} 
                          disabled={!selectedFunctionalGoal}
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

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {ar ? "تفضيل مكان الجلسة" : "Session Preference"}
                </label>
                <Select
                  value={editData.sessionPreference}
                  onValueChange={(value) => setEditData({ ...editData, sessionPreference: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={ar ? "اختر مكان الجلسة" : "Select session location"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionPreferences.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {ar ? "تفضيل جنس المعالج" : "Therapist Gender Preference"}
                </label>
                <Select
                  value={editData.therapistGender || ''}
                  onValueChange={(value) => setEditData({ ...editData, therapistGender: value === '' ? undefined : value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={ar ? "اختر التفضيل" : "Select preference"} />
                  </SelectTrigger>
                  <SelectContent>
                    {therapistGenderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            {/* Short-term Goals */}
            {goals.shortTerm.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-green-900">
                    {ar ? "أهداف قصيرة المدى (2-4 أسابيع)" : "Short-term Goals (2-4 weeks)"}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {goals.shortTerm.map((goal, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Long-term Goals */}
            {goals.longTerm.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900">
                    {ar ? "أهداف طويلة المدى (3+ أشهر)" : "Long-term Goals (3+ months)"}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {goals.longTerm.map((goal, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Functional Goals */}
            {goals.functionalGoals.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <h4 className="font-medium text-purple-900">
                    {ar ? "أهداف وظيفية" : "Functional Goals"}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {goals.functionalGoals.map((goal, index) => (
                    <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {ar ? "تفضيل مكان الجلسة" : "Session Preference"}
                  </span>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {sessionPreferences.find(p => p.value === goals.sessionPreference)?.label || ar ? "غير محدد" : "Not set"}
                </Badge>
              </div>

              {goals.therapistGender && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700">
                      {ar ? "تفضيل جنس المعالج" : "Therapist Gender"}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {therapistGenderOptions.find(p => p.value === goals.therapistGender)?.label}
                  </Badge>
                </div>
              )}
            </div>

            {/* Empty state */}
            {goals.shortTerm.length === 0 && goals.longTerm.length === 0 && goals.functionalGoals.length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  {ar ? "لم يتم تحديد أهداف بعد" : "No goals set yet"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {ar ? "انقر 'تعديل' لإضافة أهداف التأهيل" : "Click 'Edit' to add rehabilitation goals"}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}