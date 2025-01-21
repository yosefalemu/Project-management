ALTER TABLE "work_spaces" ADD COLUMN "image" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "work_spaces" DROP COLUMN "image_url";