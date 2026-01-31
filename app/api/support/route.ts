import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import { getSessionUser } from '../../../lib/auth';
import { sendSupportEmail } from '../../../lib/email';

const payloadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  issue: z.string().min(1).max(2000)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const wordCount = parsed.data.issue.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount > 200) {
    return NextResponse.json({ error: 'Issue exceeds 200 words.' }, { status: 400 });
  }

  const user = await getSessionUser();

  await prisma.supportTicket.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      issue: parsed.data.issue,
      userId: user?.id
    }
  });

  await sendSupportEmail(parsed.data);

  return NextResponse.json({ success: true });
}
