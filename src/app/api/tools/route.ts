import { NextResponse } from 'next/server';
import { fetchToolsFromSheets, saveToolToSheets, deleteToolFromSheets } from '@/lib/googleSheets';

export async function GET() {
  const tools = await fetchToolsFromSheets();
  return NextResponse.json(tools || []);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'delete') {
      const updated = await deleteToolFromSheets(body.id);
      return NextResponse.json(updated || []);
    }
    const updated = await saveToolToSheets(body.tool || body, body.userEmail || 'user@dle.jp');
    return NextResponse.json(updated || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
