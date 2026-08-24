import fs from 'fs';
import path from 'path';
import { Tool, Post, PostType } from '@/types';
import { INITIAL_TOOLS, INITIAL_POSTS } from './initialData';

export const SHARED_DRIVE_FOLDER_ID = '1qiR7NXGWcRliOztwTS30zSqTr1DMm231';
export const SHARED_DRIVE_URL = `https://drive.google.com/drive/u/1/folders/${SHARED_DRIVE_FOLDER_ID}`;

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'data.json');

interface HubData {
  tools: Tool[];
  posts: Post[];
}

/**
 * データファイルの安全読み込み (共有ドライブ連動 ＆ ローカル保護)
 */
export function readHubData(): HubData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        tools: Array.isArray(parsed.tools) && parsed.tools.length > 0 ? parsed.tools : INITIAL_TOOLS,
        posts: Array.isArray(parsed.posts) && parsed.posts.length > 0 ? parsed.posts : INITIAL_POSTS,
      };
    }
  } catch (error) {
    console.error('Failed to read data.json:', error);
  }

  return {
    tools: INITIAL_TOOLS,
    posts: INITIAL_POSTS,
  };
}

/**
 * データファイルの即時書き込み・保護保存
 */
export function writeHubData(data: HubData): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write data.json:', error);
  }
}
