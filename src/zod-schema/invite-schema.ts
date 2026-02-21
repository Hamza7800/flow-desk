import z from "zod";

export const inviteSchema = z.object({
  email: z.email(),
});

export type InviteType = z.infer<typeof inviteSchema>;
