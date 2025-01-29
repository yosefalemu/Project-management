ALTER TABLE "work_spaces" ALTER COLUMN "invite_code_expire" SET DEFAULT NOW() + INTERVAL '7 days';--> statement-breakpoint
ALTER TABLE "work_spaces" ALTER COLUMN "invite_code_expire" DROP NOT NULL;