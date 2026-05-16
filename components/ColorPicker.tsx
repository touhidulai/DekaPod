'use client';

import { TEST_COLORS } from '@/lib/colors';
import { TestColor } from '@/lib/types';
import { CheckCircle2 } from 'lucide-react';

interface ColorPickerProps {
  lang: string;
  selected: string | null;
  onSelect: (color: TestColor) => void;
}

export default function ColorPicker({ lang, selected, onSelect }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TEST_COLORS.map((c) => {
        const isSelected = selected === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className={`relative rounded-xl border-2 p-3 text-left transition-all ${
              isSelected
                ? 'border-blue-500 shadow-md scale-[1.02]'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <div
              className="w-full h-12 rounded-lg mb-2 border border-black/10"
              style={{ backgroundColor: c.color }}
            />
            <p className="text-xs font-semibold text-gray-800 leading-tight">
              {c.label[lang as 'en' | 'bm']}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">
              {c.riskLabel[lang as 'en' | 'bm']}
            </p>
            {isSelected && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-100" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
