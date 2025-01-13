import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const workSpaces = pgTable("work_spaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  userId: uuid("user_id").notNull(),
});
