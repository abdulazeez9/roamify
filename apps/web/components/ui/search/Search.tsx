'use client';

import { Flex, Input, Box, IconButton, InputProps } from '@chakra-ui/react';
import { LuSearch, LuX } from 'react-icons/lu';
import { useState } from 'react';

interface SearchBarProps extends Omit<InputProps, 'onChange' | 'width'> {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  width?: string | object;
  bg?: string;
}

export const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  onChange,
  value: externalValue,
  width = 'full',
  bg = 'gray.50',
  ...props
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState('');

  const isControlled = externalValue !== undefined;
  const value = isControlled ? externalValue : localValue;

  const handleClear = () => {
    if (isControlled) {
      onSearch?.('');
    } else {
      setLocalValue('');
      onSearch?.('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setLocalValue(newValue);
    }
    onChange?.(e);
    onSearch?.(newValue);
  };

  return (
    <Box width={width} maxW='600px'>
      <Flex
        align='center'
        bg={bg}
        px={4}
        borderRadius='full'
        border='0.5px solid'
        borderColor='primary'
        _focusWithin={{
          borderColor: 'primary',
          bg: 'white',
          boxShadow: '0 0 0 1px var(--chakra-colors-primary)',
        }}
        transition='all 0.2s'
      >
        <LuSearch color='gray' size='18px' />
        <Input
          {...props}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          px={3}
          fontSize='md'
          border='none'
          outline='none'
          _focus={{ boxShadow: 'none' }}
          _placeholder={{ color: 'gray.500' }}
          bg='transparent'
        />

        {value && (
          <IconButton
            aria-label='Clear search'
            variant='ghost'
            size='xs'
            onClick={handleClear}
            color='gray.400'
            _hover={{ color: 'red.500', bg: 'transparent' }}
          >
            <LuX />
          </IconButton>
        )}
      </Flex>
    </Box>
  );
};
