ALTER TABLE "user" DROP CONSTRAINT "user_last_workspace_id_work_spaces_id_fk";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_last_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "test_schema" text;