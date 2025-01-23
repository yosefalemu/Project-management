import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role_enum", ["admin", "member", "viewer"]);
export const member = pgTable("member", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull(),
  userId: uuid("user_id").notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
