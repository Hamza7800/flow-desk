"use server";

import { canDeleteIssue, checkPermission } from "@/lib/permissions-checks";
import { returnError } from "@/lib/utils";
import { getActiveOrgId, getUser } from "@/server/better-auth/server";
import { db } from "@/server/db";
import {
  issue,
  issueActivity,
  issueAssignee,
  issueLabel,
  organization,
} from "@/server/db/schema";
import {
  issueSchema,
  issueUpdateSchema,
  type IssueSchemaType,
  type IssueUpdateSchemaType,
} from "@/zod-schema/issue-schema";
import { and, eq, inArray, sql } from "drizzle-orm";

export const createIssue = async (
  // organizationId: string,
  teamId: string,
  data: IssueSchemaType,
) => {
  try {
    const { orgId: organizationId, userId } = await getActiveOrgId();
    const values = issueSchema.parse(data);

    const newIssue = await db.transaction(async (tx) => {
      const [createdIssue] = await tx
        .insert(issue)
        .values({
          organizationId,
          teamId,
          projectId: values.projectId,
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          creatorId: userId,
          identifier: await generateIdentifier(organizationId),
        })
        .returning();

      if (createdIssue && values.assigneeIds && values.assigneeIds.length > 0) {
        const assigneeInserts = values.assigneeIds.map((userId) => ({
          issueId: createdIssue.id,
          userId,
        }));
        await tx.insert(issueAssignee).values(assigneeInserts);
      }

      if (createdIssue && values.labelIds && values.labelIds.length > 0) {
        const labelInserts = values.labelIds.map((labelId) => ({
          issueId: createdIssue.id,
          labelId,
        }));
        await tx.insert(issueLabel).values(labelInserts);
      }

      return createdIssue;
    });
    return { success: true, message: "Issue created", data: newIssue };
  } catch (error) {
    return returnError(error, "Unable to create Issue");
  }
};

export const getIssues = async (teamId?: string) => {
  try {
    const { userId, orgId } = await getActiveOrgId();

    // const { success:isAdmin} =await checkPermission("issue", "view");

    const issues = await db.query.issue.findMany({
      where: and(
        eq(issue.organizationId, orgId),
        teamId ? eq(issue.teamId, teamId) : undefined,
      ),
      with: {
        assignees: true,
      },
      orderBy: (issue, { desc }) => [desc(issue.createdAt)],
    });

    return {
      success: true,
      data: issues,
      message: `${teamId ? "Team " : "Organization "} issues`,
    };
  } catch (error) {
    return returnError(error, "Unable to fetch issues");
  }
};

export type IssuesType = Awaited<ReturnType<typeof getIssues>>;

export const updateIssue = async (
  issueId: string,
  values: IssueUpdateSchemaType,
) => {
  try {
    const { orgId, userId } = await getActiveOrgId();
    const validatedData = issueUpdateSchema.parse(values);

    const existing = await db.query.issue.findFirst({
      where: and(eq(issue.organizationId, orgId), eq(issue.id, issueId)),
      columns: {
        id: true,
        status: true,
        priority: true,
        teamId: true,
        projectId: true,
      },
    });

    if (!existing) {
      return { success: false as const, message: "Issue not found" };
    }

    const { assigneeIds, labelIds, ...scalerFields } = validatedData;

    const hasScalerFields = Object.keys(scalerFields).length > 0;

    if (hasScalerFields) {
      console.log(scalerFields);
      await db
        .update(issue)
        .set(scalerFields)
        .where(and(eq(issue.organizationId, orgId), eq(issue.id, issueId)));

      if (scalerFields.status && scalerFields.status !== existing.status) {
        await db.insert(issueActivity).values({
          issueId,
          actorId: userId,
          type: "status_change",
          oldValue: existing.status,
          newValue: scalerFields.status,
        });
      }

      if (
        scalerFields.priority &&
        scalerFields.priority !== existing.priority
      ) {
        await db.insert(issueActivity).values({
          issueId,
          actorId: userId,
          type: "priority_change",
          oldValue: existing.priority,
          newValue: scalerFields.priority,
        });
      }
    }

    if (assigneeIds !== undefined) {
      await syncIssueAssignees(issueId, userId, assigneeIds);
    }

    if (labelIds !== undefined) {
      await syncIssueLabels(issueId, labelIds);
    }

    const updated = await db.query.issue.findFirst({
      where: and(eq(issue.organizationId, orgId), eq(issue.id, issueId)),
      with: {
        assignees: {
          with: { user: { columns: { id: true, name: true, image: true } } },
        },
        labels: { with: { label: true } },
        activities: { with: { actor: { columns: { id: true, name: true } } } },
      },
    });

    return { success: true, message: "Issue updated", data: updated };
  } catch (error) {
    return returnError(error, "Unable to update issue");
  }
};

const generateIdentifier = async (orgId: string) => {
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
    columns: { slug: true },
  });

  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(issue)
    .where(eq(issue.organizationId, orgId));

  const prefix = org?.slug.slice(0, 3).toUpperCase() ?? "ISS";
  const number = (count[0]?.count ?? 0) + 1;

  return `${prefix}-${number}`;
};

const syncIssueAssignees = async (
  issueId: string,
  userId: string,
  newAssigneeIds: string[],
) => {
  const current = await db.query.issueAssignee.findMany({
    where: eq(issueAssignee.issueId, issueId),
    columns: { userId: true },
  });

  const currentIds = current.map((a) => a.userId);
  const toAdd = newAssigneeIds.filter((id) => !currentIds.includes(id));
  const toRemove = currentIds.filter((id) => !newAssigneeIds.includes(id));

  await Promise.all([
    toAdd.length
      ? db
          .insert(issueAssignee)
          .values(toAdd.map((userId) => ({ userId, issueId })))
      : Promise.resolve(),
    toRemove.length
      ? db
          .delete(issueAssignee)
          .where(
            and(
              eq(issueAssignee.issueId, issueId),
              inArray(issueAssignee.userId, toRemove),
            ),
          )
      : Promise.resolve(),
  ]);

  if (toAdd.length || toRemove.length) {
    await db.insert(issueActivity).values({
      issueId,
      actorId: userId,
      type: "assignee_change",
      oldValue: currentIds.join(","),
      newValue: newAssigneeIds.join(","),
    });
  }
};

const syncIssueLabels = async (issueId: string, newLabelIds: string[]) => {
  const current = await db.query.issueLabel.findMany({
    where: eq(issueLabel.issueId, issueId),
    columns: { labelId: true },
  });

  const currentIds = current.map((l) => l.labelId);
  const toAdd = newLabelIds.filter((id) => !currentIds.includes(id));
  const toRemove = currentIds.filter((id) => !newLabelIds.includes(id));

  await Promise.all([
    toAdd.length
      ? db
          .insert(issueLabel)
          .values(toAdd.map((labelId) => ({ issueId, labelId })))
      : Promise.resolve(),

    toRemove.length
      ? db
          .delete(issueLabel)
          .where(
            and(
              eq(issueLabel.issueId, issueId),
              inArray(issueLabel.labelId, toRemove),
            ),
          )
      : Promise.resolve(),
  ]);
};

export const deleteIssue = async (issueId: string) => {
  try {
    const { userId, orgId } = await getActiveOrgId();
    const { success: isAdmin } = await checkPermission("issue", "delete");
    const allowed = await canDeleteIssue(issueId, userId, isAdmin);

    if (!allowed) {
      return {
        success: false as const,
        message: "You don't have permission to delete this issue",
      };
    }

    const [deleted] = await db
      .delete(issue)
      .where(and(eq(issue.id, issueId), eq(issue.organizationId, orgId)))
      .returning();

    return { success: true as const, data: deleted, message: "Issue deleted" };
  } catch (error) {
    return returnError(error, "Unable to delete issue");
  }
};
