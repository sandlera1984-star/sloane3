import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { randomUUID } from 'crypto';

const SESSION_COOKIE = 'sloanex_session';

export async function createSession(userId: string) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt
    }
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt
  });
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookies().set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
}

export async function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });
  if (!session || session.expiresAt < new Date()) {
    return null;
  }
  return session.user;
}
