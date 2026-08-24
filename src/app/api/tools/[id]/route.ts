import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isAllowedDomain, isAdminUser } from '@/lib/auth';
import { deleteTool, saveTool } from '@/lib/storage';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !isAllowedDomain(session.user.email) || !isAdminUser(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const updated = await saveTool({ ...body, id: params.id }, session.user.email);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !isAllowedDomain(session.user.email) || !isAdminUser(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updated = await deleteTool(params.id);
  return NextResponse.json(updated);
}
