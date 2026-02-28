ALTER TABLE "issue" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "issue" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;