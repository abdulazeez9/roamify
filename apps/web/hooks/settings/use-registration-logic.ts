'use client';
import { useState, useEffect } from 'react';
import { CustomerRole, Role } from '@zagotours/types';
import { useRoleStore } from '@/store/role-selector.store';

type RoleCategory = 'AFFILIATE' | 'ADVENTURER' | 'AGENT';
type AgentType = Role.INDEPENDENT_AGENT | Role.COOPERATE_AGENT;

export function useRegistrationLogic() {
  const storeRole = useRoleStore((state) => state.role);

  const [selectedCategory, setSelectedCategory] =
    useState<RoleCategory>('ADVENTURER');
  const [selectedAgentType, setSelectedAgentType] = useState<AgentType>(
    Role.INDEPENDENT_AGENT,
  );
  const [finalRole, setFinalRole] = useState<CustomerRole | null>(null);

  useEffect(() => {
    if (storeRole === 'AGENT') {
      setSelectedCategory('AGENT');
      setFinalRole(selectedAgentType as CustomerRole);
    } else {
      setSelectedCategory(storeRole as RoleCategory);
      setFinalRole(storeRole as CustomerRole);
      setSelectedAgentType(Role.INDEPENDENT_AGENT);
    }
  }, [storeRole, selectedAgentType]);

  const handleAgentTypeSelect = (agentType: AgentType) => {
    setSelectedAgentType(agentType);
    setFinalRole(agentType as CustomerRole);
  };

  return {
    selectedCategory,
    selectedAgentType,
    finalRole,
    handleAgentTypeSelect,
  };
}
