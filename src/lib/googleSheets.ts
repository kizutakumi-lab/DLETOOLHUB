import { Tool, Post, PostType } from '@/types';

const GAS_URL =
  'https://script.google.com/a/macros/dle.jp/s/AKfycbzaVXPx16lhLdWbFetjbyQobnTOI0XaNzh_p75a_8tLuV8192xo5ep0GpDQPhe-TbSZ/exec';

export const isGoogleSheetsConfigured = true;

/**
 * Google スプレッドシートからツール一覧を動的取得
 */
export async function fetchToolsFromSheets(): Promise<Tool[]> {
  try {
    const res = await fetch(`${GAS_URL}?action=getTools`, {
      cache: 'no-store',
      redirect: 'follow',
    });
    const text = await res.text();
    const data = JSON.parse(text);
    return Array.isArray(data.tools) ? data.tools : [];
  } catch (error) {
    console.error('Failed to fetch tools from Google Sheets:', error);
    return [];
  }
}

/**
 * Google スプレッドシートにツールを保存 (追加・更新) して最新の全ツール配列を取得
 */
export async function saveToolToSheets(
  tool: Omit<Tool, 'id'> & { id?: string },
  userEmail: string
): Promise<Tool[]> {
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
    const text = await res.text();
    const data = JSON.parse(text);
    return Array.isArray(data.tools) ? data.tools : [];
  } catch (error) {
    console.error('Failed to save tool to Google Sheets:', error);
    return await fetchToolsFromSheets();
  }
}

/**
 * Google スプレッドシートからツールを削除して最新の全ツール配列を取得
 */
export async function deleteToolFromSheets(id: string): Promise<Tool[]> {
  try {
    const params = new URLSearchParams({
      action: 'deleteTool',
      id,
    });
    const res = await fetch(`${GAS_URL}?${params.toString()}`, {
      cache: 'no-store',
      redirect: 'follow',
    });
    const text = await res.text();
    const data = JSON.parse(text);
    return Array.isArray(data.tools) ? data.tools : [];
  } catch (error) {
    console.error('Failed to delete tool from Google Sheets:', error);
    return await fetchToolsFromSheets();
  }
}

/**
 * Google スプレッドシートから掲示板メモ一覧を動的取得
 */
export async function fetchPostsFromSheets(): Promise<Post[]> {
  try {
    const res = await fetch(`${GAS_URL}?action=getPosts`, {
      cache: 'no-store',
      redirect: 'follow',
    });
    const text = await res.text();
    const data = JSON.parse(text);
    return Array.isArray(data.posts) ? data.posts : [];
  } catch (error) {
    console.error('Failed to fetch posts from Google Sheets:', error);
    return [];
  }
}

/**
 * Google スプレッドシートに掲示板メモを投稿して最新の全メモ配列を取得
 */
export async function createPostToSheets(
  type: PostType,
  content: string,
  authorName: string,
  authorEmail: string
): Promise<Post[]> {
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
    const text = await res.text();
    const data = JSON.parse(text);
    return Array.isArray(data.posts) ? data.posts : [];
  } catch (error) {
    console.error('Failed to create post to Google Sheets:', error);
    return await fetchPostsFromSheets();
  }
}
