import { CategoryColor } from '@/types';

export interface ColorTheme {
  name: CategoryColor;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  hex: string;
}

export const CATEGORY_COLORS: Record<CategoryColor, ColorTheme> = {
  blue: {
    name: 'blue',
    label: 'ブルー',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    badgeText: '#93c5fd',
    badgeBorder: 'rgba(59, 130, 246, 0.4)',
    hex: '#3b82f6',
  },
  emerald: {
    name: 'emerald',
    label: 'エメラルド',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeText: '#6ee7b7',
    badgeBorder: 'rgba(16, 185, 129, 0.4)',
    hex: '#10b981',
  },
  teal: {
    name: 'teal',
    label: 'ティール',
    badgeBg: 'rgba(20, 184, 166, 0.15)',
    badgeText: '#5eead4',
    badgeBorder: 'rgba(20, 184, 166, 0.4)',
    hex: '#14b8a6',
  },
  indigo: {
    name: 'indigo',
    label: 'インディゴ',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    badgeText: '#a5b4fc',
    badgeBorder: 'rgba(99, 102, 241, 0.4)',
    hex: '#6366f1',
  },
  purple: {
    name: 'purple',
    label: 'パープル',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeText: '#d8b4fe',
    badgeBorder: 'rgba(168, 85, 247, 0.4)',
    hex: '#a855f7',
  },
  amber: {
    name: 'amber',
    label: 'アンバー',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeText: '#fde68a',
    badgeBorder: 'rgba(245, 158, 11, 0.4)',
    hex: '#f59e0b',
  },
  rose: {
    name: 'rose',
    label: 'ローズ',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    badgeText: '#fca5a5',
    badgeBorder: 'rgba(244, 63, 94, 0.4)',
    hex: '#f43f5e',
  },
  cyan: {
    name: 'cyan',
    label: 'シアン',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    badgeText: '#67e8f9',
    badgeBorder: 'rgba(6, 182, 212, 0.4)',
    hex: '#06b6d4',
  },
  orange: {
    name: 'orange',
    label: 'オレンジ',
    badgeBg: 'rgba(249, 115, 22, 0.2)',
    badgeText: '#fdba74',
    badgeBorder: 'rgba(249, 115, 22, 0.5)',
    hex: '#f97316',
  },
  pink: {
    name: 'pink',
    label: 'ピンク',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    badgeText: '#f9a8d4',
    badgeBorder: 'rgba(236, 72, 153, 0.4)',
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
