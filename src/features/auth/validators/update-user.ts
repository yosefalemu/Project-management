import z from "zod";

export const updateUserInfoSchema = z.object({
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => !value || /^\+?[1-9]\d{10,14}$/.test(value), {
      message: "Phone number must be a valid international format",
    }),
  image: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
});

export const updateUserEmailSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
});

export type updateUserInfoSchemaType = z.infer<typeof updateUserInfoSchema>;
export type updateUserEmailSchemaType = z.infer<typeof updateUserEmailSchema>;
