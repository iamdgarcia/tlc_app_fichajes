// Prisma seed script: creates default admin if not exists
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminDNI = '00000000A';
  const admin = await prisma.user.findUnique({ where: { dni: adminDNI } });
  if (!admin) {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Administrador',
        dni: adminDNI,
        position: 'Admin',
        role: 'ADMIN',
        password: hash,
      },
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
