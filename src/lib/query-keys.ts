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
  },

  invitations: {
    all: ["invitations"] as const,
    list: (orgId: string) =>
      [...queryKeys.invitations.all, "list", orgId] as const,
  },

  // projects: {
  //   all: ["projects"] as const,
  //   list: (orgId: string) =>
  //     [...queryKeys.projects.all, "list", orgId] as const,
  // },

  // issues: {
  //   all: ["issues"] as const,
  //   list: (orgId: string) => [...queryKeys.issues.all, "list", orgId] as const,
  // },

  teams: {
    all: ["teams"] as const,
    orgList: (orgId: string) => [...queryKeys.teams.all, "org", orgId] as const,
    userList: () => [...queryKeys.teams.all, "user"] as const,
    detail: (teamId: string) =>
      [...queryKeys.teams.all, "detail", teamId] as const,
  },

  projects: {
    all: ["projects"] as const,
    orgList: (orgId: string) =>
      [...queryKeys.projects.all, "list", orgId] as const,
    teamList: (orgId: string, teamId: string) =>
      [...queryKeys.projects.all, "list", orgId, "team", teamId] as const,
    detail: (projectId: string) =>
      [...queryKeys.projects.all, "detail", projectId] as const,
  },

  issues: {
    all: ["issues"] as const,
    orgList: (orgId: string) =>
      [...queryKeys.issues.all, "list", orgId] as const,
    byProject: (projectId: string) =>
      [...queryKeys.issues.all, "project", projectId] as const,
    byTeam: (teamId: string) =>
      [...queryKeys.issues.all, "team", teamId] as const,
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
