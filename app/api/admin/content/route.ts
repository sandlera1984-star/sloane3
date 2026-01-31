import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';
import { prisma } from '../../../../lib/prisma';
import { getSessionUser } from '../../../../lib/auth';
import { sendNewContentEmails } from '../../../../lib/email';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const title = String(formData.get('title') ?? '');
  const description = String(formData.get('description') ?? '');
  const isLocked = formData.get('isLocked') === 'on';
  const isPublished = formData.get('isPublished') === 'on';
  const notify = formData.get('notify') === 'on';
  const file = formData.get('file');
  const thumbnail = formData.get('thumbnail');

  if (!title || !(file instanceof File) || !(thumbnail instanceof File)) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const fileKey = `content/${randomUUID()}-${file.name}`;
  const thumbKey = `content/${randomUUID()}-${thumbnail.name}`;

  const [blob, thumbBlob] = await Promise.all([
    put(fileKey, file, { access: 'private' }),
    put(thumbKey, thumbnail, { access: 'public' })
  ]);

  const created = await prisma.content.create({
    data: {
      title,
      description: description || null,
      blobUrl: blob.url,
      thumbnailUrl: thumbBlob.url,
      isLocked,
      isPublished
    }
  });

  if (isPublished && notify) {
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

  return NextResponse.json({ success: true, id: created.id });
}
