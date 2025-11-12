"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Locale, Goals } from '@/lib/types';

interface Props {
  goals: Goals;
  locale: Locale;
  onSave: (data: Goals) => void;
}

export default function EditableGoals({ goals, locale, onSave }: Props) {
  const ar = locale === 'ar';
  const [shortTermGoals, setShortTermGoals] = useState(goals.shortTerm.join('\n'));
  const [longTermGoals, setLongTermGoals] = useState(goals.longTerm.join('\n'));

  const handleSave = () => {
    const shortTerm = shortTermGoals.split('\n').filter(goal => goal.trim());
    const longTerm = longTermGoals.split('\n').filter(goal => goal.trim());
    
    onSave({
      shortTerm,
      longTerm,
      functionalGoals: [...shortTerm, ...longTerm]
    });
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div>
        <Label>{ar ? "الأهداف قصيرة المدى (1-4 أسابيع)" : "Short-term Goals (1-4 weeks)"}</Label>
        <Textarea
          value={shortTermGoals}
          onChange={(e) => setShortTermGoals(e.target.value)}
          placeholder={ar ? 'اكتب كل هدف في سطر منفصل:\nتقليل الألم إلى 3/10\nتحسين النوم\nالمشي لمدة 15 دقيقة' : 'Write each goal on a separate line:\nReduce pain to 3/10\nImprove sleep quality\nWalk for 15 minutes'}
          className="mt-1 min-h-[100px]"
          rows={4}
        />
      </div>
      
      <div>
        <Label>{ar ? "الأهداف طويلة المدى (1-3 أشهر)" : "Long-term Goals (1-3 months)"}</Label>
        <Textarea
          value={longTermGoals}
          onChange={(e) => setLongTermGoals(e.target.value)}
          placeholder={ar ? 'اكتب كل هدف في سطر منفصل:\nالعودة إلى ممارسة الرياضة\nرفع الأوزان الثقيلة\nالعيش بدون ألم' : 'Write each goal on a separate line:\nReturn to sports\nLift heavy objects\nLive pain-free'}
          className="mt-1 min-h-[100px]"
          rows={4}
        />
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} className="flex-1 bg-teal-600 hover:bg-teal-700">
          {ar ? "حفظ التغييرات" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}