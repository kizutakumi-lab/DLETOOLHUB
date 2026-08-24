'use client';

import React from 'react';
import { Filter, Layers } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none py-1">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium shrink-0 mr-1">
        <Filter className="w-3.5 h-3.5 text-blue-400" />
        <span>カテゴリ:</span>
      </div>

      {/* すべて */}
      <button
        onClick={() => onSelectCategory('ALL')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 border ${
          selectedCategory === 'ALL'
            ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/20'
            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Layers className="w-3 h-3" />
        すべて
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            selectedCategory === 'ALL'
              ? 'bg-blue-700 text-blue-100'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {totalCount}
        </span>
      </button>

      {/* 各カテゴリボタン */}
      {categories.map((cat) => {
        const count = categoryCounts[cat] || 0;
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 border ${
              isSelected
                ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {cat}
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected
                  ? 'bg-blue-700 text-blue-100'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
