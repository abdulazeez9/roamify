import { Role } from '@zagotours/types';
import { useAuthSession } from './use-auth-session';

export function usePermissions() {
  const { user } = useAuthSession();

  /**
   * Check if user has specific role(s)
   */
  const hasRole = (requiredRole: Role | Role[]) => {
    if (!user) return false;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.some((role) => user.role === role);
  };

  // Role flags
  const isSuperAdmin = hasRole(Role.SUPER_ADMIN);
  const isAdmin = hasRole(Role.ADMIN);
  const isAffiliate = hasRole(Role.AFFILIATE);
  const isAdventurer = hasRole(Role.ADVENTURER);
  const isIndependentAgent = hasRole(Role.INDEPENDENT_AGENT);
  const isCooperateAgent = hasRole(Role.COOPERATE_AGENT);

  const isAnyAdmin = hasRole([Role.SUPER_ADMIN, Role.ADMIN]);
  const isAnyAgent = hasRole([Role.INDEPENDENT_AGENT, Role.COOPERATE_AGENT]);

  return {
    // User data
    user,
    role: user?.role,

    // Main checker function
    hasRole,

    // Individual role flags
    isSuperAdmin,
    isAdmin,
    isAffiliate,
    isAdventurer,
    isIndependentAgent,
    isCooperateAgent,

    // Combined role flags
    isAnyAdmin,
    isAnyAgent,

    // Utility
    isAuthenticated: !!user,
  };
}
