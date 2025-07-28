import z from "zod";

export const changePasswordFrontendSchema = z
  .object({
    oldPassword: z.string().nonempty("Old password is required"),
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
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password cannot be the same as old password",
    path: ["newPassword"],
  });

export const changePasswordBackendSchema = z.object({
  newPassword: z
    .string()
    .nonempty("New password is required")
    .min(8, "Password must be at least 8 characters long"),
  oldPassword: z.string().nonempty("Old password is required"),
});

export type ChangePasswordFrontendSchemaType = z.infer<
  typeof changePasswordFrontendSchema
>;

export type ChangePasswordBackendSchemaType = z.infer<
  typeof changePasswordBackendSchema
>;
