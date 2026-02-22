export const queryKeys = {
  organizations: {
    all: ["organizations"] as const,
    list: () => [...queryKeys.organizations.all, "list"] as const,
    detail: (slug: string) =>
      [...queryKeys.organizations.all, "detail", slug] as const,
  },

  invitations: {
    all: ["invitations"] as const,
    org: (orgId: string) => ["invitations", orgId] as const,
    list: (orgId: string) => ["invitations", orgId, "list"] as const,
  },

  projects: {
    all: ["projects"] as const,
    list: (orgId: string) =>
      [...queryKeys.projects.all, "list", orgId] as const,
  },

  issues: {
    all: ["issues"] as const,
    list: (orgId: string) => [...queryKeys.issues.all, "list", orgId] as const,
  },

  teams: {
    all: ["teams"] as const,
    orgList: (orgId: string) => [...queryKeys.teams.all, "org", orgId] as const,
    userList: (orgId: string) =>
      [...queryKeys.teams.all, "user", orgId] as const,
  },
};
