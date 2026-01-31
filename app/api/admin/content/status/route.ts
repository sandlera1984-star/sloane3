import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { prisma } from '../../../../../lib/prisma';
import { getSessionUser } from '../../../../../lib/auth';
import { sendNewContentEmails } from '../../../../../lib/email';

const payloadSchema = z.object({
  id: z.string(),
  isPublished: z.boolean(),
  notify: z.boolean().optional()
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

  await prisma.content.update({
    where: { id: parsed.data.id },
    data: { isPublished: parsed.data.isPublished }
  });

  if (parsed.data.isPublished && parsed.data.notify) {
    const recipients = await prisma.user.findMany({
      where: { isApprovedMember: true, notifyOptIn: true },
      select: { email: true, id: true }
    });

    const magicLinks: Record<string, string> = {};
    await Promise.all(
      recipients.map(async (recipient) => {
        const token = randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 15);
        await prisma.magicLink.create({
          data: {
            token,
            userId: recipient.id,
            expiresAt
          }
        });
        magicLinks[recipient.email] = token;
      })
    );

    await sendNewContentEmails({
      recipients: recipients.map((recipient) => recipient.email),
      magicLinks
    });
  }

  return NextResponse.json({ success: true });
}
