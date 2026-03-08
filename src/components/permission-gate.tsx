import { usePermissions } from "@/hooks/use-permissions";
import type { ReactNode } from "react";

type PermissionKey = keyof ReturnType<typeof usePermissions>;

type Props = {
  permission: PermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
};

const PermissionGate = ({ children, permission, fallback }: Props) => {
  const permissions = usePermissions();
  const allowed = permissions[permission];

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
};

export default PermissionGate;
