import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const workSpaces = pgTable("work_spaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull().unique(),
  userId: uuid("user_id").notNull().defaultRandom(),
  image: text("image").notNull().default(""),
});
