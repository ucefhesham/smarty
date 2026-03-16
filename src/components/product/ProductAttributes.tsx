"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Attribute {
  id: number;
  name: string;
  options: string[];
}

interface ProductAttributesProps {
  attributes: Attribute[];
  onSelect?: (selected: Record<string, string>) => void;
}

export default function ProductAttributes({ attributes, onSelect }: ProductAttributesProps) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const handleSelect = (name: string, option: string) => {
    const newSelected = { ...selected, [name]: option };
    setSelected(newSelected);
    if (onSelect) onSelect(newSelected);
  };

  // Helper to determine if an attribute is a color
  const isColorAttribute = (name: string) => {
    return name.toLowerCase().includes('color') || name.toLowerCase().includes('لون');
  };

  // Helper to get hex from color name (crude fallback)
  const getColorHex = (color: string) => {
    const colors: Record<string, string> = {
      'Blue': '#3b82f6',
      'Red': '#ef4444',
      'Green': '#22c55e',
      'Black': '#000000',
      'White': '#ffffff',
      'Gray': '#94a3b8',
      'Silver': '#cbd5e1',
      'Gold': '#fbbf24',
      'Pink': '#f472b6',
      'Space Gray': '#4b5563',
      'Midnight': '#1e293b',
      'Starlight': '#f8fafc',
    };
    return colors[color] || '#e2e8f0';
  };

  if (!attributes || attributes.length === 0) return null;

  return (
    <div className="space-y-6">
      {attributes.map((attr) => (
        <div key={attr.id || attr.name} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">{attr.name}:</span>
            {selected[attr.name] && (
              <span className="text-sm text-slate-500">{selected[attr.name]}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {attr.options.map((option) => {
              const isActive = selected[attr.name] === option;
              
              if (isColorAttribute(attr.name)) {
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(attr.name, option)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all p-0.5",
                      isActive ? "border-primary scale-110 shadow-md" : "border-transparent"
                    )}
                    title={option}
                  >
                    <div 
                      className="w-full h-full rounded-full border border-black/10" 
                      style={{ backgroundColor: getColorHex(option) }} 
                    />
                  </button>
                );
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(attr.name, option)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-md border-2 transition-all",
                    isActive 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-slate-100 text-slate-600 hover:border-slate-200"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
