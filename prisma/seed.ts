import 'dotenv/config';

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
console.log(process.env.DATABASE_URL);
const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.user.createMany({
    data: [
      {
        name: 'Dilip',
        email: 'dilip@example.com',
        password: 'password123',
      },
      {
        name: 'Rahul',
        email: 'rahul@example.com',
        password: 'password123',
      },
      {
        name: 'Aman',
        email: 'aman@example.com',
        password: 'password123',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });