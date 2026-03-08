import { useOrganizationContext } from "@/components/context/organization-client-context";
import { authClient } from "@/server/better-auth/client";

type Role = "owner" | "admin" | "member";

const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

const hasRole = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const usePermissions = () => {
  const { org } = useOrganizationContext();
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const currentMember = org?.members?.find((m) => m.userId === currentUserId);

  const role = (currentMember?.role ?? "member") as Role;

  return {
    role,
    isOwner: role === "owner",
    isAdmin: hasRole(role, "admin"),
    isMember: hasRole(role, "member"),

    canCreateIssue: hasRole(role, "member"),
    canEditIssue: hasRole(role, "member"),
    canDeleteIssue: hasRole(role, "admin"),

    canCreateProject: hasRole(role, "member"),
    canArchiveProject: hasRole(role, "admin"),
    canDeleteProject: hasRole(role, "admin"),
    canManageProjectMembers: hasRole(role, "admin"),

    canCreateTeam: hasRole(role, "admin"),
    canDeleteTeam: hasRole(role, "admin"),
    canManageTeamMembers: hasRole(role, "admin"),

    canInviteMembers: hasRole(role, "admin"),
    canRemoveMembers: hasRole(role, "admin"),
    canDeleteOrg: role === "owner",
    canChangeRoles: hasRole(role, "admin"),

    isCurrentUser: (userId: string) => userId === currentUserId,
    currentUserId,
  };
};
