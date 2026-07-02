import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './api/db/schema.ts',
  out: './api/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  }
} satisfies Config;
