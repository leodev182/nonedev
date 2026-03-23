ALTER TABLE "admins" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "tags" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "contact_messages" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "tags" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "platforms" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "stack" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "locale" text DEFAULT 'es' NOT NULL;