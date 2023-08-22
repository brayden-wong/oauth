CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" text DEFAULT 'google' NOT NULL,
	"display_name" text NOT NULL,
	"name" text NOT NULL,
	"email" text[],
	"photos" text[]
);
