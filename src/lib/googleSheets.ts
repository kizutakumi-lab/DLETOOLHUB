import { Tool, Post, PostType } from '@/types';

const GAS_URL =
  'https://script.google.com/a/macros/dle.jp/s/AKfycbzaVXPx16lhLdWbFetjbyQobnTOI0XaNzh_p75a_8tLuV8192xo5ep0GpDQPhe-TbSZ/exec';

export const isGoogleSheetsConfigured = true;

/**
 * Google スプレッドシートからツール一覧を取得
 */
export async function fetchToolsFromSheets(): Promise<Tool[] | null> {
  try {
    const res = await fetch(`${GAS_URL}?action=getTools`, {
      cache: 'no-store',
      redirect: 'follow',
    });
    const data = await res.json();
    return data.tools || null;
  } catch (error) {
    console.error('Failed to fetch tools from Google Sheets:', error);
    return null;
  }
}

/**
 * Google スプレッドシートにツールを保存 (追加・更新)
 */
export async function saveToolToSheets(
  tool: Omit<Tool, 'id'> & { id?: string },
  userEmail: string
): Promise<Tool[] | null> {
  try {
    const params = new URLSearchParams({
      action: 'saveTool',
      id: tool.id || '',
      name: tool.name || '',
      category: tool.category || '',
      color: tool.color || 'blue',
      url: tool.url || '',
      description: tool.description || '',
      sort_order: String(tool.sort_order || 0),
      userEmail: userEmail || '',
    });
    const res = await fetch(`${GAS_URL}?${params.toString()}`, {
      cache: 'no-store',
      redirect: 'follow',
    });
    const data = await res.json();
    return data.tools || null;
  } catch (error) {
    console.error('Failed to save tool to Google Sheets:', error);
    return null;
  }
}

/**
 * Google スプレッドシートからツールを削除
 */
export async function deleteToolFromSheets(id: string): Promise<Tool[] | null> {
  try {
    const params = new URLSearchParams({
      action: 'deleteTool',
      id,
    });
    const res = await fetch(`${GAS_URL}?${params.toString()}`, {
      cache: 'no-store',
      redirect: 'follow',
    });
    const data = await res.json();
    return data.tools || null;
  } catch (error) {
    console.error('Failed to delete tool from Google Sheets:', error);
    return null;
  }
}

/**
 * Google スプレッドシートから掲示板メモ一覧を取得
 */
export async function fetchPostsFromSheets(): Promise<Post[] | null> {
  try {
    const res = await fetch(`${GAS_URL}?action=getPosts`, {
      cache: 'no-store',
      redirect: 'follow',
    });
    const data = await res.json();
    return data.posts || null;
  } catch (error) {
    console.error('Failed to fetch posts from Google Sheets:', error);
    return null;
  }
}

/**
 * Google スプレッドシートに掲示板メモを投稿 (GETパラメータでCORS完全回避)
 */
export async function createPostToSheets(
  type: PostType,
  content: string,
  authorName: string,
  authorEmail: string
): Promise<Post[] | null> {
  try {
    const params = new URLSearchParams({
      action: 'createPost',
      type: type || 'その他',
      content: content || '',
      authorName: authorName || '社内ユーザー',
      authorEmail: authorEmail || 'user@dle.jp',
    });
    const res = await fetch(`${GAS_URL}?${params.toString()}`, {
      cache: 'no-store',
      redirect: 'follow',
    });
    const data = await res.json();
    return data.posts || null;
  } catch (error) {
    console.error('Failed to create post to Google Sheets:', error);
    return null;
  }
}
