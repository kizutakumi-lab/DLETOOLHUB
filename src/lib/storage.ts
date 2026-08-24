import { Tool, Post, PostType } from '@/types';
import {
  fetchToolsFromSheets,
  saveToolToSheets,
  deleteToolFromSheets,
  fetchPostsFromSheets,
  createPostToSheets,
} from './googleSheets';

const STORAGE_KEYS = {
  FAVORITES_PREFIX: 'dle_hub_favorites_',
};

// -------------------------------------------------------------
// ツール (Tools) の完全動的操作 (スプレッドシートのみ)
// -------------------------------------------------------------

export async function fetchTools(): Promise<Tool[]> {
  return await fetchToolsFromSheets();
}

export async function saveTool(
  toolData: Omit<Tool, 'id'> & { id?: string },
  userEmail: string
): Promise<Tool[]> {
  return await saveToolToSheets(toolData, userEmail);
}

export async function deleteTool(id: string): Promise<Tool[]> {
  return await deleteToolFromSheets(id);
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
// 掲示板メモ (Posts) の完全動的操作 (スプレッドシートのみ)
// -------------------------------------------------------------

export async function fetchPosts(): Promise<Post[]> {
  return await fetchPostsFromSheets();
}

export async function createPost(
  type: PostType,
  content: string,
  authorName: string,
  authorEmail: string
): Promise<Post[]> {
  return await createPostToSheets(type, content, authorName, authorEmail);
}

export async function updatePost(
  id: string,
  content: string,
  type: PostType
): Promise<Post[]> {
  return await fetchPostsFromSheets();
}

export async function deletePost(id: string): Promise<Post[]> {
  return await fetchPostsFromSheets();
}
