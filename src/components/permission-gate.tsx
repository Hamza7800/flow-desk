import { usePermissions } from "@/hooks/use-permissions";
import type { ReactNode } from "react";

type PermissionKey = keyof ReturnType<typeof usePermissions>;

type Props = {
  permission: PermissionKey;
  projectLead?: boolean;
  projectMember?: boolean;
  teamMember?: boolean;
  resourceOwnerId?: string;

  children: ReactNode;
  fallback?: ReactNode;
};

const PermissionGate = ({
  permission,
  projectLead,
  projectMember,
  teamMember,
  resourceOwnerId,
  children,
  fallback = null,
}: Props) => {
  const permissions = usePermissions({
    projectLead,
    projectMember,
    teamMember,
    resourceOwnerId,
  });

  const allowed = permissions[permission];

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
};

export default PermissionGate;
