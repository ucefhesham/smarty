"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import type { WPCFieldGroup } from '@/lib/wordpress';

interface CustomProductOptionsProps {
  product: any;
  categoryOptions?: WPCFieldGroup[] | null;
  onPriceChange?: (extraPrice: number) => void;
}

export default function CustomProductOptions({ product, categoryOptions, onPriceChange }: CustomProductOptionsProps) {
  const t = useTranslations('common');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  
  // Use category options (the new WPCFieldGroup[] format)
  const fieldGroups = categoryOptions;

  // Handle value changes and notify parent
  useEffect(() => {
    if (onPriceChange && fieldGroups) {
      let total = 0;
      fieldGroups.forEach(group => {
        group.options.forEach(opt => {
          if (selectedOptions[opt.id]) {
            total += parseFloat(opt.price) || 0;
          }
        });
      });
      onPriceChange(total);
    }
  }, [selectedOptions, fieldGroups, onPriceChange]);

  if (!fieldGroups || fieldGroups.length === 0) return null;

  const handleCheckboxChange = (optionId: string) => {
    setSelectedOptions(prev => ({ 
      ...prev, 
      [optionId]: !prev[optionId] 
    }));
  };

  return (
    <div className="space-y-5 pt-5 border-t border-slate-100 mt-5">
      {fieldGroups.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-3">
          {group.title && !['Checkbox', 'Checkboxes', 'Checkboxs'].includes(group.title) && (
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {group.title}
            </h4>
          )}
          
          <div className="space-y-2">
            {group.options.map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                  selectedOptions[opt.id]
                    ? "border-primary bg-primary/5"
                    : "border-slate-100 hover:border-slate-200"
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions[opt.id] || false}
                  onChange={() => handleCheckboxChange(opt.id)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-[var(--color-primary)]"
                />
                <span className="flex-grow text-sm font-medium text-slate-700">
                  {opt.name}
                  {parseFloat(opt.price) > 0 && (
                    <span className="ml-2 text-primary font-bold">
                      (+{opt.price} {t('currency')})
                    </span>
                  )}
                </span>
                {parseFloat(opt.price) > 0 && selectedOptions[opt.id] && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-primary text-white">
                    {t('selected')}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
