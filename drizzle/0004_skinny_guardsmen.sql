ALTER TABLE "issue" DROP CONSTRAINT "issue_creator_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "issue" ALTER COLUMN "project_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "issue" DROP COLUMN "creator_id";