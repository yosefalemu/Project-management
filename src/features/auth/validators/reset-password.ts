import z from "zod";

export const resetPasswordFrontendSchema = z
  .object({
    token: z.string().nonempty("Token is required"),
    newPassword: z
      .string()
      .nonempty("New password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .nonempty("Confirm password is required")
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordBackendSchema = z.object({
  newPassword: z
    .string()
    .nonempty("New password is required")
    .min(8, "Password must be at least 8 characters long"),
  token: z.string().nonempty("Token is required"),
});

export type ResetPasswordFrontendSchemaType = z.infer<
  typeof resetPasswordFrontendSchema
>;

export type ResetPasswordBackendSchemaType = z.infer<
  typeof resetPasswordBackendSchema
>;
