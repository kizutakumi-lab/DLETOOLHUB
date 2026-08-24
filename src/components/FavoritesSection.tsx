'use client';

import React from 'react';
import { Tool } from '@/types';
import { ToolCard } from './ToolCard';
import { Star } from 'lucide-react';

interface FavoritesSectionProps {
  favoriteTools: Tool[];
  favoriteIds: string[];
  onToggleFavorite: (toolId: string) => void;
  canEdit: boolean;
  onEdit: (tool: Tool) => void;
  onDelete: (tool: Tool) => void;
}

export function FavoritesSection({
  favoriteTools,
  favoriteIds,
  onToggleFavorite,
  canEdit,
  onEdit,
  onDelete,
}: FavoritesSectionProps) {
  if (favoriteTools.length === 0) return null;

  return (
    <section className="mb-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <h2 className="text-sm font-bold text-slate-200 tracking-tight">
          お気に入り
        </h2>
        <span className="text-xs text-slate-500 font-mono">
          ({favoriteTools.length})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {favoriteTools.map((tool) => (
          <ToolCard
            key={`fav-${tool.id}`}
            tool={tool}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
            canEdit={canEdit}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
