import z from "zod";

export const teamSchema = z.object({
  name: z.string().min(3, { error: "Name must be at least 3 characters" }),
});

export type TeamSchemaType = z.infer<typeof teamSchema>;
