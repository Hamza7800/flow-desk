"use server";

import { checkPermission } from "@/lib/permissions-checks";
import { returnError } from "@/lib/utils";
import { getActiveOrgId } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { organization, project, projectMember } from "@/server/db/schema";
import {
  projectSchema,
  updateProjectSchema,
  type ProjectSchemaType,
  type ProjectUpdateSchemaType,
} from "@/zod-schema/project-schema";
import { and, eq, exists, or, sql } from "drizzle-orm";

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
          leadId: validatedData?.leadId?.[0],
          status: validatedData.status,
          priority: validatedData.priority,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
        })
        .returning();
      // TODO: ADD MEMBERS
      if (createdProject && validatedData?.leadId?.[0]) {
        await tx.insert(projectMember).values({
          userId: validatedData?.leadId?.[0],
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

export type ProjectsType = Awaited<ReturnType<typeof getProjects>>;

export const updateProject = async ({
  projectId,
  values,
}: {
  projectId: string;
  values: ProjectUpdateSchemaType;
}) => {
  try {
    const { orgId } = await getActiveOrgId();
    const validatedData = updateProjectSchema.parse(values);

    const existing = await db.query.project.findFirst({
      where: and(eq(project.organizationId, orgId), eq(project.id, projectId)),
      columns: {
        id: true,
        status: true,
        priority: true,
        leadId: true,
        teamId: true,
        organizationId: true,
      },
    });

    if (!existing) {
      return { success: false, message: "Project not found", data: null };
    }

    const updatedProject = await db
      .update(project)
      .set({
        ...validatedData,
        identifier: await generateIdentifier(orgId),
        leadId: validatedData?.leadId?.[0],
      })
      .where(and(eq(project.organizationId, orgId), eq(project.id, projectId)))
      .returning();

    return {
      success: true,
      message: "Project Updated",
      data: updatedProject,
    };
  } catch (error) {
    return returnError(error, "Unable to update project");
  }
};

const generateIdentifier = async (orgId: string) => {
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
    columns: { slug: true },
  });

  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(project)
    .where(eq(project.organizationId, orgId));

  const prefix = org?.slug.slice(0, 3).toUpperCase() ?? "ISS";
  const number = (count[0]?.count ?? 0) + 1;

  return `${prefix}-${number}`;
};
