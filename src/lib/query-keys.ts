export const queryKeys = {
  organizations: {
    all: ["organizations"] as const,
    list: () => [...queryKeys.organizations.all, "list"] as const,
    detail: (slug: string) =>
      [...queryKeys.organizations.all, "detail", slug] as const,
  },

  members: {
    all: ["members"] as const,
    list: (orgId: string) => [...queryKeys.members.all, "list", orgId] as const,
    role: (orgId: string) => [...queryKeys.members.all, "role", orgId] as const,
  },

  invitations: {
    all: ["invitations"] as const,
    list: (orgId: string) =>
      [...queryKeys.invitations.all, "list", orgId] as const,
  },

  teams: {
    all: ["teams"] as const,
    orgList: (orgId: string) => [...queryKeys.teams.all, "org", orgId] as const,
    userList: () => [...queryKeys.teams.all, "user"] as const,
    detail: (teamId: string) =>
      [...queryKeys.teams.all, "detail", teamId] as const,
    members: (teamId: string) =>
      [...queryKeys.teams.all, "members", teamId] as const,
  },

  projects: {
    all: ["projects"] as const,
    orgList: (orgId: string) =>
      [...queryKeys.projects.all, "list", orgId] as const,
    teamList: (teamId: string) =>
      [...queryKeys.projects.all, "list", "team", teamId] as const,
    detail: (projectId: string) =>
      [...queryKeys.projects.all, "detail", projectId] as const,
    projectLead: (projectId: string) =>
      [...queryKeys.projects.all, "lead", projectId] as const,
  },

  issues: {
    all: ["issues"] as const,
    orgList: (orgId: string) =>
      [...queryKeys.issues.all, "list", orgId] as const,
    byProject: (projectId: string) =>
      [...queryKeys.issues.all, "project", projectId] as const,
    byTeam: (teamId: string) =>
      [...queryKeys.issues.all, "team", teamId] as const,
    byUserAssigned: () => [...queryKeys.issues.all, "user-assigned"] as const,
    byUserCreated: () => [...queryKeys.issues.all, "user-created"] as const,
    detail: (issueId: string) =>
      [...queryKeys.issues.all, "detail", issueId] as const,
  },

  comments: {
    all: ["comments"] as const,
    byIssue: (issueId: string) =>
      [...queryKeys.comments.all, "issue", issueId] as const,
  },

  labels: {
    all: ["labels"] as const,
    list: (orgId: string) => [...queryKeys.labels.all, "list", orgId] as const,
  },

  cycles: {
    all: ["cycles"] as const,
    byProject: (projectId: string) =>
      [...queryKeys.cycles.all, "project", projectId] as const,
    detail: (cycleId: string) =>
      [...queryKeys.cycles.all, "detail", cycleId] as const,
  },

  notifications: {
    all: ["notifications"] as const,
    list: (orgId: string) =>
      [...queryKeys.notifications.all, "list", orgId] as const,
  },
};

export const cacheKeys = {
  organizations: {
    detail: (slug: string) => `org:detail:${slug}`,
    list: (userId: string) => `org:list:${userId}`,
  },

  members: {
    list: (orgId: string) => `members:list:${orgId}`,
    role: (orgId: string, userId: string) => `members:role:${orgId}:${userId}`,
  },

  invitations: {
    list: (orgId: string) => `invitations:list:${orgId}`,
  },

  teams: {
    orgList: (orgId: string) => `teams:org:${orgId}`,
    userList: (userId: string) => `teams:user:${userId}`,
    detail: (teamId: string) => `teams:detail:${teamId}`,
    members: (teamId: string) => `teams:members:${teamId}`,
    membership: (userId: string, teamId: string) =>
      `team:membership:${userId}:${teamId}`,
  },

  projects: {
    orgList: (orgId: string) => `projects:org:${orgId}`,
    teamList: (orgId: string, teamId: string) =>
      `projects:team:${teamId}:org:${orgId}`,
    detail: (projectId: string) => `projects:detail:${projectId}`,
    lead: (projectId: string) => `projects:lead:${projectId}`,
  },

  issues: {
    orgList: (orgId: string) => `issues:org:${orgId}`,
    byProject: (projectId: string) => `issues:project:${projectId}`,
    byTeam: (teamId: string) => `issues:team:${teamId}`,
    byUserAssigned: (userId: string, orgId: string) =>
      `issues:assigned:${userId}:${orgId}`,
    byUserCreated: (userId: string, orgId: string) =>
      `issues:created:${userId}:${orgId}`,
    detail: (issueId: string) => `issues:detail:${issueId}`,
  },
};
