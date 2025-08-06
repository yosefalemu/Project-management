CREATE TABLE "channel" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"project_id" text NOT NULL,
	"creator_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channel_members" (
	"id" text PRIMARY KEY NOT NULL,
	"channel_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "channel_members_channel_id_user_id_unique" UNIQUE("channel_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "channel" ADD CONSTRAINT "channel_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel" ADD CONSTRAINT "channel_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_channel_id_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cm_channel_id_idx" ON "channel_members" USING btree ("channel_id");--> statement-breakpoint
CREATE INDEX "cm_user_id_idx" ON "channel_members" USING btree ("user_id");