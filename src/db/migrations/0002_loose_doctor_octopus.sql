CREATE TABLE "start_date" (
	"id" text PRIMARY KEY NOT NULL,
	"start_date" timestamp NOT NULL,
	"user_id" text,
	"workspace_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "start_date" ADD CONSTRAINT "start_date_workspace_id_work_spaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."work_spaces"("id") ON DELETE cascade ON UPDATE no action;