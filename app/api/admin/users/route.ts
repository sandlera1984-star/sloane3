import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prisma';
import { getSessionUser } from '../../../../lib/auth';

const payloadSchema = z.object({
  id: z.string(),
  isApprovedMember: z.boolean()
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: parsed.data.id },
    data: { isApprovedMember: parsed.data.isApprovedMember }
  });

  return NextResponse.json({ success: true });
}
