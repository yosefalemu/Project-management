import z from "zod";

export const sendVerificationEmailSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
});

export type SendVerificationEmailSchemaType = z.infer<
  typeof sendVerificationEmailSchema
>;
