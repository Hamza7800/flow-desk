import { auth } from "@/server/better-auth";
import { db } from "@/server/db";
import {
  comment,
  issueAssignee,
  project,
  projectMember,
  teamMember,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cacheWrap } from "./cache";
import { cacheKeys } from "./query-keys";
import { getActiveOrgId } from "@/server/better-auth/server";

export const checkPermission = async (
  resource:
    | "project"
    | "issue"
    | "comment"
    | "cycle"
    | "label"
    | "team"
    | "member"
    | "invitation"
    | "organization"
    | "teamData",
  action:
    | "create"
    | "update"
    | "delete"
    | "archive"
    | "view"
    | "manageMember"
    | "removeMember"
    | "leave",
) => {
  const { userId, orgId } = await getActiveOrgId();

  return cacheWrap(
    `permission:${userId}:${orgId}:${resource}:${action}`,
    async () =>
      auth.api.hasPermission({
        body: { permissions: { [resource]: [action] } },
        headers: await headers(),
      }),
    1000 * 60 * 5,
  );
  // return await auth.api.hasPermission({
  //   body: {
  //     permissions: {
  //       [resource]: [action],
  //     },
  //   },
  //   headers: await headers(),
  // });
};

export const isTeamMember = async (userId: string, teamId: string) => {
  const result = await db.query.teamMember.findFirst({
    where: and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId)),
    columns: { id: true },
  });

  return !!result;
};

export const canViewTeamData = async (
  teamId: string,
  userId: string,
  hasAdminAccess: boolean,
) => {
  if (hasAdminAccess) return true;
  return isTeamMember(userId, teamId);
};

export const isProjectLead = async (projectId: string, userId: string) => {
  const result = await db.query.project.findFirst({
    where: and(eq(project.id, projectId), eq(project.leadId, userId)),
    columns: { id: true },
  });

  return !!result;
};

export const isProjectMember = async (projectId: string, userId: string) => {
  const result = await db.query.projectMember.findFirst({
    where: and(
      eq(projectMember.projectId, projectId),
      eq(projectMember.userId, userId),
    ),
    columns: { projectId: true },
  });

  return !!result;
};

export const canViewProject = async (
  projectId: string,
  userId: string,
  hasAdminAccess: boolean,
) => {
  if (hasAdminAccess) return true;

  const result = await db.query.project.findFirst({
    where: eq(project.id, projectId),
    columns: {
      isPrivate: true,
      leadId: true,
    },
  });

  if (!result) return false;
  if (!result.isPrivate) return true;
  if (result.leadId === userId) return true;

  return isProjectMember(projectId, userId);
};

export const canMutateProject = async (
  projectId: string,
  userId: string,
  hasAdminAccess: boolean,
) => {
  if (hasAdminAccess) return true;
  return isProjectLead(projectId, userId);
};

export const canManageProjectMembers = async (
  projectId: string,
  userId: string,
  hasAdminAccess: boolean,
) => {
  if (hasAdminAccess) return true;
  return isProjectLead(projectId, userId);
};

export const isIssueAssignee = async (issueId: string, userId: string) => {
  const result = await db.query.issueAssignee.findFirst({
    where: and(
      eq(issueAssignee.issueId, issueId),
      eq(issueAssignee.userId, userId),
    ),
    columns: { issueId: true },
  });
  return !!result;
};

export const canDeleteIssue = async (
  issueId: string,
  userId: string,
  hasAdminAccess: boolean,
) => {
  if (hasAdminAccess) return true;
  return isIssueAssignee(issueId, userId);
};

export const isCommentAuthor = async (commentId: string, userId: string) => {
  const result = await db.query.comment.findFirst({
    where: and(eq(comment.id, commentId), eq(comment.authorId, userId)),
    columns: { id: true },
  });
  return !!result;
};

export const canEditComment = async (commentId: string, userId: string) => {
  return isCommentAuthor(commentId, userId);
};

export const canDeleteComment = async (
  commentId: string,
  userId: string,
  hasAdminAccess: boolean,
) => {
  if (hasAdminAccess) return true;
  return isCommentAuthor(commentId, userId);
};

export const isTeamMemberCached = async (userId: string, teamId: string) => {
  return cacheWrap(
    cacheKeys.teams.membership(userId, teamId),
    () => isTeamMember(userId, teamId),
    1000 * 60 * 10,
  );
};
