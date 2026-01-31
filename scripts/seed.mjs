import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD to seed an admin user.');
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 10);

await prisma.user.upsert({
  where: { email },
  update: {
    passwordHash,
    isAdmin: true
  },
  create: {
    email,
    passwordHash,
    isAdmin: true,
    isApprovedMember: true
  }
});

console.log('Admin user ready.');
await prisma.$disconnect();
