import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isAllowedDomain, isAdminUser } from '@/lib/auth';
import { fetchTools, saveTool, reorderTools } from '@/lib/storage';

export async function GET() {
  const tools = await fetchTools();
  return NextResponse.json(tools);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // 認証 & ドメインチェック
  if (!session?.user?.email || !isAllowedDomain(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized: @dle.jp accounts only' }, { status: 401 });
  }

  // 管理者権限チェック
  if (!isAdminUser(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (body.action === 'reorder') {
      const updated = await reorderTools(body.tools);
      return NextResponse.json(updated);
    }

    const updated = await saveTool(body, session.user.email);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
