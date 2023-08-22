ALTER TABLE "users" ADD COLUMN "provider_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "display_name";