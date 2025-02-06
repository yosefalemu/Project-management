ALTER TABLE "public"."member" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."task" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."role_enum";--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('backlog', 'todo', 'in_progress', 'in_review', 'done');--> statement-breakpoint
ALTER TABLE "public"."member" ALTER COLUMN "role" SET DATA TYPE "public"."role_enum" USING "role"::"public"."role_enum";--> statement-breakpoint
ALTER TABLE "public"."task" ALTER COLUMN "status" SET DATA TYPE "public"."role_enum" USING "status"::"public"."role_enum";