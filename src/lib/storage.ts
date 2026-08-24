import { Tool, Post, PostType } from '@/types';
import { INITIAL_TOOLS } from './initialData';
import {
  fetchToolsFromSheets,
  saveToolToSheets,
  deleteToolFromSheets,
  fetchPostsFromSheets,
  createPostToSheets,
} from './googleSheets';

const STORAGE_KEYS = {
  TOOLS: 'dle_hub_tools',
  FAVORITES_PREFIX: 'dle_hub_favorites_',
  POSTS: 'dle_hub_posts',
};

// -------------------------------------------------------------
// ツール (Tools) の操作
// -------------------------------------------------------------

export async function fetchTools(): Promise<Tool[]> {
  const sheetTools = await fetchToolsFromSheets();
  if (sheetTools && sheetTools.length > 0) {
    return sheetTools;
  }
  return INITIAL_TOOLS;
}

export async function saveTool(
  toolData: Omit<Tool, 'id'> & { id?: string },
  userEmail: string
): Promise<Tool[]> {
  const updated = await saveToolToSheets(toolData, userEmail);
  if (updated && updated.length > 0) {
    return updated;
  }
  return fetchTools();
}

export async function deleteTool(id: string): Promise<Tool[]> {
  const updated = await deleteToolFromSheets(id);
  if (updated && updated.length > 0) {
    return updated;
  }
  return fetchTools();
}

export async function reorderTools(newTools: Tool[]): Promise<Tool[]> {
  return newTools;
}

// -------------------------------------------------------------
// お気に入り (Favorites) の操作
// -------------------------------------------------------------

export async function fetchFavorites(userEmail: string): Promise<string[]> {
  if (typeof window === 'undefined') return [];
  const key = `${STORAGE_KEYS.FAVORITES_PREFIX}${userEmail.toLowerCase()}`;
  const data = localStorage.getItem(key);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function toggleFavorite(
  userEmail: string,
  toolId: string
): Promise<string[]> {
  const current = await fetchFavorites(userEmail);
  const exists = current.includes(toolId);
  const updated = exists
    ? current.filter((id) => id !== toolId)
    : [...current, toolId];

  if (typeof window !== 'undefined') {
    const key = `${STORAGE_KEYS.FAVORITES_PREFIX}${userEmail.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(updated));
  }

  return updated;
}

// -------------------------------------------------------------
// 掲示板メモ (Posts) の操作
// -------------------------------------------------------------

export async function fetchPosts(): Promise<Post[]> {
  const sheetPosts = await fetchPostsFromSheets();
  if (sheetPosts && sheetPosts.length > 0) {
    return sheetPosts;
  }

  return [
    {
      id: 'post-1',
      type: '改修報告',
      content: 'DLE社内ツールポータルをリリースしました！ツール追加のご要望は本メモ欄までお願いします。',
      author_name: 'ポータル管理者',
      author_email: 'admin@dle.jp',
      created_at: new Date().toISOString(),
    },
  ];
}

export async function createPost(
  type: PostType,
  content: string,
  authorName: string,
  authorEmail: string
): Promise<Post[]> {
  const updated = await createPostToSheets(type, content, authorName, authorEmail);
  if (updated && updated.length > 0) {
    return updated;
  }
  return fetchPosts();
}

export async function updatePost(
  id: string,
  content: string,
  type: PostType
): Promise<Post[]> {
  return fetchPosts();
}

export async function deletePost(id: string): Promise<Post[]> {
  return fetchPosts();
}
