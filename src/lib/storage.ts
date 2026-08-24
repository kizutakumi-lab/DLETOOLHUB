import { Tool, Post, PostType } from '@/types';

const STORAGE_KEYS = {
  FAVORITES_PREFIX: 'dle_hub_favorites_',
};

// -------------------------------------------------------------
// ツール (Tools) の完全動的操作 (API Route経由でスプレッドシート通信)
// -------------------------------------------------------------

export async function fetchTools(): Promise<Tool[]> {
  try {
    const res = await fetch('/api/tools', { cache: 'no-store' });
    if (res.ok) {
      const tools = await res.json();
      return Array.isArray(tools) ? tools : [];
    }
  } catch (e) {
    console.error('Failed to fetch tools via API route:', e);
  }
  return [];
}

export async function saveTool(
  toolData: Omit<Tool, 'id'> & { id?: string },
  userEmail: string
): Promise<Tool[]> {
  try {
    const res = await fetch('/api/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: toolData, userEmail }),
    });
    if (res.ok) {
      const tools = await res.json();
      return Array.isArray(tools) ? tools : [];
    }
  } catch (e) {
    console.error('Failed to save tool via API route:', e);
  }
  return await fetchTools();
}

export async function deleteTool(id: string): Promise<Tool[]> {
  try {
    const res = await fetch('/api/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    if (res.ok) {
      const tools = await res.json();
      return Array.isArray(tools) ? tools : [];
    }
  } catch (e) {
    console.error('Failed to delete tool via API route:', e);
  }
  return await fetchTools();
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
// 掲示板メモ (Posts) の完全動的操作 (API Route経由でスプレッドシート通信)
// -------------------------------------------------------------

export async function fetchPosts(): Promise<Post[]> {
  try {
    const res = await fetch('/api/posts', { cache: 'no-store' });
    if (res.ok) {
      const posts = await res.json();
      return Array.isArray(posts) ? posts : [];
    }
  } catch (e) {
    console.error('Failed to fetch posts via API route:', e);
  }
  return [];
}

export async function createPost(
  type: PostType,
  content: string,
  authorName: string,
  authorEmail: string
): Promise<Post[]> {
  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, content, authorName, authorEmail }),
    });
    if (res.ok) {
      const posts = await res.json();
      return Array.isArray(posts) ? posts : [];
    }
  } catch (e) {
    console.error('Failed to create post via API route:', e);
  }
  return await fetchPosts();
}

export async function updatePost(
  id: string,
  content: string,
  type: PostType
): Promise<Post[]> {
  return await fetchPosts();
}

export async function deletePost(id: string): Promise<Post[]> {
  return await fetchPosts();
}
