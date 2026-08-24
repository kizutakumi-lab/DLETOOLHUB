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

  if (!session?.user?.email || !isAllowedDomain(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized: @dle.jp required' }, { status: 401 });
  }

  const { type, content } = await req.json();
  const authorName = session.user.name || '社内ユーザー';
  const updated = await createPost(type, content, authorName, session.user.email);
  return NextResponse.json(updated);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !isAllowedDomain(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, content, type } = await req.json();
  const posts = await fetchPosts();
  const target = posts.find((p) => p.id === id);

  if (!target) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // 自分の投稿のみ編集可能
  if (target.author_email.toLowerCase() !== session.user.email.toLowerCase()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updated = await updatePost(id, content, type);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !isAllowedDomain(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const posts = await fetchPosts();
  const target = posts.find((p) => p.id === id);

  if (!target) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const isAuthor = target.author_email.toLowerCase() === session.user.email.toLowerCase();
  const isAdmin = isAdminUser(session.user.email);

  if (!isAuthor && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updated = await deletePost(id);
  return NextResponse.json(updated);
}
