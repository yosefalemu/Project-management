import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const project = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  description: varchar("description").notNull(),
  workspaceId: uuid("workspace_id").notNull(),
  inviteCode: varchar("invite_code").notNull(),
  image: text("image").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
