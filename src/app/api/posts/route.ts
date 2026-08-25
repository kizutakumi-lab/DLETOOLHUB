import { NextResponse } from 'next/server';
import { readHubData, writeHubData } from '@/lib/driveStorage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Post, PostType } from '@/types';

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('dle_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const posts: Post[] = data.map((item: any) => ({
        id: item.id,
        type: item.type,
        content: item.content,
        author_name: item.author_name,
        author_email: item.author_email,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      return NextResponse.json(posts);
    }
    if (error) console.error('Supabase fetch posts error:', error);
  }

  const localData = readHubData();
  return NextResponse.json(localData.posts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = isSupabaseConfigured ? supabase : null;

    if (body.action === 'delete') {
      const targetId = String(body.id);
      if (db) {
        const { error: delErr } = await db.from('dle_posts').delete().eq('id', targetId);
        if (delErr) console.error('Supabase delete post error:', delErr);

        const { data } = await db.from('dle_posts').select('*').order('created_at', { ascending: false });
        if (data) {
          const currentHub = readHubData();
          writeHubData({ ...currentHub, posts: data });
          return NextResponse.json(data);
        }
      }
      const data = readHubData();
      const updatedPosts = data.posts.filter((p) => String(p.id) !== targetId);
      writeHubData({ ...data, posts: updatedPosts });
      return NextResponse.json(updatedPosts);
    }

    if (body.action === 'update') {
      const targetId = String(body.id);
      if (db) {
        const { error: upErr } = await db
          .from('dle_posts')
          .update({
            content: body.content,
            type: body.type,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetId);
        if (upErr) console.error('Supabase update post error:', upErr);

        const { data } = await db.from('dle_posts').select('*').order('created_at', { ascending: false });
        if (data) {
          const currentHub = readHubData();
          writeHubData({ ...currentHub, posts: data });
          return NextResponse.json(data);
        }
      }
      const data = readHubData();
      const updatedPosts = data.posts.map((p) => (String(p.id) === targetId ? { ...p, content: body.content, type: body.type } : p));
      writeHubData({ ...data, posts: updatedPosts });
      return NextResponse.json(updatedPosts);
    }

    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: (body.type as PostType) || 'その他',
      content: body.content || '',
      author_name: body.authorName || '社内ユーザー',
      author_email: body.authorEmail || 'user@dle.jp',
      created_at: new Date().toISOString(),
    };

    if (db) {
      const { error: insErr } = await db.from('dle_posts').insert(newPost);
      if (insErr) console.error('Supabase insert post error:', insErr);

      const { data } = await db.from('dle_posts').select('*').order('created_at', { ascending: false });
      if (data) {
        const currentHub = readHubData();
        writeHubData({ ...currentHub, posts: data });
        return NextResponse.json(data);
      }
    }

    const data = readHubData();
    const updatedPosts = [newPost, ...data.posts];
    writeHubData({ ...data, posts: updatedPosts });

    return NextResponse.json(updatedPosts);
  } catch (error) {
    console.error('Post API POST error:', error);
    return NextResponse.json({ error: 'Failed to process post request' }, { status: 500 });
  }
}
