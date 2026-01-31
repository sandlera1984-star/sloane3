import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { createSession } from '../../lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
    include: { user: true }
  });

  if (
    !magicLink ||
    magicLink.usedAt ||
    magicLink.expiresAt < new Date() ||
    !magicLink.user.isApprovedMember
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  await prisma.magicLink.update({
    where: { id: magicLink.id },
    data: { usedAt: new Date() }
  });

  await createSession(magicLink.userId);

  return NextResponse.redirect(new URL('/exclusive', request.url));
}
