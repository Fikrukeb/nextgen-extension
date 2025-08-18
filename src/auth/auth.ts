import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, apiKey, bearer, organization } from 'better-auth/plugins';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

// Static instance with dummy or empty database for CLI only
export const authClient:any = betterAuth({
  database: drizzleAdapter({}, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
  trustedOrigins: ['http://localhost:3000'],
  plugins: [apiKey(), admin(), organization(), bearer()],
});
 

// Factory to create Better Auth instance with actual database for NestJS AppModule
export const createAuthClient:any = (database: NodePgDatabase) =>
  betterAuth({
    database: drizzleAdapter(database, { provider: 'pg' }),
    emailAndPassword: { enabled: true },
    trustedOrigins: ['http://localhost:3000'],
    plugins: [apiKey(), admin(), organization(), bearer()],
  });
