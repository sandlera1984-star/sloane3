import { NextResponse } from 'next/server';
import { getSignedUrl } from '@vercel/blob';
import { prisma } from '../../../../lib/prisma';
import { getSessionUser } from '../../../../lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user || !user.isApprovedMember) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const content = await prisma.content.findUnique({ where: { id: params.id } });
  if (!content) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { url } = await getSignedUrl(content.blobUrl, { expiresIn: 60 });
  return NextResponse.redirect(url);
}
