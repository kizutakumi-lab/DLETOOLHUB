import { NextResponse } from 'next/server';
import { readHubData, writeHubData } from '@/lib/driveStorage';
import { Tool } from '@/types';

export async function GET() {
  const data = readHubData();
  return NextResponse.json(data.tools);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = readHubData();

    if (body.action === 'delete') {
      const updatedTools = data.tools.filter((t) => t.id !== body.id);
      writeHubData({ ...data, tools: updatedTools });
      return NextResponse.json(updatedTools);
    }

    const toolData = body.tool || body;
    const userEmail = body.userEmail || 'user@dle.jp';
    let updatedTools: Tool[];

    if (toolData.id) {
      updatedTools = data.tools.map((t) =>
        t.id === toolData.id
          ? { ...t, ...toolData, updated_at: new Date().toISOString() }
          : t
      );
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
    return NextResponse.json({ error: 'Failed to process tool request' }, { status: 500 });
  }
}
