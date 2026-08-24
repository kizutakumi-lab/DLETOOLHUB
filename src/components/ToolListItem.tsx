'use client';

import React from 'react';
import { Tool } from '@/types';
import { getColorTheme } from '@/lib/colors';
import { ExternalLink, Star, Edit2, Trash2 } from 'lucide-react';

interface ToolListItemProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  canEdit: boolean;
  onEdit: (tool: Tool) => void;
  onDelete: (tool: Tool) => void;
}

export function ToolListItem({
  tool,
  isFavorite,
  onToggleFavorite,
  canEdit,
  onEdit,
  onDelete,
}: ToolListItemProps) {
  const colorTheme = getColorTheme(tool.color, tool.category);

  const handleOpen = () => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group bg-slate-950/70 hover:bg-slate-900 border border-slate-800/60 hover:border-slate-700/80 rounded-xl px-4 py-2.5 flex items-center justify-between gap-4 transition-all duration-150">
      {/* 左側: さわやかなカラーアクセントピル ＋ ツール名 ＆ 説明 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0 flex-1">
        <div className="flex items-center gap-2.5 shrink-0 sm:w-52">
          <span className={`w-2.5 h-2.5 rounded-full ${colorTheme.pillBg} shrink-0 shadow-sm`} />
          <h4
            onClick={handleOpen}
            className="text-sm font-bold text-slate-100 hover:text-blue-400 cursor-pointer truncate transition-colors"
            title={tool.name}
          >
            {tool.name}
          </h4>
        </div>
        <p className="text-xs text-slate-400 truncate flex-1 min-w-0">
          {tool.description || '説明なし'}
        </p>
      </div>

      {/* 右側: ★ お気に入り ｜ 開く ｜ 編集 ｜ 削除 */}
      <div className="flex items-center gap-2 shrink-0">
        {/* ★ お気に入り */}
        <button
          onClick={() => onToggleFavorite(tool.id)}
          title={isFavorite ? 'お気に入りから解除' : 'お気に入りに追加'}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
        >
          <Star
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorite
                ? 'fill-amber-400 text-amber-400'
                : 'hover:text-amber-400'
            }`}
          />
        </button>

        {/* 開くボタン */}
        <button
          onClick={handleOpen}
          className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition-all border border-slate-700/60 group/btn shadow-sm"
        >
          開く
          <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>

        {/* 編集ボタン */}
        {canEdit && (
          <button
            onClick={() => onEdit(tool)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-400 text-xs rounded-lg border border-slate-800 transition-colors"
            title="ツールの内容を編集"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">編集</span>
          </button>
        )}

        {/* 削除ボタン */}
        {canEdit && (
          <button
            onClick={() => onDelete(tool)}
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="削除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
