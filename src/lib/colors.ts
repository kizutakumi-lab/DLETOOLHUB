import { CategoryColor } from '@/types';

export interface ColorTheme {
  name: CategoryColor;
  label: string;
  badge: string;
  border: string;
  bg: string;
  headerText: string;
  pickerBg: string;
  dotBg: string;
  pillBg: string;
  hex: string;
}

export const CATEGORY_COLORS: Record<CategoryColor, ColorTheme> = {
  blue: {
    name: 'blue',
    label: 'ブルー',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    border: 'border-slate-800/80',
    bg: 'bg-slate-900/70',
    headerText: 'text-slate-100',
    pickerBg: 'bg-blue-500',
    dotBg: 'bg-blue-400',
    pillBg: 'bg-blue-500',
    hex: '#3b82f6',
  },
  emerald: {
    name: 'emerald',
    label: 'エメラルド',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    border: 'border-slate-800/80',
    bg: 'bg-slate-900/70',
    headerText: 'text-slate-100',
    pickerBg: 'bg-emerald-500',
    dotBg: 'bg-emerald-400',
    pillBg: 'bg-emerald-500',
    hex: '#10b981',
  },
  teal: {
    name: 'teal',
    label: 'ティール',
    badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    border: 'border-slate-800/80',
    bg: 'bg-slate-900/70',
    headerText: 'text-slate-100',
    pickerBg: 'bg-teal-500',
    dotBg: 'bg-teal-400',
    pillBg: 'bg-teal-500',
    hex: '#14b8a6',
  },
  indigo: {
    name: 'indigo',
    label: 'インディゴ',
    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    border: 'border-slate-800/80',
    bg: 'bg-slate-900/70',
    headerText: 'text-slate-100',
    pickerBg: 'bg-indigo-500',
    dotBg: 'bg-indigo-400',
    pillBg: 'bg-indigo-500',
    hex: '#6366f1',
  },
  purple: {
    name: 'purple',
    label: 'パープル',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    border: 'border-slate-800/80',
    bg: 'bg-slate-900/70',
    headerText: 'text-slate-100',
    pickerBg: 'bg-purple-500',
    dotBg: 'bg-purple-400',
    pillBg: 'bg-purple-500',
    hex: '#a855f7',
  },
  amber: {
    name: 'amber',
    label: 'アンバー',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    border: 'border-slate-800/80',
    bg: 'bg-slate-900/70',
    headerText: 'text-slate-100',
    pickerBg: 'bg-amber-500',
    dotBg: 'bg-amber-400',
    pillBg: 'bg-amber-500',
    hex: '#f59e0b',
  },
  rose: {
    name: 'rose',
    label: 'ローズ',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    border: 'border-slate-800/80',
    bg: 'bg-slate-900/70',
    headerText: 'text-slate-100',
    pickerBg: 'bg-rose-500',
    dotBg: 'bg-rose-400',
    pillBg: 'bg-rose-500',
    hex: '#f43f5e',
  },
  cyan: {
    name: 'cyan',
    label: 'シアン',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    border: 'border-slate-800/80',
    bg: 'bg-slate-900/70',
    headerText: 'text-slate-100',
    pickerBg: 'bg-cyan-500',
    dotBg: 'bg-cyan-400',
    pillBg: 'bg-cyan-500',
    hex: '#06b6d4',
  },
  orange: {
    name: 'orange',
    label: 'オレンジ',
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    border: 'border-slate-800/80',
    bg: 'bg-slate-900/70',
    headerText: 'text-slate-100',
    pickerBg: 'bg-orange-500',
    dotBg: 'bg-orange-400',
    pillBg: 'bg-orange-500',
    hex: '#f97316',
  },
  pink: {
    name: 'pink',
    label: 'ピンク',
    badge: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    border: 'border-slate-800/80',
    bg: 'bg-slate-900/70',
    headerText: 'text-slate-100',
    pickerBg: 'bg-pink-500',
    dotBg: 'bg-pink-400',
    pillBg: 'bg-pink-500',
    hex: '#ec4899',
  },
};

const ALL_COLOR_KEYS: CategoryColor[] = [
  'emerald',
  'teal',
  'indigo',
  'blue',
  'purple',
  'amber',
  'orange',
  'cyan',
  'pink',
  'rose',
];

export function getColorTheme(color?: CategoryColor, categoryName?: string): ColorTheme {
  if (color && CATEGORY_COLORS[color]) {
    return CATEGORY_COLORS[color];
  }

  if (categoryName) {
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % ALL_COLOR_KEYS.length;
    return CATEGORY_COLORS[ALL_COLOR_KEYS[idx]];
  }

  return CATEGORY_COLORS.blue;
}
