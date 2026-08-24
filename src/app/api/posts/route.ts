import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchPostsFromSheets, createPostToSheets } from '@/lib/googleSheets';

export async function GET() {
  const posts = await fetchPostsFromSheets();
  return NextResponse.json(posts || []);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { type, content } = await req.json();

  const authorName = session?.user?.name || '社内ユーザー';
  const authorEmail = session?.user?.email || 'kizu.takumi@dle.jp';

  const updated = await createPostToSheets(type, content, authorName, authorEmail);
  return NextResponse.json(updated || []);
}
