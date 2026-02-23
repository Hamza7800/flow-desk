"use server";

import { checkPermission } from "@/lib/permissions-checks";
import { returnError } from "@/lib/utils";
import { getActiveOrgId } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { project, projectMember } from "@/server/db/schema";
import {
  projectSchema,
  type ProjectSchemaType,
} from "@/zod-schema/project-schema";
import { and, eq, exists, or } from "drizzle-orm";

export const createProject = async ({
  teamId,
  values,
}: {
  teamId: string;
  values: ProjectSchemaType;
}) => {
  try {
    const { userId, orgId } = await getActiveOrgId();
    const { success: isAdmin } = await checkPermission("project", "create");
    const validatedData = projectSchema.parse(values);

    if (!isAdmin) {
      return {
        success: false,
        message: "You don't have permission to create project",
      };
    }

    const newProject = await db.transaction(async (tx) => {
      const [createdProject] = await db
        .insert(project)
        .values({
          organizationId: orgId,
          teamId,
          name: validatedData.name,
          description: validatedData.description,
          summary: validatedData.summary,
          identifier: validatedData.name.replace(/\s/g, "").slice(0, 3),

          icon: validatedData.icon,
          color: validatedData.color,
          isPrivate: validatedData.isPrivate,
          leadId: validatedData.leadId,
          status: validatedData.status,
          priority: validatedData.priority,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
        })
        .returning();
      // TODO: ADD MEMBERS
      if (createdProject && validatedData.leadId) {
        await tx.insert(projectMember).values({
          userId: validatedData.leadId,
          projectId: createdProject.id,
        });
      }
      return createdProject;
    });
    return { success: true, message: "Project created", data: newProject };
  } catch (error) {
    return returnError(error, "Unable to create project");
  }
};

export const getProjects = async (teamId?: string) => {
  try {
    const { userId, orgId } = await getActiveOrgId();
    const { success: isAdmin } = await checkPermission("project", "view");

    const projects = await db.query.project.findMany({
      where: and(
        eq(project.organizationId, orgId),
        teamId ? eq(project.teamId, teamId) : undefined,
        isAdmin
          ? undefined
          : or(
              eq(project.isPrivate, false),
              eq(project.leadId, userId),
              exists(
                db
                  .select()
                  .from(projectMember)
                  .where(
                    and(
                      eq(projectMember.projectId, project.id),
                      eq(projectMember.userId, userId),
                    ),
                  ),
              ),
            ),
      ),
      with: {
        team: { columns: { name: true, id: true } },
        members: {
          with: {
            user: { columns: { id: true, name: true } },
          },
        },
      },
    });

    return { success: true, data: projects, message: "Org Projects" };
  } catch (error) {
    return returnError(error, "Unable to fetch projects");
  }
};
