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
}

export const CATEGORY_COLORS: Record<CategoryColor, ColorTheme> = {
  blue: {
    name: 'blue',
    label: 'ブルー',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    border: 'border-blue-500/35',
    bg: 'bg-gradient-to-r from-blue-900/35 via-slate-900/60 to-slate-900/40',
    headerText: 'text-blue-400',
    pickerBg: 'bg-blue-500',
    dotBg: 'bg-blue-400',
  },
  emerald: {
    name: 'emerald',
    label: 'エメラルド',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    border: 'border-emerald-500/35',
    bg: 'bg-gradient-to-r from-emerald-900/35 via-slate-900/60 to-slate-900/40',
    headerText: 'text-emerald-400',
    pickerBg: 'bg-emerald-500',
    dotBg: 'bg-emerald-400',
  },
  teal: {
    name: 'teal',
    label: 'ティール',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    border: 'border-teal-500/35',
    bg: 'bg-gradient-to-r from-teal-900/35 via-slate-900/60 to-slate-900/40',
    headerText: 'text-teal-400',
    pickerBg: 'bg-teal-500',
    dotBg: 'bg-teal-400',
  },
  indigo: {
    name: 'indigo',
    label: 'インディゴ',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    border: 'border-indigo-500/35',
    bg: 'bg-gradient-to-r from-indigo-900/35 via-slate-900/60 to-slate-900/40',
    headerText: 'text-indigo-400',
    pickerBg: 'bg-indigo-500',
    dotBg: 'bg-indigo-400',
  },
  purple: {
    name: 'purple',
    label: 'パープル',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    border: 'border-purple-500/35',
    bg: 'bg-gradient-to-r from-purple-900/35 via-slate-900/60 to-slate-900/40',
    headerText: 'text-purple-400',
    pickerBg: 'bg-purple-500',
    dotBg: 'bg-purple-400',
  },
  amber: {
    name: 'amber',
    label: 'アンバー',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    border: 'border-amber-500/35',
    bg: 'bg-gradient-to-r from-amber-900/35 via-slate-900/60 to-slate-900/40',
    headerText: 'text-amber-400',
    pickerBg: 'bg-amber-500',
    dotBg: 'bg-amber-400',
  },
  rose: {
    name: 'rose',
    label: 'ローズ',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    border: 'border-rose-500/35',
    bg: 'bg-gradient-to-r from-rose-900/35 via-slate-900/60 to-slate-900/40',
    headerText: 'text-rose-400',
    pickerBg: 'bg-rose-500',
    dotBg: 'bg-rose-400',
  },
  cyan: {
    name: 'cyan',
    label: 'シアン',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    border: 'border-cyan-500/35',
    bg: 'bg-gradient-to-r from-cyan-900/35 via-slate-900/60 to-slate-900/40',
    headerText: 'text-cyan-400',
    pickerBg: 'bg-cyan-500',
    dotBg: 'bg-cyan-400',
  },
  orange: {
    name: 'orange',
    label: 'オレンジ',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
    border: 'border-orange-500/35',
    bg: 'bg-gradient-to-r from-orange-900/35 via-slate-900/60 to-slate-900/40',
    headerText: 'text-orange-400',
    pickerBg: 'bg-orange-500',
    dotBg: 'bg-orange-400',
  },
  pink: {
    name: 'pink',
    label: 'ピンク',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
    border: 'border-pink-500/35',
    bg: 'bg-gradient-to-r from-pink-900/35 via-slate-900/60 to-slate-900/40',
    headerText: 'text-pink-400',
    pickerBg: 'bg-pink-500',
    dotBg: 'bg-pink-400',
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
