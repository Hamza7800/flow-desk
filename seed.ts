"use server";
/**
 * Users:
 *   alex@demo.com   / demo1234
 *   jordan@demo.com / demo1234
 *
 * Orgs:
 *   1. Horizon Labs  — alex=owner,  jordan=admin   — 3 teams
 *   2. Craft Studio  — alex=admin,  jordan=member  — 2 teams
 *   3. Pixel Works   — alex=member, jordan=owner   — 1 team
 *
 */

import { db } from "@/server/db";
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
} from "@/server/db/schema";
import { auth } from "@/server/better-auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrgRole = "owner" | "admin" | "member";
type IssueStatus =
  | "backlog"
  | "planned"
  | "in-progress"
  | "completed"
  | "canceled";
type IssuePriority = "no-priority" | "urgent" | "high" | "medium" | "low";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => crypto.randomUUID();
const shortId = () => Math.random().toString(36).slice(2, 16);
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

const weightedStatus = (): IssueStatus => {
  const w = Math.random();
  if (w < 0.25) return "backlog";
  if (w < 0.45) return "planned";
  if (w < 0.65) return "in-progress";
  if (w < 0.85) return "completed";
  return "canceled";
};

const weightedPriority = (): IssuePriority => {
  const w = Math.random();
  if (w < 0.15) return "urgent";
  if (w < 0.4) return "high";
  if (w < 0.65) return "medium";
  if (w < 0.85) return "low";
  return "no-priority";
};

// ─── Issue title pools ────────────────────────────────────────────────────────

const ISSUE_TITLES: Record<string, string[]> = {
  frontend: [
    "Fix overflow bug on mobile viewport",
    "Implement skeleton loading states",
    "Add keyboard navigation to dropdown",
    "Refactor CSS variables to design tokens",
    "Lazy load images below the fold",
    "Fix z-index stacking in modal overlay",
    "Add error boundary to dashboard",
    "Migrate class components to hooks",
    "Improve contrast ratio on disabled buttons",
    "Debounce search input",
    "Add tooltip to truncated text",
    "Fix flash of unstyled content on load",
    "Implement infinite scroll in feed",
    "Add drag and drop to kanban board",
    "Optimise bundle size — remove unused deps",
    "Fix date picker timezone offset",
    "Add copy-to-clipboard to code blocks",
    "Implement multi-step form with validation",
    "Fix focus trap in dialog",
    "Add pagination to data table",
    "Resolve hydration mismatch in sidebar",
    "Build notification bell component",
    "Add smooth page transitions",
    "Fix avatar fallback when image 404s",
    "Update empty state illustrations",
  ],
  backend: [
    "Add cursor-based pagination to list endpoints",
    "Implement refresh token rotation",
    "Fix N+1 query in team members resolver",
    "Add DB indexes for frequent query patterns",
    "Set up job queue for email delivery",
    "Migrate to connection pooling",
    "Add request validation middleware",
    "Implement soft delete for organizations",
    "Write integration tests for auth flow",
    "Add rate limiting to public API",
    "Set up Redis caching layer",
    "Fix race condition in concurrent writes",
    "Add audit log for role changes",
    "Implement webhook retry mechanism",
    "Add health check endpoint",
    "Migrate to structured logging",
    "Set up DB backup automation",
    "Add idempotency keys to mutations",
    "Fix memory leak in WebSocket handler",
    "Implement GDPR data export endpoint",
    "Add full-text search to issues",
    "Set up feature flag service",
    "Write load tests for API endpoints",
    "Implement multi-region failover",
    "Add CORS configuration for new domains",
  ],
  design: [
    "Audit colour contrast across all components",
    "Redesign onboarding flow",
    "Create motion design guidelines",
    "Update icon set to new style",
    "Design empty state illustrations",
    "Redesign settings page layout",
    "Create print stylesheet for reports",
    "Design responsive email templates",
    "Audit and fix mobile typography scale",
    "Build dark mode colour palette",
    "Design skeleton loading patterns",
    "Create data visualisation guidelines",
    "Update button styles across all variants",
    "Design toast notification system",
    "Redesign sidebar navigation",
    "Create illustration for 404 page",
    "Design permission management UI",
    "Audit spacing system for consistency",
    "Create component documentation site",
    "Design file upload drag and drop UI",
    "Redesign pricing page",
    "Create loading animation for heavy operations",
    "Update form field error states",
    "Design user profile settings page",
    "Audit and fix focus ring visibility",
  ],
  mobile: [
    "Fix crash on Android 12 when backgrounded",
    "Implement biometric authentication",
    "Add haptic feedback to primary actions",
    "Fix keyboard avoiding view on iOS 16",
    "Implement deep linking for notifications",
    "Add offline support with optimistic UI",
    "Fix scroll performance in long lists",
    "Implement push notification preferences",
    "Add swipe to delete gesture",
    "Fix dark mode on status bar",
    "Implement app review prompt",
    "Add share sheet integration",
    "Fix camera permission flow",
    "Implement pull to refresh",
    "Add home screen widget",
    "Fix memory leak in image cache",
    "Add accessibility labels to icons",
    "Implement background app refresh",
    "Fix landscape orientation layout",
    "Add force touch shortcuts",
  ],
  devops: [
    "Set up staging environment",
    "Configure auto-scaling for API servers",
    "Implement blue-green deployment",
    "Set up distributed tracing",
    "Configure alerting for error rate spikes",
    "Migrate CI to GitHub Actions",
    "Set up secrets rotation automation",
    "Add container vulnerability scanning",
    "Configure WAF rules",
    "Set up cost monitoring and alerts",
    "Implement infrastructure as code",
    "Add canary deployment pipeline",
    "Set up database read replicas",
    "Configure CDN for static assets",
    "Add performance budgets to CI",
    "Implement log aggregation pipeline",
    "Set up uptime monitoring",
    "Configure automated DB migrations in CI",
    "Add dependency update automation",
    "Implement chaos engineering tests",
  ],
};

const COMMENTS = [
  "Reproduced locally. Consistent across browsers.",
  "Looking into this now — will update by EOD.",
  "Needs design review before we can move forward.",
  "Blocked by the auth refactor. Will pick up after that lands.",
  "Fixed in the latest branch. Ready for review.",
  "Left a few inline comments in the PR.",
  "Root cause is a missing index. Adding it in this PR.",
  "We should update the docs once this is resolved.",
  "Confirmed fixed in staging. Closing once it hits prod.",
  "Can we bump priority? This is causing user complaints.",
  "Affects fewer than 0.5% of users so deprioritising for now.",
  "Paired on this — the fix is straightforward.",
  "Will need a migration. Added to the release checklist.",
  "Edge case only hits users with more than 1000 items.",
  "Checked with product — this is intentional, not a bug.",
  "Added tests to cover the regression.",
  "This was already partially done in a previous PR.",
  "Stale — closing and creating a fresh ticket with updated scope.",
];

// ─── Org / team config ────────────────────────────────────────────────────────

const ORGS: {
  name: string;
  slug: string;
  alexRole: OrgRole;
  jordanRole: OrgRole;
  teams: {
    name: string;
    domain: keyof typeof ISSUE_TITLES;
    projectCount: number;
  }[];
}[] = [
  {
    name: "Horizon Labs",
    slug: "horizon-labs",
    alexRole: "owner",
    jordanRole: "admin",
    teams: [
      { name: "Frontend", domain: "frontend", projectCount: 4 },
      { name: "Backend", domain: "backend", projectCount: 3 },
      { name: "Mobile", domain: "mobile", projectCount: 3 },
    ],
  },
  {
    name: "Craft Studio",
    slug: "craft-studio",
    alexRole: "admin",
    jordanRole: "member",
    teams: [
      { name: "Design", domain: "design", projectCount: 5 },
      { name: "Engineering", domain: "backend", projectCount: 4 },
    ],
  },
  {
    name: "Pixel Works",
    slug: "pixel-works",
    alexRole: "member",
    jordanRole: "owner",
    teams: [{ name: "Product", domain: "devops", projectCount: 3 }],
  },
];

const PROJECT_NAMES: Record<string, string[]> = {
  frontend: [
    "Web App v2",
    "Design System",
    "Marketing Site",
    "Component Library",
    "Dashboard UI",
    "Onboarding Flow",
    "Analytics Portal",
    "Customer Portal",
  ],
  backend: [
    "API Gateway",
    "Auth Service",
    "Data Pipeline",
    "Notification Service",
    "Billing System",
    "Search Engine",
    "Webhook Manager",
    "Admin API",
  ],
  design: [
    "Brand Refresh",
    "Icon Library",
    "Motion Design",
    "Design Tokens",
    "User Research",
    "Accessibility Audit",
    "Design Ops",
    "UX Writing Guide",
  ],
  mobile: [
    "iOS App",
    "Android App",
    "React Native SDK",
    "Mobile Design System",
    "Push Notifications",
    "Offline Mode",
  ],
  devops: [
    "Infrastructure v2",
    "CI/CD Pipeline",
    "Monitoring Stack",
    "Security Hardening",
    "Cost Optimisation",
  ],
};

const LABEL_SETS = [
  { name: "Bug", color: "#ef4444" },
  { name: "Feature", color: "#6366f1" },
  { name: "Improvement", color: "#f59e0b" },
  { name: "Documentation", color: "#10b981" },
  { name: "Performance", color: "#8b5cf6" },
  { name: "Security", color: "#f97316" },
  { name: "Tech Debt", color: "#6b7280" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function seed() {
  console.log("🌱 Advanced seed starting...\n");

  // ── 1. Users ─────────────────────────────────────────────────────────────────
  console.log("Creating users...");

  const userIds: Record<string, string> = {};

  for (const u of [
    { name: "Alex Rivera", email: "alex@demo.com", password: "demo1234" },
    { name: "Jordan Kim", email: "jordan@demo.com", password: "demo1234" },
  ]) {
    try {
      const res = await auth.api.signUpEmail({
        body: { name: u.name, email: u.email, password: u.password },
      });
      userIds[u.email] = res.user.id;
      console.log(`  ✓ ${u.name}`);
    } catch {
      const existing = await db.query.user.findFirst({
        where: (t, { eq }) => eq(t.email, u.email),
      });
      if (!existing) throw new Error(`Cannot find user ${u.email}`);
      userIds[u.email] = existing.id;
      console.log(`  ~ ${u.name} (already exists)`);
    }
  }

  const alexId = userIds["alex@demo.com"]!;
  const jordanId = userIds["jordan@demo.com"]!;

  // ── 2. Orgs ───────────────────────────────────────────────────────────────────

  for (const orgConfig of ORGS) {
    console.log(`\n── ${orgConfig.name} ─────────────────────────────────`);

    const orgId = shortId();
    await db
      .insert(organization)
      .values({
        id: orgId,
        name: orgConfig.name,
        slug: orgConfig.slug,
        createdAt: new Date(),
      })
      .onConflictDoNothing();

    const existingOrg = await db.query.organization.findFirst({
      where: (t, { eq }) => eq(t.slug, orgConfig.slug),
    });
    const finalOrgId = existingOrg!.id;

    // Org members
    await db
      .insert(member)
      .values({
        id: shortId(),
        organizationId: finalOrgId,
        userId: alexId,
        role: orgConfig.alexRole,
        createdAt: new Date(),
      })
      .onConflictDoNothing();

    await db
      .insert(member)
      .values({
        id: shortId(),
        organizationId: finalOrgId,
        userId: jordanId,
        role: orgConfig.jordanRole,
        createdAt: new Date(),
      })
      .onConflictDoNothing();

    console.log(
      `  Members: alex=${orgConfig.alexRole}, jordan=${orgConfig.jordanRole}`,
    );

    // Labels per org
    const labelIds: Record<string, string> = {};
    for (const l of LABEL_SETS) {
      const id = uid();
      await db
        .insert(label)
        .values({
          id,
          organizationId: finalOrgId,
          name: l.name,
          color: l.color,
        })
        .onConflictDoNothing();
      labelIds[l.name] = id;
    }

    // ── Teams ──────────────────────────────────────────────────────────────────
    for (const teamConfig of orgConfig.teams) {
      const teamId = shortId();
      await db
        .insert(team)
        .values({
          id: teamId,
          name: teamConfig.name,
          organizationId: finalOrgId,
          createdAt: new Date(),
        })
        .onConflictDoNothing();

      // Both users in every team
      for (const userId of [alexId, jordanId]) {
        await db
          .insert(teamMember)
          .values({
            id: shortId(),
            teamId,
            userId,
            createdAt: new Date(),
          })
          .onConflictDoNothing();
      }

      // ── Projects ─────────────────────────────────────────────────────────────
      const projectNamePool = [...PROJECT_NAMES[teamConfig.domain]!];
      const selectedProjects = projectNamePool.slice(
        0,
        teamConfig.projectCount,
      );

      for (let pIdx = 0; pIdx < selectedProjects.length; pIdx++) {
        const projectName = selectedProjects[pIdx]!;
        const ident =
          projectName
            .split(" ")
            .map((w) => w[0]!.toUpperCase())
            .join("")
            .slice(0, 3) +
          (pIdx + 1);

        const projectId = uid();
        const isPrivate = Math.random() < 0.15;

        await db
          .insert(project)
          .values({
            id: projectId,
            organizationId: finalOrgId,
            teamId,
            name: projectName,
            summary: `${projectName} — owned by the ${teamConfig.name} team.`,
            identifier: ident,
            status: pick([
              "backlog",
              "planned",
              "in-progress",
            ] as IssueStatus[]),
            priority: weightedPriority(),
            isPrivate,
            leadId: pIdx % 2 === 0 ? alexId : jordanId,
            issueCounter: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoNothing();

        // Both users as project members
        for (const userId of [alexId, jordanId]) {
          await db
            .insert(projectMember)
            .values({ projectId, userId })
            .onConflictDoNothing();
        }

        // ── Issues ───────────────────────────────────────────────────────────
        const issueCount = 6 + Math.floor(Math.random() * 7); // 6–12
        const titlePool = [...ISSUE_TITLES[teamConfig.domain]!].sort(
          () => Math.random() - 0.5,
        );

        for (let iIdx = 0; iIdx < issueCount; iIdx++) {
          const issueId = uid();
          const title = titlePool[iIdx % titlePool.length]!;

          // Spread creators so both users have created issues
          const creatorId = iIdx % 3 === 0 ? jordanId : alexId;

          await db
            .insert(issue)
            .values({
              id: issueId,
              organizationId: finalOrgId,
              teamId,
              projectId,
              creatorId,
              title,
              identifier: `${ident}-${iIdx + 1}`,
              status: weightedStatus(),
              priority: weightedPriority(),
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .onConflictDoNothing();

          // Assignee — alex 45%, jordan 35%, unassigned 20%
          const roll = Math.random();
          if (roll < 0.45) {
            await db
              .insert(issueAssignee)
              .values({ issueId, userId: alexId })
              .onConflictDoNothing();
          } else if (roll < 0.8) {
            await db
              .insert(issueAssignee)
              .values({ issueId, userId: jordanId })
              .onConflictDoNothing();
          }

          // Labels — 0, 1 or 2
          const labelNames = Object.keys(labelIds).sort(
            () => Math.random() - 0.5,
          );
          const numLabels =
            Math.random() < 0.25 ? 0 : Math.random() < 0.6 ? 1 : 2;
          for (let l = 0; l < numLabels; l++) {
            const lid = labelIds[labelNames[l]!];
            if (lid) {
              await db
                .insert(issueLabel)
                .values({ issueId, labelId: lid })
                .onConflictDoNothing();
            }
          }

          // Comments — 50% chance, 1–3 comments
          if (Math.random() < 0.5) {
            const commentCount = 1 + Math.floor(Math.random() * 3);
            for (let c = 0; c < commentCount; c++) {
              await db
                .insert(comment)
                .values({
                  id: uid(),
                  issueId,
                  authorId: c % 2 === 0 ? alexId : jordanId,
                  body: COMMENTS[Math.floor(Math.random() * COMMENTS.length)]!,
                })
                .onConflictDoNothing();
            }
          }
        }

        console.log(
          `  ✓ ${teamConfig.name} / ${projectName} (${ident}) — ${issueCount} issues${isPrivate ? " 🔒" : ""}`,
        );
      }
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────────
  console.log("\n✅ Done!\n");
  console.log("┌─────────────────────────────────────────────┐");
  console.log("│  Demo accounts                              │");
  console.log("│                                             │");
  console.log("│  alex@demo.com    / demo1234                │");
  console.log("│  jordan@demo.com  / demo1234                │");
  console.log("├─────────────────────────────────────────────┤");
  console.log("│  Horizon Labs  — alex: owner  jordan: admin │");
  console.log("│  Craft Studio  — alex: admin  jordan: member│");
  console.log("│  Pixel Works   — alex: member jordan: owner │");
  console.log("└─────────────────────────────────────────────┘");
}
