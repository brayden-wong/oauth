import { pgTable, serial, text, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  provider: text('provider').notNull().default('google'),
  providerId: text('provider_id').notNull(),
  name: text('name').notNull(),
  emails: text('email').notNull().array(),
  photos: text('photos').notNull().array(),
});
