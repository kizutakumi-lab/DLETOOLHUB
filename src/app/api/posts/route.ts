import { NextResponse } from 'next/server';
import { fetchPostsFromSheets, createPostToSheets } from '@/lib/googleSheets';

export async function GET() {
  const posts = await fetchPostsFromSheets();
  return NextResponse.json(posts || []);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await createPostToSheets(
      body.type || 'その他',
      body.content || '',
      body.authorName || '社内ユーザー',
      body.authorEmail || 'user@dle.jp'
    );
    return NextResponse.json(updated || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process post request' }, { status: 500 });
  }
}
