import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { parseArgs } from 'util';

const prisma = new PrismaClient();

async function main() {
  const { values } = parseArgs({
    options: {
      email: { type: 'string' },
      password: { type: 'string' },
      name: { type: 'string', default: 'Esther Akinsola' },
    },
  });

  const { email, password, name } = values;

  if (!email || !password) {
    console.error('❌ Missing arguments!');
    console.log(
      'Usage: npm run db:create-admin -- --email=admin@example.com --password=pass',
    );
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: { role: 'SUPER_ADMIN' },
      create: {
        email,
        name,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        referralCode: `SUP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      },
    });

    console.log(`✅ Admin status confirmed for: ${user.email}`);
  } catch (error) {
    console.error('❌ Database Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
