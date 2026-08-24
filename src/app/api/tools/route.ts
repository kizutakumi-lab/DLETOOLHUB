import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchToolsFromSheets, saveToolToSheets } from '@/lib/googleSheets';

export async function GET() {
  const tools = await fetchToolsFromSheets();
  return NextResponse.json(tools || []);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  try {
    const body = await req.json();
    const userEmail = session?.user?.email || 'admin@dle.jp';
    const updated = await saveToolToSheets(body, userEmail);
    return NextResponse.json(updated || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
