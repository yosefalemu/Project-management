import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const workSpaces = pgTable("work_spaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull().unique(),
  description: text("description").notNull(),
  createdBy: uuid("created_by").notNull().defaultRandom(),
  image: text("image").notNull().default(""),
  inviteCode: varchar("invite_code").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
