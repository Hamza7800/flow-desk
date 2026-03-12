"use server";

import { checkPermission, isProjectMember } from "@/lib/permissions-checks";
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
import { and, eq, exists, inArray, or, sql } from "drizzle-orm";
import { isProjectLead } from "../lib/permissions-checks";

const toDate = (val?: string | null) => (val ? new Date(val) : null);

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
          startDate: toDate(validatedData.startDate),
          endDate: toDate(validatedData.endDate),
        })
        .returning();

      if (createdProject && validatedData?.leadId?.[0]) {
        await tx.insert(projectMember).values({
          userId: validatedData?.leadId?.[0],
          projectId: createdProject.id,
        });
      }

      if (createdProject && validatedData.members) {
        const members = validatedData.members
          .filter((userId) => userId !== validatedData?.leadId?.[0])
          .map((userId) => ({
            userId,
            projectId: createdProject.id,
          }));
        await tx.insert(projectMember).values(members);
      }
      return createdProject;
    });
    return { success: true, message: "Project created", data: newProject };
  } catch (error) {
    return returnError(error, "Unable to create project");
  }
};

// TODO: NEED TO FIGURE OUT IF I ONLY HAVE TO SHOW ISSUES IF THE USER IS PART OF THAT PROJECT AS WELL
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
      orderBy: (project, { desc }) => [desc(project.createdAt)],
    });

    return { success: true, data: projects, message: "Org Projects" };
  } catch (error) {
    return returnError(error, "Unable to fetch projects");
  }
};

const projectQuery = async (
  orgId: string,
  projectId: string,
  userId: string,
  isAdmin: boolean,
  teamId?: string,
) => {
  return await db.query.project.findFirst({
    where: and(
      eq(project?.organizationId, orgId),
      eq(project.id, projectId),
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
    orderBy: (project, { desc }) => [desc(project.createdAt)],
  });
};

export const getProject = async (projectId: string, teamId?: string) => {
  try {
    const { userId, orgId } = await getActiveOrgId();

    const { success: isAdmin } = await checkPermission("project", "view");
    const isLead = await isProjectLead(projectId, userId);
    const isMember = await isProjectMember(projectId, userId);

    const hasAccess = isAdmin || isLead || isMember;

    if (!hasAccess) {
      return {
        success: false,
        message: "You don't have permission to view this project",
      };
    }

    const projectData = await projectQuery(
      orgId,
      projectId,
      userId,
      isAdmin,
      teamId,
    );

    return { success: true, data: projectData, message: "Project" };
  } catch (error) {
    return returnError(error, "Unable to fetch project");
  }
};

export type ProjectType = Awaited<ReturnType<typeof getProject>>;
export type ProjectsType = Awaited<ReturnType<typeof getProjects>>;

export const updateProject = async ({
  projectId,
  values,
}: {
  projectId: string;
  values: ProjectUpdateSchemaType;
}) => {
  try {
    const { orgId, userId } = await getActiveOrgId();
    const validatedData = updateProjectSchema.parse(values);
    const { success: isAdmin } = await checkPermission("project", "update");

    if (!isAdmin) {
      const isLead = await isProjectLead(projectId, userId);
      const isMember = await isProjectMember(projectId, userId);

      if (!isLead && !isMember) {
        return {
          success: false,
          data: null,
          message: "Unauthorized: You must be a project lead or member.",
        };
      }
    }

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

    const { members, startDate, endDate, ...scalerFields } = validatedData;
    if (scalerFields) {
      await db
        .update(project)
        .set({
          ...scalerFields,
          identifier: await generateIdentifier(orgId),
          leadId: validatedData?.leadId?.[0] ?? null,
          ...(startDate !== undefined && { startDate: toDate(startDate) }),
          ...(endDate !== undefined && { endDate: toDate(endDate) }),
        })
        .where(
          and(eq(project.organizationId, orgId), eq(project.id, projectId)),
        );
    }

    if (members !== undefined) {
      const { success: canManageMembers } = await checkPermission(
        "project",
        "manageMember",
      );
      if (canManageMembers) {
        await syncMembers(projectId, userId, members);
      } else {
        console.log(
          `User ${userId} attempted to sync members without permission. Skipping.`,
        );
      }
    }

    const updatedProject = await projectQuery(
      orgId,
      projectId,
      userId,
      isAdmin,
      existing.teamId!,
    );

    return {
      success: true,
      message: "Project Updated",
      data: updatedProject,
    };
  } catch (error) {
    return returnError(error, "Unable to update project");
  }
};

const syncMembers = async (
  projectId: string,
  userId: string,
  newMembers: string[],
) => {
  const current = await db.query.projectMember.findMany({
    where: eq(projectMember.projectId, projectId),
    columns: { userId: true },
  });

  const currentIds = current.map((a) => a.userId);
  const toAdd = newMembers.filter((id) => !currentIds.includes(id));
  const toRemove = currentIds.filter((id) => !newMembers.includes(id));

  await Promise.all([
    toAdd.length
      ? db
          .insert(projectMember)
          .values(toAdd.map((userId) => ({ userId, projectId })))
      : Promise.resolve(),
    toRemove.length
      ? db
          .delete(projectMember)
          .where(
            and(
              eq(projectMember.projectId, projectId),
              inArray(projectMember.userId, toRemove),
            ),
          )
      : Promise.resolve(),
  ]);
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

export const deleteProject = async (projectId: string) => {
  try {
    const { orgId } = await getActiveOrgId();

    const { success: isAdmin } = await checkPermission("project", "delete");

    if (!isAdmin) {
      return {
        success: false,
        message: "You don't have permission to delete this project",
        data: null,
      };
    }

    const [deleted] = await db
      .delete(project)
      .where(and(eq(project.organizationId, orgId), eq(project.id, projectId)))
      .returning();

    return {
      success: true,
      message: "Project Deleted",
      data: deleted,
    };
  } catch (error) {
    return returnError(error, "Unable to delete project");
  }
};
