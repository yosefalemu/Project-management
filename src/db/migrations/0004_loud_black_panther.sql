CREATE TABLE "work_spaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL
);
