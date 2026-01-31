import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

const payloadSchema = z.object({
  enabled: z.boolean()
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { notifyOptIn: parsed.data.enabled }
  });

  return NextResponse.json({ success: true });
}
