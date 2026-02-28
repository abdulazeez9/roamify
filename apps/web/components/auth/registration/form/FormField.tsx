'use client';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { PasswordInput } from '@/components/ui/input/password-input';
import { Input, Textarea, Field, Checkbox } from '@chakra-ui/react';

//Dynamic imports
const Select = dynamic(() => import('react-select'), { ssr: false });
const PhoneInput = dynamic(
  () => import('react-international-phone').then((mod) => mod.PhoneInput),
  { ssr: false },
);
import 'react-international-phone/style.css';

export const FormField = forwardRef<any, any>(
  (
    {
      label,
      name,
      type = 'text',
      error,
      placeholder,
      options,
      required,
      value,
      onChange,
      onBlur,
    }: any,
    ref: any,
  ) => {
    return (
      <Field.Root invalid={!!error} required={required}>
        {type !== 'checkbox' && (
          <Field.Label fontSize='sm' fontWeight='bold'>
            {label}
          </Field.Label>
        )}

        {(() => {
          switch (type) {
            case 'password':
              return (
                <PasswordInput
                  ref={ref}
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={placeholder}
                />
              );
            case 'textarea':
              return (
                <Textarea
                  ref={ref}
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={placeholder}
                />
              );
            case 'combo':
              return (
                <Select
                  ref={ref}
                  instanceId={name}
                  isMulti
                  options={options}
                  value={options?.filter((opt: any) =>
                    value?.includes(opt.value),
                  )}
                  onChange={(selectedOptions: any) => {
                    const values = selectedOptions
                      ? selectedOptions.map((opt: any) => opt.value)
                      : [];
                    onChange(values);
                  }}
                  placeholder={placeholder}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: error ? '#E53E3E' : '#E2E8F0',
                      borderRadius: '0.375rem',
                      minHeight: '40px',
                      width: '100%',
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      maxHeight: '40px',
                      overflowY: 'auto',
                      padding: '2px 8px',
                    }),
                    multiValue: (base) => ({
                      ...base,
                      maxWidth: '100%',
                    }),
                    container: (base) => ({
                      ...base,
                      width: '100%',
                    }),
                  }}
                />
              );
            case 'checkbox':
              return (
                <Checkbox.Root
                  name={name}
                  checked={value ?? false}
                  onCheckedChange={(details) => onChange(details.checked)}
                >
                  <Checkbox.HiddenInput ref={ref} onBlur={onBlur} />
                  <Checkbox.Control />
                  <Checkbox.Label fontSize='sm' fontWeight='medium'>
                    {label}
                  </Checkbox.Label>
                </Checkbox.Root>
              );
            case 'tel':
              return (
                <PhoneInput
                  defaultCountry='us'
                  value={value ?? ''}
                  onChange={(phone) => onChange(phone)}
                  inputRef={ref}
                  placeholder={placeholder}
                  style={{ width: '100%' }}
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    fontSize: '14px',
                    borderRadius: '0 0.375rem 0.375rem 0',
                    border: error ? '1px solid #E53E3E' : '1px solid #E2E8F0',
                  }}
                  countrySelectorStyleProps={{
                    buttonStyle: {
                      height: '40px',
                      borderRadius: '0.375rem 0 0 0.375rem',
                      border: error ? '1px solid #E53E3E' : '1px solid #E2E8F0',
                      borderRight: 'none',
                      backgroundColor: '#F7FAFC',
                    },
                  }}
                />
              );
            default:
              return (
                <Input
                  ref={ref}
                  name={name}
                  type={type}
                  value={value ?? ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={placeholder}
                />
              );
          }
        })()}

        {error && (
          <Field.ErrorText fontSize='xs' color='red.500'>
            {error}
          </Field.ErrorText>
        )}
      </Field.Root>
    );
  },
);

FormField.displayName = 'FormField';
