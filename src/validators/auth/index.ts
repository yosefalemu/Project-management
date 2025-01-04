import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password length must be at least 8 character"),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty("Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: z.string().nonempty("Email is required").email("Invalid email"),
    password: z
      .string()
      .trim()
      .nonempty("Password is required")
      .min(8, "Password length must be at least 8 character"),
    confirm_password: z
      .string()
      .trim()
      .nonempty("Confirm password is required")
      .min(8, "Password length must be at least 8 character"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type SignUpSchemaType = z.infer<typeof signupSchema>;
