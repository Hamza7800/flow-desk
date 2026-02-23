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

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(200),
  identifier: z
    .string()
    .min(1, "Identifier is required")
    .max(10)
    .toUpperCase()
    .regex(/^[A-Z0-9]+$/, "Identifier must be alphanumeric"),

  summary: z.string().max(300, "Summary is too long").optional(),
  description: z.string().optional(),

  icon: z.string().optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),

  leadId: z.string().optional().nullable(),

  isPrivate: z.boolean(),
  status: projectStatusEnum,
  priority: projectPriorityEnum,

  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
});
// .refine(
//   (data) => {
//     if (data.startDate && data.endDate) {
//       return data.endDate >= data.startDate;
//     }
//     return true;
//   },
//   {
//     message: "End date must be after start date",
//     path: ["endDate"],
//   },
// );

export type ProjectSchemaType = z.infer<typeof projectSchema>;
export const updateProjectSchema = projectSchema.partial();
