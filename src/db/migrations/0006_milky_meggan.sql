ALTER TABLE "work_spaces" DROP CONSTRAINT "Name is unique";--> statement-breakpoint
ALTER TABLE "work_spaces" ADD CONSTRAINT "work_spaces_name_unique" UNIQUE("name");