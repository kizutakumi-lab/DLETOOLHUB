'use client';

import React from 'react';
import { Tool } from '@/types';
import { getColorTheme } from '@/lib/colors';
import { ExternalLink, Star, Edit2, Trash2 } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  canEdit: boolean;
  onEdit: (tool: Tool) => void;
  onDelete: (tool: Tool) => void;
  onMoveUp?: (tool: Tool) => void;
  onMoveDown?: (tool: Tool) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function ToolCard({
  tool,
  isFavorite,
  onToggleFavorite,
  canEdit,
  onEdit,
  onDelete,
}: ToolCardProps) {
  const colorTheme = getColorTheme(tool.color, tool.category);

  const handleOpen = () => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group relative bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/50">
      <div>
        {/* 上部: カテゴリバッジ ＆ お気に入り ＆ 編集・削除 */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border ${colorTheme.badge} truncate max-w-[130px]`}
            title={tool.category}
          >
            {tool.category}
          </span>

          <div className="flex items-center gap-1">
            {/* お気に入りボタン */}
            <button
              onClick={() => onToggleFavorite(tool.id)}
              title={isFavorite ? 'お気に入りから解除' : 'お気に入りに追加'}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <Star
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  isFavorite
                    ? 'fill-amber-400 text-amber-400'
                    : 'hover:text-amber-400'
                }`}
              />
            </button>

            {/* 編集ボタン */}
            {canEdit && (
              <button
                onClick={() => onEdit(tool)}
                className="p-1 rounded-md text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                title="編集モーダルを開く"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* 削除ボタン */}
            {canEdit && (
              <button
                onClick={() => onDelete(tool)}
                className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="削除"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ツール名 */}
        <h3
          onClick={handleOpen}
          className="text-sm font-bold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer line-clamp-1 mb-1"
          title={tool.name}
        >
          {tool.name}
        </h3>

        {/* 説明文 */}
        <p className="text-[12px] text-slate-400 leading-snug line-clamp-2 min-h-[2.2rem] mb-3">
          {tool.description || '説明なし'}
        </p>
      </div>

      {/* 下部: URL & 開くボタン */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-mono truncate max-w-[110px]">
          {tool.url.replace(/^https?:\/\//, '')}
        </span>

        <button
          onClick={handleOpen}
          className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition-all shadow-sm group/btn"
        >
          開く
          <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
