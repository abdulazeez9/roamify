import 'dotenv/config';
import { createServer } from './server';
import { prisma } from '@zagotours/database';

const port = process.env.PORT || 3000;
const app = createServer();

const server = app.listen(port, () => {
  console.log(`⚡️ API running on ${port}`);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
