'use client';

import React, { useState } from 'react';
import { Post, PostType } from '@/types';
import { useAuth } from '@/app/providers';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Info,
  Sparkles,
  Send,
  X,
} from 'lucide-react';

interface MemoSectionProps {
  posts: Post[];
  onCreatePost: (type: PostType, content: string) => void;
  onUpdatePost: (id: string, content: string, type: PostType) => void;
  onDeletePost: (id: string) => void;
  canDeleteAll: boolean;
}

const postTypeBadges: Record<PostType, { style: string; icon: React.ReactNode }> = {
  バグ: {
    style: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    icon: <AlertCircle className="w-3 h-3 text-rose-400" />,
  },
  要望: {
    style: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    icon: <Sparkles className="w-3 h-3 text-amber-400" />,
  },
  相談: {
    style: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    icon: <HelpCircle className="w-3 h-3 text-sky-400" />,
  },
  改修報告: {
    style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
  },
  その他: {
    style: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    icon: <Info className="w-3 h-3 text-slate-400" />,
  },
};

export function MemoSection({
  posts,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  canDeleteAll,
}: MemoSectionProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<PostType>('要望');
  const [content, setContent] = useState('');
  const [showAll, setShowAll] = useState(false);

  // 編集用状態
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editType, setEditType] = useState<PostType>('要望');

  // 表示件数の制御 (初期は最新5件)
  const displayPosts = showAll ? posts : posts.slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onCreatePost(type, content.trim());
    setContent('');
    setShowForm(false);
  };

  const handleStartEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
    setEditType(post.type);
  };

  const handleSaveEdit = (id: string) => {
    if (!editContent.trim()) return;
    onUpdatePost(id, editContent.trim(), editType);
    setEditingPostId(null);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getMonth() + 1}/${d.getDate()} ${d
        .getHours()
        .toString()
        .padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 md:p-5 backdrop-blur-sm">
      {/* セクションヘッダー */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              ツールポータル メモ
              <span className="text-[10px] font-normal px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">
                {posts.length}件
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              バグ報告、ツール追加のご要望、管理者からの連絡事項など
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/20"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? '閉じる' : '新規投稿'}
        </button>
      </div>

      {/* 投稿用フォーム */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-semibold text-slate-300">種別:</label>
            {(['バグ', '要望', '相談', '改修報告', 'その他'] as PostType[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-colors flex items-center gap-1 ${
                  type === t
                    ? postTypeBadges[t].style + ' shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {postTypeBadges[t].icon}
                {t}
              </button>
            ))}
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="メモの内容を入力してください (例: ZACのリンクが開けません / ◯◯ツールの追加をお願いします)"
              rows={2}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500">
              投稿者: {user?.name || '社内ユーザー'} ({user?.email})
            </span>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all"
            >
              <Send className="w-3 h-3" />
              投稿する
            </button>
          </div>
        </form>
      )}

      {/* 投稿一覧 */}
      {displayPosts.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/30 rounded-xl border border-slate-800/40">
          まだ投稿はありません。「新規投稿」からご意見・ご要望をお寄せください。
        </div>
      ) : (
        <div className="space-y-2">
          {displayPosts.map((post) => {
            const isAuthor = user?.email && user.email.toLowerCase() === post.author_email.toLowerCase();
            const canDelete = isAuthor || canDeleteAll;
            const isEditing = editingPostId === post.id;
            const badge = postTypeBadges[post.type] || postTypeBadges['その他'];

            return (
              <div
                key={post.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs flex flex-col md:flex-row md:items-start justify-between gap-2 hover:border-slate-700/80 transition-colors"
              >
                {isEditing ? (
                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-2">
                      {(['バグ', '要望', '相談', '改修報告', 'その他'] as PostType[]).map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setEditType(t)}
                          className={`px-2 py-0.5 text-[10px] rounded-md border ${
                            editType === t
                              ? postTypeBadges[t].style
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-slate-900 border border-blue-500 rounded-lg p-2 text-xs text-white"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="px-2.5 py-1 text-slate-400 hover:text-white"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold"
                      >
                        更新
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.style}`}
                        >
                          {badge.icon}
                          {post.type}
                        </span>
                        <span className="font-semibold text-slate-200">
                          {post.author_name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap pl-0.5">
                        {post.content}
                      </p>
                    </div>

                    {/* 操作ボタン */}
                    <div className="flex items-center gap-1 shrink-0 self-end md:self-start">
                      {isAuthor && (
                        <button
                          onClick={() => handleStartEdit(post)}
                          className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="編集"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDeletePost(post.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="削除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* もっと見る ボタン */}
      {posts.length > 5 && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors border border-slate-700/50"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                折りたたむ
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                過去の投稿をもっと見る (全{posts.length}件)
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
