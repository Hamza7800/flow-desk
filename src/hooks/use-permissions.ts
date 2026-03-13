import { authClient } from "@/server/better-auth/client";
import { useCurrentMemberRole } from "./use-member-role";

type Role = "owner" | "admin" | "member";

const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

const hasRole = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

type PermissionsOptions = {
  projectLead?: boolean;
  projectMember?: boolean;
  teamMember?: boolean;
  resourceOwnerId?: string;
};

export const usePermissions = (opts: PermissionsOptions = {}) => {
  const { data: session } = authClient.useSession();
  const { data: userRole } = useCurrentMemberRole();

  const currentUserId = session?.user?.id;
  const role = (userRole ?? "member") as Role;

  const {
    projectLead = false,
    projectMember = false,
    teamMember = false,
    resourceOwnerId,
  } = opts;

  const isResourceOwner =
    !!resourceOwnerId && resourceOwnerId === currentUserId;

  return {
    role,
    isOwner: role === "owner",
    isAdmin: hasRole(role, "admin"),
    isMember: hasRole(role, "member"),

    isProjectLead: projectLead,
    isProjectMember: projectMember,
    isTeamMember: teamMember,
    isResourceOwner,

    canCreateIssue: hasRole(role, "member"),
    canEditIssue: hasRole(role, "member") || isResourceOwner,
    canDeleteIssue: hasRole(role, "owner") || isResourceOwner,

    canCreateProject: hasRole(role, "member"),
    canArchiveProject: hasRole(role, "admin") || projectLead,
    canDeleteProject: hasRole(role, "owner"),
    canManageProjectMembers: hasRole(role, "admin") || projectLead,

    canCreateTeam: hasRole(role, "admin"),
    canDeleteTeam: hasRole(role, "owner"),
    canEditTeam: hasRole(role, "admin"),
    canManageTeamMembers: hasRole(role, "admin"),

    canInviteMembers: hasRole(role, "admin"),
    canRemoveMembers: hasRole(role, "admin"),
    canDeleteOrg: role === "owner",
    canChangeRoles: hasRole(role, "admin"),

    isCurrentUser: (userId: string) => userId === currentUserId,
    currentUserId,
  };
};
