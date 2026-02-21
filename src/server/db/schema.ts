import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTableCreator,
  text,
  timestamp,
  integer,
  uniqueIndex,
  uuid,
  varchar,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `${name}`);

// BETTER AUTH SCHEMA
export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => user.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ],
);

export const user = createTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  stripeCustomerId: text("stripe_customer_id"),
});

export const session = createTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    activeOrganizationId: text("active_organization_id"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
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
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = createTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const organization = createTable(
  "organization",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    createdAt: timestamp("created_at").notNull(),
    metadata: text("metadata"),
  },
  (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
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
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
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
    status: text("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);

export const subscription = createTable("subscription", {
  id: text("id").primaryKey(),
  plan: text("plan").notNull(),
  referenceId: text("reference_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").default("incomplete"),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  cancelAt: timestamp("cancel_at"),
  canceledAt: timestamp("canceled_at"),
  endedAt: timestamp("ended_at"),
  seats: integer("seats"),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  members: many(member),
  invitations: many(invitation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

// MY CUSTOM AUTH SCHEMA
export const statusEnum = pgEnum("status", [
  "backlog",
  "planned",
  "in-progress",
  "completed",
  "canceled",
]);
export const priorityEnum = pgEnum("priority", [
  "no-priority",
  "urgent",
  "high",
  "medium",
  "low",
]);
export const linkTypeEnum = pgEnum("link_type", [
  "blocks",
  "blocked_by",
  "duplicate_of",
]);
export const activityTypeEnum = pgEnum("activity_type", [
  "status_change",
  "priority_change",
  "assignee_change",
  "comment_added",
]);

export const project = createTable("project", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  organizationId: text("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  summary: text("summary"),
  description: text("description"),
  identifier: varchar("identifier", { length: 10 }).notNull(),
  icon: text("icon"),
  color: text("color"),
  isPrivate: boolean("is_private").default(false),
  archivedAt: timestamp("archived_at"),
  issueCounter: integer("issue_counter").default(0),
  status: statusEnum().default("backlog"),
  priority: priorityEnum().default("no-priority"),
  leadId: text("lead_id").references(() => user.id),
  // members: text("members"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  // labelId: uuid("labels"),
});

export const projectMember = createTable(
  "project_member",
  {
    projectId: uuid("project_id")
      .references(() => project.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.userId] })],
);

export const label = createTable("label", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  organizationId: text("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  color: varchar("color", { length: 7 }),
});

export const issueLabel = createTable(
  "issue_label",
  {
    issueId: uuid("issue_id")
      .references(() => issue.id, { onDelete: "cascade" })
      .notNull(),
    labelId: uuid("label_id")
      .references(() => label.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.issueId, t.labelId] })],
);

export const projectLabel = createTable(
  "project_label",
  {
    projectId: uuid("project_id")
      .references(() => project.id, { onDelete: "cascade" })
      .notNull(),
    labelId: uuid("label_id")
      .references(() => label.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.labelId] })],
);

export const issue = createTable("issue", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  organizationId: text("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),
  projectId: uuid("project_id")
    .references(() => project.id, { onDelete: "set null" })
    .notNull(),

  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),

  identifier: varchar("identifier", { length: 10 }),
  status: statusEnum().default("backlog"),
  priority: priorityEnum().default("no-priority"),

  // members: text("members"),
  dueDate: timestamp("due_date"),
  // labels: text("labels"),
  creatorId: text("creator_id").references(() => user.id),
});

export const issueAssignee = createTable(
  "issue_assignee",
  {
    issueId: uuid("issue_id")
      .references(() => issue.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.issueId, t.userId] })],
);

export const comment = createTable("comment", {
  id: uuid("id").defaultRandom().notNull(),
  issueId: uuid("issue_id").references(() => issue.id, { onDelete: "cascade" }),
  authorId: text("author_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  body: text("body"),
  editedAt: timestamp("edited_at"),
});

export const cycle = createTable("cycle", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  projectId: uuid("project_id")
    .references(() => project.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("active"),
});

export const issueCycles = createTable(
  "issue_cycle",
  {
    issueId: uuid("issue_id")
      .references(() => issue.id, { onDelete: "cascade" })
      .notNull(),
    cycleId: uuid("cycle_id")
      .references(() => cycle.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.issueId, t.cycleId] })],
);

export const issueLink = createTable("issue_link", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  issueId: uuid("issue_id")
    .references(() => issue.id, { onDelete: "cascade" })
    .notNull(),
  targetIssueId: uuid("target_issue_id")
    .references(() => issue.id, { onDelete: "cascade" })
    .notNull(),
  type: linkTypeEnum().notNull(),
});

export const issueActivity = createTable("issue_activity", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  issueId: uuid("issue_id")
    .references(() => issue.id, { onDelete: "cascade" })
    .notNull(),
  actorId: text("actor_id")
    .references(() => user.id)
    .notNull(),
  type: activityTypeEnum().notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notification = createTable("notification", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  organizationId: text("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  issueId: uuid("issue_id").references(() => issue.id, { onDelete: "cascade" }),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPreference = createTable("user_preference", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  emailNotifications: boolean("email_notifications").default(true),
  theme: text("theme").default("system"),
});

export const issueRelations = relations(issue, ({ one, many }) => ({
  project: one(project, {
    fields: [issue.projectId],
    references: [project.id],
  }),
  organization: one(organization, {
    fields: [issue.organizationId],
    references: [organization.id],
  }),
  comments: many(comment),
  activities: many(issueActivity),
  labels: many(issueLabel),
  cycles: many(issueCycles),
  assignees: many(issueAssignee),
  links: many(issueLink, { relationName: "source_issue" }),
}));

export const labelRelations = relations(label, ({ many }) => ({
  issues: many(issueLabel),
}));

export const issueLabelRelations = relations(issueLabel, ({ one }) => ({
  issue: one(issue, { fields: [issueLabel.issueId], references: [issue.id] }),
  label: one(label, { fields: [issueLabel.labelId], references: [label.id] }),
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

export const projectRelations = relations(project, ({ one, many }) => ({
  organization: one(organization, {
    fields: [project.organizationId],
    references: [organization.id],
  }),
  issues: many(issue),
  members: many(projectMember),
  labels: many(projectLabel),
  cycles: many(cycle),
}));

export const issueAssigneeRelations = relations(issueAssignee, ({ one }) => ({
  issue: one(issue, {
    fields: [issueAssignee.issueId],
    references: [issue.id],
  }),
  user: one(user, { fields: [issueAssignee.userId], references: [user.id] }),
}));

export const projectMemberRelations = relations(projectMember, ({ one }) => ({
  project: one(project, {
    fields: [projectMember.projectId],
    references: [project.id],
  }),
  user: one(user, { fields: [projectMember.userId], references: [user.id] }),
}));
