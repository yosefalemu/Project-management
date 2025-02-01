ALTER TABLE "users_to_workspaces" RENAME TO "member";--> statement-breakpoint
ALTER TABLE "work_spaces" DROP CONSTRAINT "work_spaces_invite_code_unique";--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "users_to_workspaces_workspace_id_work_spaces_id_fk";
--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "users_to_workspaces_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "work_spaces" DROP CONSTRAINT "work_spaces_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "users_to_workspaces_workspace_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "work_spaces" ALTER COLUMN "created_by" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "public"."member" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."role_enum";--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('admin', 'member', 'viewer');--> statement-breakpoint
ALTER TABLE "public"."member" ALTER COLUMN "role" SET DATA TYPE "public"."role_enum" USING "role"::"public"."role_enum";--> statement-breakpoint
DROP TYPE "public"."issue_type";--> statement-breakpoint
DROP TYPE "public"."priority";