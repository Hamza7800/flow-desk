import z from "zod";

export const issueSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  status: z.enum([
    "backlog",
    "planned",
    "in-progress",
    "completed",
    "canceled",
  ]),
  priority: z.enum(["no-priority", "urgent", "high", "medium", "low"]),
  projectId: z.string().optional(),
  assigneeIds: z.array(z.string()).optional(),
  labelIds: z.array(z.string()).optional(),
});

export type IssueSchemaType = z.infer<typeof issueSchema>;

export const issueUpdateSchema = issueSchema.partial();
export type IssueUpdateSchemaType = z.infer<typeof issueUpdateSchema>;
