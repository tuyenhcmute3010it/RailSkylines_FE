"use client";
import { useAppContext } from "@/components/app-provider";
import { usePermissions } from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";

type RestrictedProps = {
  roles?: RoleType[];
  permission?: string;
  module?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function Restricted({
  roles,
  permission,
  module,
  children,
  fallback = null,
}: RestrictedProps) {
  const { role } = useAppContext();
  const { hasPermission, hasModulePermission } = usePermissions();

  const hasAccess =
    (!roles || (role && roles.includes(role))) &&
    (!permission || hasPermission(permission)) &&
    (!module || hasModulePermission(module));

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
