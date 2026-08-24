import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isAllowedDomain, isAdminUser } from '@/lib/auth';
import { fetchPosts, createPost, updatePost, deletePost } from '@/lib/storage';

export async function GET() {
  const posts = await fetchPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const { type, content } = await req.json();
  const authorName = session?.user?.name || '社内ユーザー';
  const authorEmail = session?.user?.email || 'kizu.takumi@dle.jp';

  const updated = await createPost(type, content, authorName, authorEmail);
  return NextResponse.json(updated);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  const { id, content, type } = await req.json();
  const posts = await fetchPosts();
  const target = posts.find((p) => p.id === id);

  if (!target) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const updated = await updatePost(id, content, type);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const posts = await fetchPosts();
  const target = posts.find((p) => p.id === id);

  if (!target) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const updated = await deletePost(id);
  return NextResponse.json(updated);
}
