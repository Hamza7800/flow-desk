"use server";

import { returnError } from "@/lib/utils";
import { getUser } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { issue, issueAssignee, issueLabel } from "@/server/db/schema";
import { issueSchema, type IssueSchemaType } from "@/zod-schema/issue-schema";

export const createIssue = async (
  organizationId: string,
  teamId: string,
  data: IssueSchemaType,
) => {
  try {
    await getUser();
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
          identifier: values.title.replace(/\s/g, "").slice(0, 3),
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
