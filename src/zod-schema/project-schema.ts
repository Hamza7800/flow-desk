import { z } from "zod";

export const projectStatusEnum = z.enum([
  "backlog",
  "planned",
  "in-progress",
  "completed",
  "canceled",
]);

export const projectPriorityEnum = z.enum([
  "no-priority",
  "urgent",
  "high",
  "medium",
  "low",
]);

export const projectBaseSchema = z.object({
  name: z.string().min(1, "Project name is required").max(200),

  summary: z.string().max(300, "Summary is too long").optional(),
  description: z.string().optional(),

  icon: z.string().optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),

  leadId: z.array(z.string()).optional(),
  members: z.array(z.string()).optional(),
  isPrivate: z.boolean(),
  status: projectStatusEnum,
  priority: projectPriorityEnum,

  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const projectSchema = projectBaseSchema.refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  },
);

export type ProjectSchemaType = z.infer<typeof projectSchema>;

export const updateProjectSchema = projectBaseSchema.partial();
export type ProjectUpdateSchemaType = z.infer<typeof updateProjectSchema>;
