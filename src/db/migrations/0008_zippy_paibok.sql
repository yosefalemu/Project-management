ALTER TABLE "user" DROP CONSTRAINT "user_last_workspace_id_work_spaces_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_last_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "test" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_last_workspace_id_work_spaces_id_fk" FOREIGN KEY ("last_workspace_id") REFERENCES "public"."work_spaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_last_project_id_project_id_fk" FOREIGN KEY ("last_project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "test_schema";