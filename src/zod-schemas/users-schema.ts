import { user } from "@/db/schema/schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

export const insertUserSchema = createInsertSchema(user, {
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
})
  .extend({
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginUserSchema = createInsertSchema(user, {
  id: (schema) => schema.optional(),
  name: (schema) => schema.optional(),
  email: (schema) =>
    schema.nonempty("Email is required").email("Invalid email format"),
  password: (schema) =>
    schema
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters"),
});

export const selectUserSchema = createInsertSchema(user, {
  name: (schema) => schema.optional(),
  email: (schema) =>
    schema.nonempty("Email is required").email("Invalid email format"),
  password: (schema) =>
    schema
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters"),
});
export type insertUserType = typeof insertUserSchema._type;
export type loginUserType = typeof loginUserSchema._type;
export type selectUserType = typeof selectUserSchema._type;
