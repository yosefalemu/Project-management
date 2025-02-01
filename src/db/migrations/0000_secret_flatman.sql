CREATE TYPE "public"."issue_type" AS ENUM('STORY', 'BUG', 'TASK');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('LOW', 'MEDIUM', 'HIGH');--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('ADMIN', 'MEMBER');--> statement-breakpoint
CREATE TABLE "member" (
	"workspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "role_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "member_workspace_id_user_id_pk" PRIMARY KEY("workspace_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"confirm_password" varchar DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "work_spaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"created_by" uuid DEFAULT gen_random_uuid() NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"invite_code" varchar NOT NULL,
	"invite_code_expire" timestamp DEFAULT NOW() + INTERVAL '7 days',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "work_spaces_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_workspace_id_work_spaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."work_spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;