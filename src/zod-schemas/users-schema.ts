import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "@/db/schema/user";

export const insertUserSchema = createInsertSchema(users, {
  id: (schema) => schema.uuid("Invalid uuid format").optional(),
  name: (schema) =>
    schema
      .nonempty("Name is required")
      .min(3, "Name must be at least 3 characters"),
  email: (schema) =>
    schema.nonempty("Email is required").email("Invalid email format"),
  password: (schema) =>
    schema
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters"),
  confirm_password: (schema) =>
    schema
      .nonempty("Confirm password is required")
      .min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export const selectUserSchema = createSelectSchema(users, {
  id: (schema) => schema.uuid("Invalid uuid format").optional(),
  name: (schema) => schema.optional(),
  email: (schema) =>
    schema.nonempty("Email is required").email("Invalid email"),
  password: (schema) => schema.nonempty("Password is required").optional(),
  confirm_password: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
  updatedAt: (schema) => schema.optional(),
});

export type insertUserType = typeof insertUserSchema._type;
export type selectUserType = typeof selectUserSchema._type;
