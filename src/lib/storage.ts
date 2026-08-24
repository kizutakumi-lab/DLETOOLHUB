import { Tool, Post, PostType } from '@/types';
import { INITIAL_TOOLS, INITIAL_POSTS } from './initialData';
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
  // 1. Google スプレッドシートからの取得を試行
  try {
    const sheetTools = await fetchToolsFromSheets();
    if (sheetTools && sheetTools.length > 0) {
      return sheetTools;
    }
  } catch (e) {
    console.warn('Google Sheets tools fetch bypassed, using default tools:', e);
  }

  // 2. LocalStorage または 初期データの保護表示
  if (typeof window === 'undefined') return INITIAL_TOOLS;
  const localData = localStorage.getItem(STORAGE_KEYS.TOOLS);
  if (!localData) {
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(INITIAL_TOOLS));
    return INITIAL_TOOLS;
  }
  try {
    const parsed = JSON.parse(localData);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TOOLS;
  } catch {
    return INITIAL_TOOLS;
  }
}

export async function saveTool(
  toolData: Omit<Tool, 'id'> & { id?: string },
  userEmail: string
): Promise<Tool[]> {
  try {
    const updated = await saveToolToSheets(toolData, userEmail);
    if (updated && updated.length > 0) {
      return updated;
    }
  } catch (e) {
    console.warn('Google Sheets saveTool bypassed:', e);
  }

  const currentTools = await fetchTools();
  let updatedTools: Tool[];

  if (toolData.id) {
    updatedTools = currentTools.map((t) =>
      t.id === toolData.id
        ? { ...t, ...toolData, updated_at: new Date().toISOString() }
        : t
    );
  } else {
    const newTool: Tool = {
      id: `tool-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: toolData.name,
      category: toolData.category,
      color: toolData.color || 'blue',
      url: toolData.url,
      description: toolData.description,
      sort_order: toolData.sort_order ?? currentTools.length + 1,
      created_by: userEmail,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    updatedTools = [...currentTools, newTool];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(updatedTools));
  }
  return updatedTools;
}

export async function deleteTool(id: string): Promise<Tool[]> {
  try {
    const updated = await deleteToolFromSheets(id);
    if (updated && updated.length > 0) {
      return updated;
    }
  } catch (e) {
    console.warn('Google Sheets deleteTool bypassed:', e);
  }

  const currentTools = await fetchTools();
  const updatedTools = currentTools.filter((t) => t.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(updatedTools));
  }
  return updatedTools;
}

export async function reorderTools(newTools: Tool[]): Promise<Tool[]> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(newTools));
  }
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
  try {
    const sheetPosts = await fetchPostsFromSheets();
    if (sheetPosts && sheetPosts.length > 0) {
      return sheetPosts;
    }
  } catch (e) {
    console.warn('Google Sheets fetchPosts bypassed:', e);
  }

  if (typeof window === 'undefined') return INITIAL_POSTS;
  const data = localStorage.getItem(STORAGE_KEYS.POSTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_POSTS;
  } catch {
    return INITIAL_POSTS;
  }
}

export async function createPost(
  type: PostType,
  content: string,
  authorName: string,
  authorEmail: string
): Promise<Post[]> {
  try {
    const updated = await createPostToSheets(type, content, authorName, authorEmail);
    if (updated && updated.length > 0) {
      return updated;
    }
  } catch (e) {
    console.warn('Google Sheets createPost bypassed:', e);
  }

  const current = await fetchPosts();
  const newPost: Post = {
    id: `post-${Date.now()}`,
    type,
    content,
    author_name: authorName,
    author_email: authorEmail,
    created_at: new Date().toISOString(),
  };
  const updated = [newPost, ...current];

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
  }
  return updated;
}

export async function updatePost(
  id: string,
  content: string,
  type: PostType
): Promise<Post[]> {
  const current = await fetchPosts();
  const updated = current.map((p) =>
    p.id === id ? { ...p, content, type } : p
  );

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
  }
  return updated;
}

export async function deletePost(id: string): Promise<Post[]> {
  const current = await fetchPosts();
  const updated = current.filter((p) => p.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
  }
  return updated;
}
