import { Tool, Post, PostType } from '@/types';

const GAS_URL =
  'https://script.google.com/a/macros/dle.jp/s/AKfycbwKzzW9px24Ge-Yxk8HHvmrY1JkW-x73uW99pZM5sO2wMUAQt8Gzj8T-YTfUHsKPFq3/exec';

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
    if (!res.ok) return null;
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
    const res = await fetch(GAS_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'saveTool',
        tool,
        userEmail,
      }),
    });
    if (!res.ok) return null;
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
    const res = await fetch(GAS_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'deleteTool',
        id,
      }),
    });
    if (!res.ok) return null;
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
    if (!res.ok) return null;
    const data = await res.json();
    return data.posts || null;
  } catch (error) {
    console.error('Failed to fetch posts from Google Sheets:', error);
    return null;
  }
}

/**
 * Google スプレッドシートに掲示板メモを投稿
 */
export async function createPostToSheets(
  type: PostType,
  content: string,
  authorName: string,
  authorEmail: string
): Promise<Post[] | null> {
  try {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'createPost',
        type,
        content,
        authorName,
        authorEmail,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.posts || null;
  } catch (error) {
    console.error('Failed to create post to Google Sheets:', error);
    return null;
  }
}
