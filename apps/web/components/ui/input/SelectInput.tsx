import { NativeSelect } from '@chakra-ui/react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
  width?: string | object;
}

export function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  width = 'full',
}: SelectProps) {
  return (
    <NativeSelect.Root size='xs' width={width} border='none' outline='none'>
      <NativeSelect.Field
        value={value}
        onChange={(e) => onChange(e.target.value)}
        cursor='pointer'
      >
        {placeholder && <option value=''>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </NativeSelect.Field>
    </NativeSelect.Root>
  );
}
