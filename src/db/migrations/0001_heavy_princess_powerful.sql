ALTER TABLE "member" RENAME TO "users_to_workspaces";--> statement-breakpoint
ALTER TABLE "users_to_workspaces" DROP CONSTRAINT "member_workspace_id_work_spaces_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_workspaces" DROP CONSTRAINT "member_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_workspaces" DROP CONSTRAINT "member_workspace_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "work_spaces" ALTER COLUMN "created_by" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_workspace_id_user_id_pk" PRIMARY KEY("workspace_id","user_id");--> statement-breakpoint
ALTER TABLE "users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_workspace_id_work_spaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."work_spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_spaces" ADD CONSTRAINT "work_spaces_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_spaces" ADD CONSTRAINT "work_spaces_invite_code_unique" UNIQUE("invite_code");