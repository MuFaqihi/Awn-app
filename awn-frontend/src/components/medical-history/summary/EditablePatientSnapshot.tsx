"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { Locale, Snapshot } from '@/lib/types';

interface Props {
  snapshot: Snapshot;
  locale: Locale;
  onSave: (data: Snapshot) => void;
}

export default function EditablePatientSnapshot({ snapshot, locale, onSave }: Props) {
  const ar = locale === 'ar';
  const [primaryConcern, setPrimaryConcern] = useState(snapshot.primaryConcern);
  const [onsetDate, setOnsetDate] = useState(snapshot.onsetDate || '');
  const [onsetType, setOnsetType] = useState(snapshot.onsetType || null);
  const [mechanism, setMechanism] = useState(snapshot.mechanism || ''); // Use mechanism instead of onsetCause
  const [painScore, setPainScore] = useState([snapshot.painScore]);
  const [functionalLimits, setFunctionalLimits] = useState(
    snapshot.functionalLimits?.join('\n') || ''
  );
  const [precautions, setPrecautions] = useState(snapshot.precautions.join('\n'));

  const handleSave = () => {
    const onsetTypeValue = onsetType as 'acute' | 'gradual' | 'insidious' | null;
    
    onSave({
      primaryConcern,
      onsetDate,
      onsetType: onsetTypeValue,
      mechanism, // Use mechanism instead of onsetCause
      painScore: painScore[0],
      functionalLimits: functionalLimits.split('\n').filter(limit => limit.trim()),
      precautions: precautions.split('\n').filter(precaution => precaution.trim())
    });
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div>
        <Label>{ar ? "المشكلة الأساسية" : "Primary Concern"}</Label>
        <Textarea
          value={primaryConcern}
          onChange={(e) => setPrimaryConcern(e.target.value)}
          placeholder={ar ? "اشرح المشكلة التي تواجهها..." : "Describe the problem you're facing..."}
          className="mt-1"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{ar ? "تاريخ البداية" : "Onset Date"}</Label>
          <Input
            type="date"
            value={onsetDate}
            onChange={(e) => setOnsetDate(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>{ar ? "نوع البداية" : "Onset Type"}</Label>
          <Select value={onsetType || ''} onValueChange={(value) => setOnsetType(value as any)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={ar ? "اختر النوع" : "Select type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acute">{ar ? "مفاجئ" : "Acute"}</SelectItem>
              <SelectItem value="gradual">{ar ? "تدريجي" : "Gradual"}</SelectItem>
              <SelectItem value="insidious">{ar ? "خفي" : "Insidious"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>{ar ? "آلية الإصابة" : "Mechanism of Injury"}</Label>
        <Input
          value={mechanism}
          onChange={(e) => setMechanism(e.target.value)}
          placeholder={ar ? "مثال: سقوط، رفع ثقيل، حادث..." : "Example: fall, heavy lifting, accident..."}
          className="mt-1"
        />
      </div>

      <div>
        <Label>{ar ? `مستوى الألم: ${painScore[0]}/10` : `Pain Level: ${painScore[0]}/10`}</Label>
        <Slider
          value={painScore}
          onValueChange={setPainScore}
          max={10}
          step={1}
          className="mt-2"
        />
      </div>

      <div>
        <Label>{ar ? "القيود الوظيفية" : "Functional Limitations"}</Label>
        <Textarea
          value={functionalLimits}
          onChange={(e) => setFunctionalLimits(e.target.value)}
          placeholder={ar ? "اكتب كل قيد في سطر منفصل..." : "Write each limitation on a separate line..."}
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label>{ar ? "الاحتياطات" : "Precautions"}</Label>
        <Textarea
          value={precautions}
          onChange={(e) => setPrecautions(e.target.value)}
          placeholder={ar ? "اكتب كل احتياط في سطر منفصل..." : "Write each precaution on a separate line..."}
          className="mt-1"
          rows={3}
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