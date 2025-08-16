import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, apiKey, organization } from 'better-auth/plugins';

export const auth: any = betterAuth({
  database: drizzleAdapter(
    {},
    {
      provider: 'pg',
    },
  ),
   plugins: [apiKey(), admin(), organization()],
});
