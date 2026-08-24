import { Tool, Post, Favorite, PostType } from '@/types';
import { INITIAL_TOOLS, INITIAL_POSTS } from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const TOOLS_KEY = 'dle_portal_tools_v1';
const POSTS_KEY = 'dle_portal_posts_v1';
const FAVORITES_KEY = 'dle_portal_favorites_v1';

// --- Tools ---
export async function fetchTools(): Promise<Tool[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Tool[];
      }
    } catch (e) {
      console.warn('Supabase fetch error, fallback to local:', e);
    }
  }

  // LocalStorage / Memory Fallback
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(TOOLS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        // pass
      }
    }
    // 初期データ保存
    localStorage.setItem(TOOLS_KEY, JSON.stringify(INITIAL_TOOLS));
  }
  return INITIAL_TOOLS;
}

export async function saveTool(toolData: Omit<Tool, 'id'> & { id?: string }, userEmail?: string): Promise<Tool[]> {
  const currentTools = await fetchTools();

  let updatedTools: Tool[];
  if (toolData.id) {
    // 編集
    updatedTools = currentTools.map((t) =>
      t.id === toolData.id ? { ...t, ...toolData, updated_at: new Date().toISOString() } : t
    );
  } else {
    // 新規作成
    const newTool: Tool = {
      id: `tool-${Date.now()}`,
      name: toolData.name,
      category: toolData.category,
      description: toolData.description,
      url: toolData.url,
      sort_order: toolData.sort_order || currentTools.length + 1,
      created_at: new Date().toISOString(),
      created_by: userEmail,
    };
    updatedTools = [...currentTools, newTool];
  }

  if (isSupabaseConfigured && supabase) {
    try {
      if (toolData.id) {
        await supabase
          .from('tools')
          .update({
            name: toolData.name,
            category: toolData.category,
            description: toolData.description,
            url: toolData.url,
            sort_order: toolData.sort_order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', toolData.id);
      } else {
        await supabase.from('tools').insert([
          {
            name: toolData.name,
            category: toolData.category,
            description: toolData.description,
            url: toolData.url,
            sort_order: toolData.sort_order || currentTools.length + 1,
            created_by: userEmail,
          },
        ]);
      }
    } catch (e) {
      console.warn('Supabase save error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(TOOLS_KEY, JSON.stringify(updatedTools));
  }
  return updatedTools;
}

export async function deleteTool(toolId: string): Promise<Tool[]> {
  const currentTools = await fetchTools();
  const updatedTools = currentTools.filter((t) => t.id !== toolId);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('tools').delete().eq('id', toolId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(TOOLS_KEY, JSON.stringify(updatedTools));
  }
  return updatedTools;
}

export async function reorderTools(tools: Tool[]): Promise<Tool[]> {
  const updated = tools.map((t, idx) => ({ ...t, sort_order: idx + 1 }));

  if (isSupabaseConfigured && supabase) {
    try {
      for (const t of updated) {
        await supabase.from('tools').update({ sort_order: t.sort_order }).eq('id', t.id);
      }
    } catch (e) {
      console.warn('Supabase reorder error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(TOOLS_KEY, JSON.stringify(updated));
  }
  return updated;
}

// --- Favorites ---
export async function fetchFavorites(userEmail: string): Promise<string[]> {
  if (!userEmail) return [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('tool_id')
        .eq('user_email', userEmail);

      if (!error && data) {
        return data.map((d) => d.tool_id);
      }
    } catch (e) {
      console.warn('Supabase favorites fetch error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(`${FAVORITES_KEY}_${userEmail}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
  }
  return [];
}

export async function toggleFavorite(userEmail: string, toolId: string): Promise<string[]> {
  const currentFavs = await fetchFavorites(userEmail);
  let updated: string[];

  if (currentFavs.includes(toolId)) {
    updated = currentFavs.filter((id) => id !== toolId);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('favorites').delete().match({ user_email: userEmail, tool_id: toolId });
      } catch (e) {}
    }
  } else {
    updated = [...currentFavs, toolId];
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('favorites').insert([{ user_email: userEmail, tool_id: toolId }]);
      } catch (e) {}
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(`${FAVORITES_KEY}_${userEmail}`, JSON.stringify(updated));
  }
  return updated;
}

// --- Posts (掲示板メモ) ---
export async function fetchPosts(): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Post[];
      }
    } catch (e) {
      console.warn('Supabase posts fetch error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(POSTS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
  }
  return INITIAL_POSTS;
}

export async function createPost(
  type: PostType,
  content: string,
  authorName: string,
  authorEmail: string
): Promise<Post[]> {
  const currentPosts = await fetchPosts();
  const newPost: Post = {
    id: `post-${Date.now()}`,
    type,
    content,
    author_name: authorName,
    author_email: authorEmail,
    created_at: new Date().toISOString(),
  };

  const updated = [newPost, ...currentPosts];

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('posts').insert([
        {
          type,
          content,
          author_name: authorName,
          author_email: authorEmail,
        },
      ]);
    } catch (e) {
      console.warn('Supabase post create error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export async function updatePost(id: string, content: string, type: PostType): Promise<Post[]> {
  const currentPosts = await fetchPosts();
  const updated = currentPosts.map((p) =>
    p.id === id ? { ...p, content, type, updated_at: new Date().toISOString() } : p
  );

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('posts')
        .update({ content, type, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export async function deletePost(id: string): Promise<Post[]> {
  const currentPosts = await fetchPosts();
  const updated = currentPosts.filter((p) => p.id !== id);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('posts').delete().eq('id', id);
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  }
  return updated;
}
