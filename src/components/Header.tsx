'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { Search, LogOut, ShieldCheck, User, Building2, ChevronDown } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* タイトル ＆ ロゴ */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-inner shadow-white/20 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                DLE TOOL HUB
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  社内ポータル
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                社内ツール一元アクセス＆掲示板
              </p>
            </div>
          </div>

          {/* モバイル用プロフィールアコーディオン */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-slate-400" />
                )}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 検索バー */}
        <div className="w-full md:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ツール名、用途、説明文をリアルタイム検索..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded"
            >
              クリア
            </button>
          )}
        </div>

        {/* 右上ユーザープロファイル */}
        {user && (
          <div className="hidden md:relative md:flex items-center gap-3" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 pl-2.5 pr-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left group"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                  {user.name.charAt(0)}
                </div>
              )}

              <div className="flex flex-col text-xs leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {user.name}
                  </span>
                  {user.isAdmin && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      管理者
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                  {user.email}
                </span>
              </div>

              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 border-b border-slate-800 mb-1">
                  <p className="text-xs text-slate-400">ログインアカウント</p>
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="text-[10px] text-emerald-400 font-mono">@dle.jp 認証済み</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  ログアウト
                </button>
              </div>
            )}
          </div>
        )}

        {/* モバイル用ドロップダウン */}
        {dropdownOpen && user && (
          <div className="w-full md:hidden bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center gap-3">
              {user.image && (
                <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
              )}
              <div>
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-slate-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 py-2 bg-rose-500/10 text-rose-300 rounded-lg font-medium border border-rose-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
