"use server";
import {
  organization,
  member,
  team,
  teamMember,
  project,
  projectMember,
  label,
  issue,
  issueAssignee,
  issueLabel,
  comment,
  user,
} from "@/server/db/schema";
import { auth } from "@/server/better-auth";
import { db } from "@/server/db";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => crypto.randomUUID();
const textId = () => Math.random().toString(36).slice(2, 18);

// ─── Demo users ───────────────────────────────────────────────────────────────

const USERS = [
  {
    name: "Sarah Chen",
    email: "admin@demo.com",
    password: "demo1234",
    orgRole: "admin",
  },
  {
    name: "James Wright",
    email: "member@demo.com",
    password: "demo1234",
    orgRole: "member",
  },
] as const;

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function seed() {
  console.log("🌱 Seeding...\n");

  // ── 1. Users via better-auth ─────────────────────────────────────────────────
  console.log("Creating users...");

  const userIds: Record<string, string> = {};

  for (const u of USERS) {
    try {
      const res = await auth.api.signUpEmail({
        body: { name: u.name, email: u.email, password: u.password },
      });
      userIds[u.email] = res.user.id;
      console.log(`  ✓ ${u.name}`);
    } catch {
      // Already exists — look up
      const existing = await db.query.user.findFirst({
        where: (t, { eq }) => eq(t.email, u.email),
      });
      if (!existing) throw new Error(`Could not create or find ${u.email}`);
      userIds[u.email] = existing.id;
      console.log(`  ~ ${u.name} already exists`);
    }
  }

  const adminId = userIds["admin@demo.com"]!;
  const memberId = userIds["member@demo.com"]!;

  // ── 2. Organization ──────────────────────────────────────────────────────────
  console.log("\nCreating organization...");

  const orgId = textId();

  await db
    .insert(organization)
    .values({
      id: orgId,
      name: "Acme Engineering",
      slug: "acme-engineering",
      createdAt: new Date(),
    })
    .onConflictDoNothing();

  // Re-fetch in case it already existed
  const existingOrg = await db.query.organization.findFirst({
    where: (t, { eq }) => eq(t.slug, "acme-engineering"),
  });
  const finalOrgId = existingOrg!.id;

  console.log(`  ✓ Acme Engineering (${finalOrgId})`);

  // ── 3. Org members ───────────────────────────────────────────────────────────
  console.log("\nAdding org members...");

  for (const u of USERS) {
    await db
      .insert(member)
      .values({
        id: textId(),
        organizationId: finalOrgId,
        userId: userIds[u.email]!,
        role: u.orgRole,
        createdAt: new Date(),
      })
      .onConflictDoNothing();
    console.log(`  ✓ ${u.email} → ${u.orgRole}`);
  }

  // ── 4. Teams ─────────────────────────────────────────────────────────────────
  // Note: team table only has id, name, organizationId, createdAt, updatedAt
  console.log("\nCreating teams...");

  const teamData = [
    { name: "Frontend" },
    { name: "Backend" },
    { name: "Design" },
  ];

  const teamIds: Record<string, string> = {};

  for (const t of teamData) {
    const id = textId();
    await db
      .insert(team)
      .values({
        id,
        name: t.name,
        organizationId: finalOrgId,
        createdAt: new Date(),
      })
      .onConflictDoNothing();
    teamIds[t.name] = id;
    console.log(`  ✓ ${t.name}`);
  }

  // ── 5. Team members ──────────────────────────────────────────────────────────
  // Note: teamMember has no role or organizationId — just id, teamId, userId, createdAt
  console.log("\nAdding team members...");

  for (const tid of Object.values(teamIds)) {
    for (const userId of [adminId, memberId]) {
      await db
        .insert(teamMember)
        .values({
          id: textId(),
          teamId: tid,
          userId,
          createdAt: new Date(),
        })
        .onConflictDoNothing();
    }
  }
  console.log(`  ✓ Both users added to all teams`);

  // ── 6. Labels ────────────────────────────────────────────────────────────────
  console.log("\nCreating labels...");

  const labelsData = [
    { name: "Bug", color: "#ef4444" },
    { name: "Feature", color: "#6366f1" },
    { name: "Improvement", color: "#f59e0b" },
    { name: "Documentation", color: "#10b981" },
    { name: "Performance", color: "#8b5cf6" },
  ];

  const labelIds: Record<string, string> = {};

  for (const l of labelsData) {
    const id = uid();
    await db
      .insert(label)
      .values({ id, organizationId: finalOrgId, name: l.name, color: l.color })
      .onConflictDoNothing();
    labelIds[l.name] = id;
  }
  console.log(`  ✓ ${labelsData.length} labels`);

  // ── 7. Projects ──────────────────────────────────────────────────────────────
  // status enum: backlog | planned | in-progress | completed | canceled
  // priority enum: no-priority | urgent | high | medium | low
  console.log("\nCreating projects...");

  const projectsData = [
    {
      name: "Website Redesign",
      summary: "Redesign the marketing website for the new brand",
      identifier: "WEB",
      teamName: "Frontend",
      status: "in-progress" as const,
      priority: "high" as const,
      isPrivate: false,
    },
    {
      name: "API v2",
      summary: "Build the next version of the public REST API",
      identifier: "API",
      teamName: "Backend",
      status: "in-progress" as const,
      priority: "urgent" as const,
      isPrivate: false,
    },
    {
      name: "Design System",
      summary: "Unified component library and design tokens",
      identifier: "DS",
      teamName: "Design",
      status: "planned" as const,
      priority: "medium" as const,
      isPrivate: false,
    },
    {
      name: "Internal Dashboard",
      summary: "Internal analytics and revenue dashboard",
      identifier: "INT",
      teamName: "Backend",
      status: "backlog" as const,
      priority: "low" as const,
      isPrivate: true,
    },
  ];

  const projectIds: Record<string, string> = {};

  for (const p of projectsData) {
    const id = uid();
    await db
      .insert(project)
      .values({
        id,
        organizationId: finalOrgId,
        teamId: teamIds[p.teamName]!,
        name: p.name,
        summary: p.summary,
        identifier: p.identifier,
        status: p.status,
        priority: p.priority,
        isPrivate: p.isPrivate,
        leadId: adminId,
        issueCounter: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
    projectIds[p.name] = id;
    console.log(`  ✓ ${p.name} ${p.isPrivate ? "(private)" : ""}`);
  }

  // ── 8. Project members ───────────────────────────────────────────────────────
  // projectMember is composite PK (projectId, userId) only — no role field
  console.log("\nAdding project members...");

  for (const pid of Object.values(projectIds)) {
    for (const userId of [adminId, memberId]) {
      await db
        .insert(projectMember)
        .values({ projectId: pid, userId })
        .onConflictDoNothing();
    }
  }
  console.log(`  ✓ Both users added to all projects`);

  // ── 9. Issues ────────────────────────────────────────────────────────────────
  console.log("\nCreating issues...");

  type IssueStatus =
    | "backlog"
    | "planned"
    | "in-progress"
    | "completed"
    | "canceled";
  type IssuePriority = "no-priority" | "urgent" | "high" | "medium" | "low";

  const issuesData: {
    title: string;
    description?: string;
    status: IssueStatus;
    priority: IssuePriority;
    projectName: string;
    teamName: string;
    assigneeEmail: string | null;
    labelNames?: string[];
  }[] = [
    // ── Website Redesign ──────────────────────────────────────────────────────
    {
      title: "Redesign homepage hero section",
      description:
        "Update the hero to match the new brand guidelines. Include headline, CTA, and background illustration.",
      status: "in-progress",
      priority: "high",
      projectName: "Website Redesign",
      teamName: "Frontend",
      assigneeEmail: "member@demo.com",
      labelNames: ["Feature"],
    },
    {
      title: "Fix mobile navigation overflow",
      description:
        "Nav links overflow on screens below 375px. Needs a hamburger menu or collapsible layout.",
      status: "backlog",
      priority: "medium",
      projectName: "Website Redesign",
      teamName: "Frontend",
      assigneeEmail: "member@demo.com",
      labelNames: ["Bug"],
    },
    {
      title: "Update brand colours across all pages",
      status: "backlog",
      priority: "low",
      projectName: "Website Redesign",
      teamName: "Frontend",
      assigneeEmail: "admin@demo.com",
      labelNames: ["Improvement"],
    },
    {
      title: "Add dark mode support",
      description:
        "Implement CSS variables and a theme toggle. Persist preference to localStorage.",
      status: "planned",
      priority: "medium",
      projectName: "Website Redesign",
      teamName: "Frontend",
      assigneeEmail: null,
      labelNames: ["Feature"],
    },
    {
      title: "Improve page load performance",
      description:
        "Current LCP is 4.2s. Target is under 2.5s. Audit images, fonts, and third-party scripts.",
      status: "planned",
      priority: "high",
      projectName: "Website Redesign",
      teamName: "Frontend",
      assigneeEmail: "admin@demo.com",
      labelNames: ["Performance"],
    },
    {
      title: "Write copy for About page",
      status: "completed",
      priority: "low",
      projectName: "Website Redesign",
      teamName: "Frontend",
      assigneeEmail: "member@demo.com",
      labelNames: ["Documentation"],
    },

    // ── API v2 ────────────────────────────────────────────────────────────────
    {
      title: "Design REST API schema",
      description:
        "Define resource naming, versioning strategy, and response envelope format.",
      status: "completed",
      priority: "high",
      projectName: "API v2",
      teamName: "Backend",
      assigneeEmail: "admin@demo.com",
      labelNames: ["Documentation"],
    },
    {
      title: "Set up rate limiting middleware",
      description:
        "Implement per-user token bucket rate limiting. 1000 req/hour for free tier.",
      status: "in-progress",
      priority: "high",
      projectName: "API v2",
      teamName: "Backend",
      assigneeEmail: "admin@demo.com",
      labelNames: ["Feature", "Performance"],
    },
    {
      title: "Write API documentation",
      description: "OpenAPI spec + usage examples for all public endpoints.",
      status: "planned",
      priority: "medium",
      projectName: "API v2",
      teamName: "Backend",
      assigneeEmail: "member@demo.com",
      labelNames: ["Documentation"],
    },
    {
      title: "Add webhook support",
      description:
        "Allow users to subscribe to issue and project events via webhook URL.",
      status: "backlog",
      priority: "medium",
      projectName: "API v2",
      teamName: "Backend",
      assigneeEmail: null,
      labelNames: ["Feature"],
    },
    {
      title: "Implement OAuth2 scopes",
      status: "backlog",
      priority: "high",
      projectName: "API v2",
      teamName: "Backend",
      assigneeEmail: "admin@demo.com",
      labelNames: ["Feature"],
    },
    {
      title: "Fix race condition in job queue",
      description:
        "Two workers occasionally pick up the same job when the queue is under heavy load.",
      status: "canceled",
      priority: "urgent",
      projectName: "API v2",
      teamName: "Backend",
      assigneeEmail: "member@demo.com",
      labelNames: ["Bug"],
    },

    // ── Design System ─────────────────────────────────────────────────────────
    {
      title: "Create button component variants",
      description:
        "Primary, secondary, destructive, ghost, and link variants. All sizes.",
      status: "completed",
      priority: "high",
      projectName: "Design System",
      teamName: "Design",
      assigneeEmail: "member@demo.com",
      labelNames: ["Feature"],
    },
    {
      title: "Design form input states",
      description:
        "Default, focus, error, disabled, and loading states for all input types.",
      status: "in-progress",
      priority: "medium",
      projectName: "Design System",
      teamName: "Design",
      assigneeEmail: "member@demo.com",
      labelNames: ["Feature", "Improvement"],
    },
    {
      title: "Build data table component",
      description:
        "Sortable columns, pagination, row selection, and empty state.",
      status: "planned",
      priority: "medium",
      projectName: "Design System",
      teamName: "Design",
      assigneeEmail: "admin@demo.com",
      labelNames: ["Feature"],
    },
    {
      title: "Document accessibility guidelines",
      status: "backlog",
      priority: "low",
      projectName: "Design System",
      teamName: "Design",
      assigneeEmail: null,
      labelNames: ["Documentation"],
    },
    {
      title: "Create icon library",
      description:
        "Source icons from Lucide, export as optimised SVGs with consistent sizing.",
      status: "backlog",
      priority: "low",
      projectName: "Design System",
      teamName: "Design",
      assigneeEmail: "member@demo.com",
      labelNames: ["Improvement"],
    },

    // ── Internal Dashboard (private) ──────────────────────────────────────────
    {
      title: "Set up analytics pipeline",
      description:
        "Ingest events from the API into a time-series store for dashboarding.",
      status: "in-progress",
      priority: "high",
      projectName: "Internal Dashboard",
      teamName: "Backend",
      assigneeEmail: "admin@demo.com",
      labelNames: ["Feature"],
    },
    {
      title: "Build revenue charts",
      description:
        "MRR, ARR, churn rate, and new subscriptions. Daily and monthly views.",
      status: "planned",
      priority: "medium",
      projectName: "Internal Dashboard",
      teamName: "Backend",
      assigneeEmail: "admin@demo.com",
      labelNames: ["Feature"],
    },
    {
      title: "Add user retention metrics",
      status: "backlog",
      priority: "low",
      projectName: "Internal Dashboard",
      teamName: "Backend",
      assigneeEmail: null,
      labelNames: ["Improvement"],
    },
  ];

  // Track counter per project identifier for issue identifiers (e.g. WEB-1)
  const projectIdentifierMap: Record<string, string> = {
    "Website Redesign": "WEB",
    "API v2": "API",
    "Design System": "DS",
    "Internal Dashboard": "INT",
  };
  const issueCounter: Record<string, number> = {};

  const createdIssueIds: string[] = [];

  for (const i of issuesData) {
    const projectIdentifier = projectIdentifierMap[i.projectName]!;
    issueCounter[projectIdentifier] =
      (issueCounter[projectIdentifier] ?? 0) + 1;
    const identifier = `${projectIdentifier}-${issueCounter[projectIdentifier]}`;

    const id = uid();
    await db
      .insert(issue)
      .values({
        id,
        organizationId: finalOrgId,
        teamId: teamIds[i.teamName]!,
        projectId: projectIds[i.projectName]!,
        creatorId: adminId,
        title: i.title,
        description: i.description ?? null,
        identifier,
        status: i.status,
        priority: i.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    createdIssueIds.push(id);

    // Assignee via issueAssignee join table
    if (i.assigneeEmail) {
      await db
        .insert(issueAssignee)
        .values({ issueId: id, userId: userIds[i.assigneeEmail]! })
        .onConflictDoNothing();
    }

    // Labels via issueLabel join table
    for (const labelName of i.labelNames ?? []) {
      const lid = labelIds[labelName];
      if (lid) {
        await db
          .insert(issueLabel)
          .values({ issueId: id, labelId: lid })
          .onConflictDoNothing();
      }
    }
  }

  console.log(`  ✓ ${issuesData.length} issues with assignees and labels`);

  // ── 10. Comments ─────────────────────────────────────────────────────────────
  console.log("\nAdding comments...");

  const commentsData = [
    {
      issueIndex: 0, // WEB-1 hero section
      authorId: adminId,
      body: "Designs are ready in Figma. @james can you take a look at the mobile breakpoints?",
    },
    {
      issueIndex: 0,
      authorId: memberId,
      body: "On it. The 375px breakpoint looks tricky, might need a different layout below that.",
    },
    {
      issueIndex: 7, // API-2 rate limiting
      authorId: adminId,
      body: "Using a sliding window algorithm. Redis is already set up so this should be straightforward.",
    },
    {
      issueIndex: 11, // API-6 race condition — canceled
      authorId: memberId,
      body: "Reproduced this locally. The fix is a distributed lock but we decided to punt to v3.",
    },
    {
      issueIndex: 13, // DS-2 form inputs
      authorId: memberId,
      body: "Error state needs a red border AND an inline message — just a border isn't accessible enough.",
    },
  ];

  for (const c of commentsData) {
    const issueId = createdIssueIds[c.issueIndex];
    if (!issueId) continue;
    await db
      .insert(comment)
      .values({
        id: uid(),
        issueId,
        authorId: c.authorId,
        body: c.body,
      })
      .onConflictDoNothing();
  }

  console.log(`  ✓ ${commentsData.length} comments`);

  // ── Done ──────────────────────────────────────────────────────────────────────
  console.log("\n✅ Seed complete!\n");
  console.log("Demo accounts:");
  console.log("  Admin  → admin@demo.com  / demo1234");
  console.log("  Member → member@demo.com / demo1234");
  console.log("\nOrg: Acme Engineering");
  console.log("Teams: Frontend, Backend, Design");
  console.log(
    "Projects: Website Redesign, API v2, Design System, Internal Dashboard (private)",
  );
}

seed()
  .catch((e) => {
    console.error("\n❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
