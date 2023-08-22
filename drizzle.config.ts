import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
config({
  path: '.env',
});

export default {
  driver: 'pg',
  dbCredentials: {
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  out: './.drizzle',
  schema: './src/schema.ts',
} satisfies Config;
