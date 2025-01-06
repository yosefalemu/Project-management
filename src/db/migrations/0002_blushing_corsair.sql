ALTER TABLE "users" ALTER COLUMN "confirm_password" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "confirm_password" DROP NOT NULL;