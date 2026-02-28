'use client';
import { Box, Flex, RadioGroup } from '@chakra-ui/react';
import { Role } from '@zagotours/types';

type AgentType = Role.INDEPENDENT_AGENT | Role.COOPERATE_AGENT;

interface AgentTypeSelectorProps {
  selectedAgentType: AgentType;
  onAgentTypeChange: (agentType: AgentType) => void;
}

const agentTypeOptions = [
  { value: 'INDEPENDENT_AGENT' as AgentType, label: 'Independent' },
  { value: 'COOPERATE_AGENT' as AgentType, label: 'Corporate' },
];

export function AgentTypeSelector({
  selectedAgentType,
  onAgentTypeChange,
}: AgentTypeSelectorProps) {
  return (
    <Box
      p={3}
      bg='blue.50'
      borderRadius='md'
      border='1px solid'
      borderColor='blue.100'
    >
      <RadioGroup.Root
        value={selectedAgentType || ''}
        onValueChange={(e) => onAgentTypeChange(e.value as AgentType)}
      >
        <Flex justify='space-between'>
          {agentTypeOptions.map((option) => (
            <RadioGroup.Item key={option.value} value={option.value as string}>
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator cursor='pointer' />
              <RadioGroup.ItemText fontSize='sm'>
                {option.label}
              </RadioGroup.ItemText>
            </RadioGroup.Item>
          ))}
        </Flex>
      </RadioGroup.Root>
    </Box>
  );
}
