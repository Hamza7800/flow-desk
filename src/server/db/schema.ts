import { relations } from "drizzle-orm";
import {
  sqliteTableCreator,
  text,
  integer,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `${name}`);

// ── BETTER AUTH TABLES ───────────────────────────────────────────────────────

export const user = createTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .$defaultFn(() => new Date().toISOString())
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
  stripeCustomerId: text("stripe_customer_id"),
});

export const session = createTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: text("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    updatedAt: text("updated_at")
      .$defaultFn(() => new Date().toISOString())
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    activeOrganizationId: text("active_organization_id"),
    activeTeamId: text("active_team_id"),
  },
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const account = createTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: text("access_token_expires_at"),
    refreshTokenExpiresAt: text("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    updatedAt: text("updated_at")
      .$defaultFn(() => new Date().toISOString())
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (t) => [index("account_userId_idx").on(t.userId)],
);

export const verification = createTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    updatedAt: text("updated_at")
      .$defaultFn(() => new Date().toISOString())
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

export const organization = createTable(
  "organization",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    metadata: text("metadata"),
  },
  (t) => [uniqueIndex("organization_slug_uidx").on(t.slug)],
);

export const team = createTable(
  "team",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    updatedAt: text("updated_at")
      .$defaultFn(() => new Date().toISOString())
      .$onUpdate(() => new Date().toISOString()),
  },
  (t) => [index("team_organizationId_idx").on(t.organizationId)],
);

export const teamMember = createTable(
  "team_member",
  {
    id: text("id").primaryKey(),
    teamId: text("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
  },
  (t) => [
    index("teamMember_teamId_idx").on(t.teamId),
    index("teamMember_userId_idx").on(t.userId),
  ],
);

export const member = createTable(
  "member",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
  },
  (t) => [
    index("member_organizationId_idx").on(t.organizationId),
    index("member_userId_idx").on(t.userId),
  ],
);

export const invitation = createTable(
  "invitation",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    teamId: text("team_id"),
    status: text("status").default("pending").notNull(),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [
    index("invitation_organizationId_idx").on(t.organizationId),
    index("invitation_email_idx").on(t.email),
  ],
);

export const subscription = createTable("subscription", {
  id: text("id").primaryKey(),
  plan: text("plan").notNull(),
  referenceId: text("reference_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").default("incomplete"),
  periodStart: text("period_start"),
  periodEnd: text("period_end"),
  trialStart: text("trial_start"),
  trialEnd: text("trial_end"),
  cancelAtPeriodEnd: integer("cancel_at_period_end", {
    mode: "boolean",
  }).default(false),
  cancelAt: text("cancel_at"),
  canceledAt: text("canceled_at"),
  endedAt: text("ended_at"),
  seats: integer("seats"),
});

// ── CUSTOM SCHEMA ─────────────────────────────────────────────────────────────
// SQLite has no enums — use text with .$type<> for TypeScript narrowing

export type Status =
  | "backlog"
  | "planned"
  | "in-progress"
  | "completed"
  | "canceled";
export type Priority = "no-priority" | "urgent" | "high" | "medium" | "low";
export type LinkType = "blocks" | "blocked_by" | "duplicate_of";
export type ActivityType =
  | "status_change"
  | "priority_change"
  | "assignee_change"
  | "comment_added";

export const project = createTable(
  "project",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    teamId: text("team_id").references(() => team.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    summary: text("summary"),
    description: text("description"),
    identifier: text("identifier").notNull(),
    icon: text("icon"),
    color: text("color"),
    isPrivate: integer("is_private", { mode: "boolean" }).default(false),
    archivedAt: text("archived_at"),
    issueCounter: integer("issue_counter").default(0),
    status: text("status").$type<Status>().default("backlog"),
    priority: text("priority").$type<Priority>().default("no-priority"),
    leadId: text("lead_id").references(() => user.id),
    startDate: text("start_date"),
    endDate: text("end_date"),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    updatedAt: text("updated_at")
      .$defaultFn(() => new Date().toISOString())
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (t) => [
    index("project_organizationId_idx").on(t.organizationId),
    index("project_teamId_idx").on(t.teamId),
  ],
);

export const projectMember = createTable(
  "project_member",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.userId] })],
);

export const label = createTable(
  "label",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color"),
  },
  (t) => [index("label_organizationId_idx").on(t.organizationId)],
);

export const issue = createTable(
  "issue",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    teamId: text("team_id").references(() => team.id, { onDelete: "set null" }),
    projectId: text("project_id").references(() => project.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    identifier: text("identifier"),
    status: text("status").$type<Status>().default("backlog"),
    priority: text("priority").$type<Priority>().default("no-priority"),
    dueDate: text("due_date"),
    creatorId: text("creator_id").references(() => user.id),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
    updatedAt: text("updated_at")
      .$defaultFn(() => new Date().toISOString())
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (t) => [
    index("issue_organizationId_idx").on(t.organizationId),
    index("issue_teamId_idx").on(t.teamId),
    index("issue_projectId_idx").on(t.projectId),
    index("issue_status_idx").on(t.status),
    index("issue_creatorId_idx").on(t.creatorId),
  ],
);

export const issueAssignee = createTable(
  "issue_assignee",
  {
    issueId: text("issue_id")
      .notNull()
      .references(() => issue.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.issueId, t.userId] }),
    index("issueAssignee_userId_idx").on(t.userId),
  ],
);

export const issueLabel = createTable(
  "issue_label",
  {
    issueId: text("issue_id")
      .notNull()
      .references(() => issue.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => label.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.issueId, t.labelId] })],
);

export const projectLabel = createTable(
  "project_label",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => label.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.labelId] })],
);

export const comment = createTable(
  "comment",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    issueId: text("issue_id").references(() => issue.id, {
      onDelete: "cascade",
    }),
    authorId: text("author_id").references(() => user.id, {
      onDelete: "cascade",
    }),
    body: text("body"),
    editedAt: text("edited_at"),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
  },
  (t) => [index("comment_issueId_idx").on(t.issueId)],
);

export const cycle = createTable(
  "cycle",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    status: text("status").default("active"),
  },
  (t) => [index("cycle_projectId_idx").on(t.projectId)],
);

export const issueCycles = createTable(
  "issue_cycle",
  {
    issueId: text("issue_id")
      .notNull()
      .references(() => issue.id, { onDelete: "cascade" }),
    cycleId: text("cycle_id")
      .notNull()
      .references(() => cycle.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.issueId, t.cycleId] })],
);

export const issueLink = createTable(
  "issue_link",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    issueId: text("issue_id")
      .notNull()
      .references(() => issue.id, { onDelete: "cascade" }),
    targetIssueId: text("target_issue_id")
      .notNull()
      .references(() => issue.id, { onDelete: "cascade" }),
    type: text("type").$type<LinkType>().notNull(),
  },
  (t) => [index("issueLink_issueId_idx").on(t.issueId)],
);

export const issueActivity = createTable(
  "issue_activity",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    issueId: text("issue_id")
      .notNull()
      .references(() => issue.id, { onDelete: "cascade" }),
    actorId: text("actor_id")
      .notNull()
      .references(() => user.id),
    type: text("type").$type<ActivityType>().notNull(),
    oldValue: text("old_value"),
    newValue: text("new_value"),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
  },
  (t) => [index("issueActivity_issueId_idx").on(t.issueId)],
);

export const notification = createTable(
  "notification",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    issueId: text("issue_id").references(() => issue.id, {
      onDelete: "cascade",
    }),
    readAt: text("read_at"),
    createdAt: text("created_at")
      .$defaultFn(() => new Date().toISOString())
      .notNull(),
  },
  (t) => [
    index("notification_userId_idx").on(t.userId),
    index("notification_organizationId_idx").on(t.organizationId),
  ],
);

export const userPreference = createTable("user_preference", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  emailNotifications: integer("email_notifications", {
    mode: "boolean",
  }).default(true),
  theme: text("theme").default("system"),
});

// ── RELATIONS (DB-agnostic, unchanged) ───────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  teamMembers: many(teamMember),
  members: many(member),
  invitations: many(invitation),
  issues: many(issue),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  teams: many(team),
  members: many(member),
  invitations: many(invitation),
  projects: many(project),
  issues: many(issue),
}));

export const teamRelations = relations(team, ({ one, many }) => ({
  organization: one(organization, {
    fields: [team.organizationId],
    references: [organization.id],
  }),
  teamMembers: many(teamMember),
  projects: many(project),
  issues: many(issue),
}));

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  team: one(team, { fields: [teamMember.teamId], references: [team.id] }),
  user: one(user, { fields: [teamMember.userId], references: [user.id] }),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, { fields: [member.userId], references: [user.id] }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, { fields: [invitation.inviterId], references: [user.id] }),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  organization: one(organization, {
    fields: [project.organizationId],
    references: [organization.id],
  }),
  team: one(team, { fields: [project.teamId], references: [team.id] }),
  lead: one(user, { fields: [project.leadId], references: [user.id] }),
  issues: many(issue),
  members: many(projectMember),
  labels: many(projectLabel),
  cycles: many(cycle),
}));

export const projectMemberRelations = relations(projectMember, ({ one }) => ({
  project: one(project, {
    fields: [projectMember.projectId],
    references: [project.id],
  }),
  user: one(user, { fields: [projectMember.userId], references: [user.id] }),
}));

export const labelRelations = relations(label, ({ many }) => ({
  issues: many(issueLabel),
  projects: many(projectLabel),
}));

export const issueLabelRelations = relations(issueLabel, ({ one }) => ({
  issue: one(issue, { fields: [issueLabel.issueId], references: [issue.id] }),
  label: one(label, { fields: [issueLabel.labelId], references: [label.id] }),
}));

export const projectLabelRelations = relations(projectLabel, ({ one }) => ({
  project: one(project, {
    fields: [projectLabel.projectId],
    references: [project.id],
  }),
  label: one(label, { fields: [projectLabel.labelId], references: [label.id] }),
}));

export const issueRelations = relations(issue, ({ one, many }) => ({
  project: one(project, {
    fields: [issue.projectId],
    references: [project.id],
  }),
  organization: one(organization, {
    fields: [issue.organizationId],
    references: [organization.id],
  }),
  team: one(team, { fields: [issue.teamId], references: [team.id] }),
  creator: one(user, { fields: [issue.creatorId], references: [user.id] }),
  comments: many(comment),
  activities: many(issueActivity),
  labels: many(issueLabel),
  cycles: many(issueCycles),
  assignees: many(issueAssignee),
  links: many(issueLink, { relationName: "source_issue" }),
}));

export const issueAssigneeRelations = relations(issueAssignee, ({ one }) => ({
  issue: one(issue, {
    fields: [issueAssignee.issueId],
    references: [issue.id],
  }),
  user: one(user, { fields: [issueAssignee.userId], references: [user.id] }),
}));

export const commentRelations = relations(comment, ({ one }) => ({
  issue: one(issue, { fields: [comment.issueId], references: [issue.id] }),
  author: one(user, { fields: [comment.authorId], references: [user.id] }),
}));

export const cycleRelations = relations(cycle, ({ one, many }) => ({
  project: one(project, {
    fields: [cycle.projectId],
    references: [project.id],
  }),
  issues: many(issueCycles),
}));

export const issueCyclesRelations = relations(issueCycles, ({ one }) => ({
  issue: one(issue, { fields: [issueCycles.issueId], references: [issue.id] }),
  cycle: one(cycle, { fields: [issueCycles.cycleId], references: [cycle.id] }),
}));

export const issueActivityRelations = relations(issueActivity, ({ one }) => ({
  issue: one(issue, {
    fields: [issueActivity.issueId],
    references: [issue.id],
  }),
  actor: one(user, { fields: [issueActivity.actorId], references: [user.id] }),
}));

export const issueLinkRelations = relations(issueLink, ({ one }) => ({
  issue: one(issue, {
    fields: [issueLink.issueId],
    references: [issue.id],
    relationName: "source_issue",
  }),
  targetIssue: one(issue, {
    fields: [issueLink.targetIssueId],
    references: [issue.id],
    relationName: "target_issue",
  }),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, { fields: [notification.userId], references: [user.id] }),
  organization: one(organization, {
    fields: [notification.organizationId],
    references: [organization.id],
  }),
  issue: one(issue, { fields: [notification.issueId], references: [issue.id] }),
}));
