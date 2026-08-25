import { NextResponse } from 'next/server';
import { readHubData, writeHubData } from '@/lib/driveStorage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Tool } from '@/types';

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('dle_tools')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      const tools: Tool[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        color: item.color || 'blue',
        url: item.url,
        description: item.description || '',
        sort_order: item.sort_order || 0,
        created_by: item.created_by,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      return NextResponse.json(tools);
    }
    if (error) {
      console.error('Supabase fetch tools error:', error);
    }
  }

  const localData = readHubData();
  return NextResponse.json(localData.tools);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = isSupabaseConfigured ? supabase : null;

    if (body.action === 'delete') {
      const targetId = String(body.id);
      if (db) {
        const { error: delErr } = await db.from('dle_tools').delete().eq('id', targetId);
        if (delErr) console.error('Supabase delete tool error:', delErr);
        
        const { data } = await db.from('dle_tools').select('*').order('sort_order', { ascending: true });
        if (data) {
          const tools: Tool[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            color: item.color || 'blue',
            url: item.url,
            description: item.description || '',
            sort_order: item.sort_order || 0,
            created_by: item.created_by,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));
          const currentHub = readHubData();
          writeHubData({ ...currentHub, tools });
          return NextResponse.json(tools);
        }
      }
      const data = readHubData();
      const updatedTools = data.tools.filter((t) => String(t.id) !== targetId);
      writeHubData({ ...data, tools: updatedTools });
      return NextResponse.json(updatedTools);
    }

    const toolData = body.tool || body;
    const userEmail = body.userEmail || 'user@dle.jp';

    if (db) {
      const targetId = toolData.id ? String(toolData.id) : `tool-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      const payload = {
        id: targetId,
        name: toolData.name,
        category: toolData.category,
        color: toolData.color || 'blue',
        url: toolData.url,
        description: toolData.description || '',
        sort_order: toolData.sort_order ?? 0,
        created_by: userEmail,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await db.from('dle_tools').upsert(payload);
      if (upsertErr) console.error('Supabase upsert tool error:', upsertErr);

      const { data } = await db.from('dle_tools').select('*').order('sort_order', { ascending: true });
      if (data) {
        const tools: Tool[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          color: item.color || 'blue',
          url: item.url,
          description: item.description || '',
          sort_order: item.sort_order || 0,
          created_by: item.created_by,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        const currentHub = readHubData();
        writeHubData({ ...currentHub, tools });
        return NextResponse.json(tools);
      }
    }

    const data = readHubData();
    const targetId = toolData.id ? String(toolData.id) : null;
    const exists = targetId ? data.tools.some((t) => String(t.id) === targetId) : false;
    let updatedTools: Tool[];

    if (exists && targetId) {
      updatedTools = data.tools.map((t) => {
        if (String(t.id) === targetId) {
          return {
            ...t,
            name: toolData.name ?? t.name,
            category: toolData.category ?? t.category,
            color: toolData.color ?? t.color,
            url: toolData.url ?? t.url,
            description: toolData.description ?? t.description,
            sort_order: toolData.sort_order ?? t.sort_order,
            updated_at: new Date().toISOString(),
          };
        }
        return t;
      });
    } else {
      const newTool: Tool = {
        id: `tool-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: toolData.name,
        category: toolData.category,
        color: toolData.color || 'blue',
        url: toolData.url,
        description: toolData.description || '',
        sort_order: toolData.sort_order ?? data.tools.length + 1,
        created_by: userEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updatedTools = [...data.tools, newTool];
    }

    writeHubData({ ...data, tools: updatedTools });
    return NextResponse.json(updatedTools);
  } catch (error) {
    console.error('Tool API POST error:', error);
    return NextResponse.json({ error: 'Failed to process tool request' }, { status: 500 });
  }
}
