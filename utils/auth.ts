import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';  

const prisma = new PrismaClient();
export const auth:any = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins:["http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
});
