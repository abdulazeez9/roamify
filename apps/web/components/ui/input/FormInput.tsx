'use client';

import {
  Input,
  InputProps,
  Textarea,
  TextareaProps,
  Field,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';

type SharedChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

interface FormInputProps extends Omit<InputProps & TextareaProps, 'onChange'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  isTextArea?: boolean;
  rows?: number;
  onChange?: (e: SharedChangeEvent) => void;
  value?: string;
}

export const FormInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormInputProps
>(
  (
    {
      label,
      helperText,
      errorText,
      isTextArea = false,
      rows = 4,
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    return (
      <Field.Root invalid={!!errorText} w='full'>
        {label && (
          <Field.Label fontWeight='bold' fontSize='sm' mb={1}>
            {label}
          </Field.Label>
        )}

        {isTextArea ? (
          <Textarea
            {...props}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            value={value}
            onChange={onChange}
            rows={rows}
            focusRingColor='primary'
            borderRadius='xl'
            bg='white'
          />
        ) : (
          <Input
            {...props}
            ref={ref as React.Ref<HTMLInputElement>}
            value={value}
            onChange={onChange}
            focusRingColor='primary'
            borderRadius='xl'
            bg='white'
            _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
          />
        )}

        {errorText && (
          <Field.ErrorText fontSize='xs' color='red.500'>
            {errorText}
          </Field.ErrorText>
        )}
        {helperText && !errorText && (
          <Field.HelperText fontSize='xs'>{helperText}</Field.HelperText>
        )}
      </Field.Root>
    );
  },
);

FormInput.displayName = 'FormInput';
