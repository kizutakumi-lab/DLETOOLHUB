'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './providers';
import { Tool, Post, PostType } from '@/types';
import { getColorTheme } from '@/lib/colors';
import {
  fetchTools,
  saveTool,
  deleteTool,
  reorderTools,
  fetchFavorites,
  toggleFavorite as toggleFavoriteStorage,
  fetchPosts,
  createPost as createPostStorage,
  updatePost as updatePostStorage,
  deletePost as deletePostStorage,
} from '@/lib/storage';

import { Header } from '@/components/Header';
import { ToolCard } from '@/components/ToolCard';
import { ToolListItem } from '@/components/ToolListItem';
import { FavoritesSection } from '@/components/FavoritesSection';
import { ToolModal } from '@/components/ToolModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { MemoSection } from '@/components/MemoSection';

import { Plus, LayoutGrid, ListFilter, AlertCircle, ShieldAlert, Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, status } = useAuth();
  const router = useRouter();

  // データ状態
  const [tools, setTools] = useState<Tool[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // UI状態
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'category'>('grid');

  // モーダル状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [deletingTool, setDeletingTool] = useState<Tool | null>(null);

  // 初期ロード＆認証ガード
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && user) {
      loadData();
    }
  }, [status, user]);

  const loadData = async () => {
    if (!user) return;
    const loadedTools = await fetchTools();
    setTools(loadedTools);

    const loadedFavs = await fetchFavorites(user.email);
    setFavoriteIds(loadedFavs);

    const loadedPosts = await fetchPosts();
    setPosts(loadedPosts);
  };

  // 編集権限: ログインユーザー全員が編集可能
  const canEdit = Boolean(user);

  // 全カテゴリ一覧
  const existingCategories = useMemo(() => {
    const set = new Set<string>();
    tools.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tools]);

  // お気に入りツール
  const favoriteTools = useMemo(() => {
    return tools.filter((t) => favoriteIds.includes(t.id));
  }, [tools, favoriteIds]);

  // リアルタイム検索フィルター結果
  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return tools;
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }, [tools, searchQuery]);

  // カテゴリ別グループ化データ
  const groupedTools = useMemo(() => {
    const groups: { category: string; tools: Tool[] }[] = [];
    const map = new Map<string, Tool[]>();

    filteredTools.forEach((t) => {
      const cat = t.category || 'その他';
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(t);
    });

    map.forEach((toolList, cat) => {
      groups.push({ category: cat, tools: toolList });
    });

    return groups;
  }, [filteredTools]);

  // お気に入り操作
  const handleToggleFavorite = async (toolId: string) => {
    if (!user?.email) return;
    const updatedFavs = await toggleFavoriteStorage(user.email, toolId);
    setFavoriteIds(updatedFavs);
  };

  // ツール保存 (追加・編集)
  const handleSaveTool = async (toolData: Omit<Tool, 'id'> & { id?: string }) => {
    if (!user) return;
    const updated = await saveTool(toolData, user.email);
    setTools(updated);
  };

  // ツール削除
  const handleConfirmDeleteTool = async () => {
    if (!deletingTool) return;
    const updated = await deleteTool(deletingTool.id);
    setTools(updated);
    setDeletingTool(null);
  };

  // 表示順の移動
  const handleMoveTool = async (tool: Tool, direction: 'up' | 'down') => {
    const index = tools.findIndex((t) => t.id === tool.id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tools.length) return;

    const newTools = [...tools];
    const temp = newTools[index];
    newTools[index] = newTools[newIndex];
    newTools[newIndex] = temp;

    const updated = await reorderTools(newTools);
    setTools(updated);
  };

  // 掲示板メモ操作
  const handleCreatePost = async (type: PostType, content: string) => {
    if (!user) return;
    const updated = await createPostStorage(type, content, user.name, user.email);
    setPosts(updated);
  };

  const handleUpdatePost = async (id: string, content: string, type: PostType) => {
    const updated = await updatePostStorage(id, content, type);
    setPosts(updated);
  };

  const handleDeletePost = async (id: string) => {
    const updated = await deletePostStorage(id);
    setPosts(updated);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">DLE TOOL HUB を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">ログインが必要です</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            社内ツールポータルの情報を安全に保持するため、@dle.jp のGoogleアカウントでの認証が必要です。
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-lg transition-all"
          >
            ログイン画面へ移動
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      {/* ヘッダー */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* お気に入りエリア */}
        <FavoritesSection
          favoriteTools={favoriteTools}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          canEdit={canEdit}
          onEdit={(t) => {
            setEditingTool(t);
            setIsModalOpen(true);
          }}
          onDelete={(t) => setDeletingTool(t)}
        />

        {/* ツール一覧セクション */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
                すべてのツール
                <span className="text-xs text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                  {filteredTools.length} 件
                </span>
              </h2>
            </div>

            {/* コントロール: 表示形式切り替え ＆ ツール追加ボタン */}
            <div className="flex items-center gap-3">
              {/* 表示モードスイッチ */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="横5列グリッド表示"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  グリッド一覧
                </button>
                <button
                  onClick={() => setViewMode('category')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    viewMode === 'category'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="カテゴリ別スリムリスト表示"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  カテゴリ別表示
                </button>
              </div>

              {/* ツール追加ボタン */}
              <button
                onClick={() => {
                  setEditingTool(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                ツールを追加
              </button>
            </div>
          </div>

          {/* ツール一覧表示 (グリッド表示 vs 単色さわやかカテゴリ別表示) */}
          {filteredTools.length === 0 ? (
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-12 text-center text-slate-500 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">
                該当するツールが見つかりませんでした。
              </p>
              <p className="text-xs text-slate-500">
                検索キーワードを変更してお試しください。
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* 1. 全体グリッド表示 (横5列) */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {filteredTools.map((tool, idx) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={favoriteIds.includes(tool.id)}
                  onToggleFavorite={handleToggleFavorite}
                  canEdit={canEdit}
                  onEdit={(t) => {
                    setEditingTool(t);
                    setIsModalOpen(true);
                  }}
                  onDelete={(t) => setDeletingTool(t)}
                  onMoveUp={(t) => handleMoveTool(t, 'up')}
                  onMoveDown={(t) => handleMoveTool(t, 'down')}
                  isFirst={idx === 0}
                  isLast={idx === filteredTools.length - 1}
                />
              ))}
            </div>
          ) : (
            /* 2. ポップ＆さわやかな単色カテゴリ別表示 (Notion/Linear風のクリーンフラットデザイン) */
            <div className="space-y-4">
              {groupedTools.map((group) => {
                const sampleTool = group.tools[0];
                const theme = getColorTheme(sampleTool?.color, group.category);

                return (
                  <div
                    key={group.category}
                    className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3 backdrop-blur-sm shadow-sm hover:border-slate-700/80 transition-all"
                  >
                    {/* クリーンでさわやかなカテゴリヘッダー */}
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3 h-3 rounded-md ${theme.pillBg} shadow-sm`} />
                        <h3 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
                          {group.category}
                        </h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${theme.badge}`}>
                          {group.tools.length} 件
                        </span>
                      </div>
                    </div>

                    {/* 内側のスリム行 */}
                    <div className="space-y-2">
                      {group.tools.map((tool) => (
                        <ToolListItem
                          key={tool.id}
                          tool={tool}
                          isFavorite={favoriteIds.includes(tool.id)}
                          onToggleFavorite={handleToggleFavorite}
                          canEdit={canEdit}
                          onEdit={(t) => {
                            setEditingTool(t);
                            setIsModalOpen(true);
                          }}
                          onDelete={(t) => setDeletingTool(t)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 掲示板風メモ欄 */}
        <MemoSection
          posts={posts}
          onCreatePost={handleCreatePost}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
          canDeleteAll={canEdit}
        />
      </main>

      {/* ツール追加/編集モーダル */}
      <ToolModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTool(null);
        }}
        onSave={handleSaveTool}
        editingTool={editingTool}
        existingCategories={existingCategories}
      />

      {/* 削除確認ダイアログ */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTool)}
        title={`「${deletingTool?.name}」を削除しますか？`}
        message="削除すると社内ツール一覧から取り除かれます。誤操作防止のための確認です。"
        onClose={() => setDeletingTool(null)}
        onConfirm={handleConfirmDeleteTool}
      />
    </div>
  );
}
