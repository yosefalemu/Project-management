ALTER TABLE "project" DROP CONSTRAINT "project_invite_code_unique";--> statement-breakpoint
ALTER TABLE "work_spaces" DROP CONSTRAINT "work_spaces_invite_code_unique";--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "invite_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "is_private" boolean DEFAULT false NOT NULL;