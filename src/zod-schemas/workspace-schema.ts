import { workSpaces } from "@/db/schema/workspace";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const createWorkspaceSchema = createInsertSchema(workSpaces, {
  id: (schema) => schema.uuid("Invalid uuid format").optional(),
  name: (schema) =>
    schema
      .nonempty("Name is required")
      .min(3, "Name must be at least 3 characters"),
  userId: (schema) => schema.uuid("Invalid uuid format").optional(),
  image: (schema) =>
    schema
      .optional()
      .transform((value) => (value === "" ? undefined : value))
      .or(
        z
          .instanceof(File)
          .refine((file) => file.size > 0, "File can not empty")
      ),
});

export type insertWorkspaceType = typeof createWorkspaceSchema._type;
