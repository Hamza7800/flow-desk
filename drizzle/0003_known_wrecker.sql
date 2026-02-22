ALTER TABLE "issue" ADD COLUMN "team_id" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "team_id" text;--> statement-breakpoint
ALTER TABLE "issue" ADD CONSTRAINT "issue_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;