import { NextResponse } from 'next/server';
import { readHubData, writeHubData } from '@/lib/driveStorage';
import { Post, PostType } from '@/types';

export async function GET() {
  const data = readHubData();
  return NextResponse.json(data.posts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = readHubData();

    const newPost: Post = {
      id: `post-${Date.now()}`,
      type: (body.type as PostType) || 'その他',
      content: body.content || '',
      author_name: body.authorName || '社内ユーザー',
      author_email: body.authorEmail || 'user@dle.jp',
      created_at: new Date().toISOString(),
    };

    const updatedPosts = [newPost, ...data.posts];
    writeHubData({ ...data, posts: updatedPosts });

    return NextResponse.json(updatedPosts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process post request' }, { status: 500 });
  }
}
