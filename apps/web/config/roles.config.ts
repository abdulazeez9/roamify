import { Role } from '@zagotours/types';

// Role home paths
export const ROLE_HOME: Record<Role, string> = {
  [Role.SUPER_ADMIN]: '/admin',
  [Role.ADMIN]: '/admin',
  [Role.INDEPENDENT_AGENT]: '/independent-agent',
  [Role.COOPERATE_AGENT]: '/corporate-agent',
  [Role.ADVENTURER]: '/adventurer',
  [Role.AFFILIATE]: '/affiliate',
};

// Role-based access map
export const ROLE_ACCESS: Record<string, Role[]> = {
  '/admin': [Role.SUPER_ADMIN, Role.ADMIN],
  '/independent-agent': [Role.INDEPENDENT_AGENT],
  '/corporate-agent': [Role.COOPERATE_AGENT],
  '/adventurer': [Role.ADVENTURER],
  '/affiliate': [Role.AFFILIATE],
};
