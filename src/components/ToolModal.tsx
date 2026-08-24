'use client';

import React, { useState, useEffect } from 'react';
import { Tool, CategoryColor } from '@/types';
import { CATEGORY_COLORS, getColorTheme } from '@/lib/colors';
import { X, Save, Link as LinkIcon, Hash, Tag, FileText, Palette, Check } from 'lucide-react';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (toolData: Omit<Tool, 'id'> & { id?: string }) => void;
  editingTool?: Tool | null;
  existingCategories: string[];
}

const COLOR_OPTIONS: CategoryColor[] = [
  'blue',
  'emerald',
  'teal',
  'indigo',
  'purple',
  'amber',
  'rose',
  'cyan',
  'orange',
  'pink',
];

export function ToolModal({
  isOpen,
  onClose,
  onSave,
  editingTool,
  existingCategories,
}: ToolModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState<CategoryColor>('blue');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);

  useEffect(() => {
    if (editingTool) {
      setName(editingTool.name || '');
      setCategory(editingTool.category || '');
      setColor(editingTool.color || getColorTheme(undefined, editingTool.category).name);
      setUrl(editingTool.url || '');
      setDescription(editingTool.description || '');
      setSortOrder(editingTool.sort_order || 0);
    } else {
      setName('');
      const defaultCat = existingCategories.length > 0 ? existingCategories[0] : '';
      setCategory(defaultCat);
      setColor(getColorTheme(undefined, defaultCat).name);
      setUrl('');
      setDescription('');
      setSortOrder(0);
    }
  }, [editingTool, isOpen, existingCategories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('ツール名は必須入力です。');
      return;
    }
    if (!category.trim()) {
      alert('用途カテゴリは必須入力です。');
      return;
    }
    if (!url.trim()) {
      alert('URLは必須入力です。');
      return;
    }

    onSave({
      id: editingTool?.id,
      name: name.trim(),
      category: category.trim(),
      color,
      url: url.trim(),
      description: description.trim(),
      sort_order: Number(sortOrder) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/40">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {editingTool ? 'ツールの編集' : '新しいツールを追加'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* ツール名 (必須) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ツール名 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: TouchOnTime, 楽楽清算"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 用途カテゴリ (必須) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                用途カテゴリ <span className="text-rose-400">*</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                直接入力・修正が可能です
              </span>
            </label>

            {/* 既存カテゴリのショートカットチップ */}
            {existingCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {existingCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setColor(getColorTheme(undefined, cat).name);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      category === cat
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300 font-medium'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="カテゴリ名を入力 (例: 勤怠管理, 営業ツール)"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* カテゴリカラー選択 (新規機能) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              テーマカラーを選択 (カード・カテゴリ別の配色)
            </label>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {COLOR_OPTIONS.map((colKey) => {
                const theme = CATEGORY_COLORS[colKey];
                const isSelected = color === colKey;
                return (
                  <button
                    key={colKey}
                    type="button"
                    onClick={() => setColor(colKey)}
                    className={`w-7 h-7 rounded-full ${theme.pickerBg} flex items-center justify-center transition-transform ${
                      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    title={theme.label}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* URL (必須) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              URL <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* 短い説明 (任意) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              説明文 (新入社員向けの使い道・用途説明)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例: 出退勤の打刻や勤務時間の確認を行うツールです。"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* 表示順 (任意) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              表示順 (数字が小さいほど上に表示)
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
            >
              <Save className="w-4 h-4" />
              {editingTool ? '更新保存' : '追加保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
