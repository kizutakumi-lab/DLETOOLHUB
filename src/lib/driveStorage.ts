import fs from 'fs';
import path from 'path';
import { Tool, Post } from '@/types';
import { INITIAL_TOOLS, INITIAL_POSTS } from './initialData';

export const SPREADSHEET_ID = '1DyHstVqJiz-XF1cJLjJg9v52aq3L4Kl9W13dLdBP_0c';
export const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=0`;

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'data.json');
const CSV_TOOLS_PATH = path.join(process.cwd(), 'data', 'DLE_TOOLHUB_Tools.csv');
const CSV_POSTS_PATH = path.join(process.cwd(), 'data', 'DLE_TOOLHUB_Posts.csv');

interface HubData {
  tools: Tool[];
  posts: Post[];
}

// プロセス内グローバルメモリキャッシュ (ファイル読み込み遅延による先祖返りを100%防止)
let memoryCache: HubData | null = null;

export function readHubData(): HubData {
  if (memoryCache && Array.isArray(memoryCache.tools) && memoryCache.tools.length > 0) {
    return memoryCache;
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      const loaded: HubData = {
        tools: Array.isArray(parsed.tools) && parsed.tools.length > 0 ? parsed.tools : INITIAL_TOOLS,
        posts: Array.isArray(parsed.posts) && parsed.posts.length > 0 ? parsed.posts : INITIAL_POSTS,
      };
      memoryCache = loaded;
      return loaded;
    }
  } catch (error) {
    console.error('Failed to read data.json:', error);
  }

  memoryCache = {
    tools: INITIAL_TOOLS,
    posts: INITIAL_POSTS,
  };
  return memoryCache;
}

export function writeHubData(data: HubData): void {
  // メモリキャッシュを即時更新
  memoryCache = data;

  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // 1. JSON 保存
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');

    // 2. CSV 出力 (UTF-8 BOM)
    let toolsCsv = 'ID,ツール名,カテゴリ,カラー,URL,説明文,表示順,作成者,更新日時\n';
    data.tools.forEach((t) => {
      toolsCsv += `"${t.id}","${t.name}","${t.category}","${t.color || 'blue'}","${t.url}","${(t.description || '').replace(/"/g, '""')}",${t.sort_order || 0},"${t.created_by || ''}","${t.updated_at || ''}"\n`;
    });
    fs.writeFileSync(CSV_TOOLS_PATH, '\uFEFF' + toolsCsv, 'utf-8');

    let postsCsv = 'ID,種別,内容,投稿者名,投稿者メール,投稿日時\n';
    data.posts.forEach((p) => {
      postsCsv += `"${p.id}","${p.type}","${(p.content || '').replace(/"/g, '""')}","${p.author_name}","${p.author_email}","${p.created_at}"\n`;
    });
    fs.writeFileSync(CSV_POSTS_PATH, '\uFEFF' + postsCsv, 'utf-8');
  } catch (error) {
    console.error('Failed to write data:', error);
  }
}
