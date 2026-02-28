'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Role } from '@zagotours/types';
import { FormField } from './FormField';

const certificationOptions = [
  { value: 'IATA', label: 'IATA' },
  { value: 'CLIA', label: 'CLIA' },
  { value: 'ASTA/VTA', label: 'ASTA/VTA' },
  { value: 'CTA/CTC/CTIE', label: 'CTA/CTC/CTIE (The Travel Institute)' },
  { value: 'ARC', label: 'ARC' },
  { value: 'TRUE', label: 'TRUE' },
  { value: 'ABTA', label: 'ABTA' },
  { value: 'ATOL', label: 'ATOL' },
  { value: 'ACTA/TICO', label: 'ACTA/TICO' },
  { value: 'AFTA', label: 'AFTA' },
  { value: 'SATSA', label: 'SATSA' },
  { value: 'PATA', label: 'PATA' },
  { value: 'TAANZ', label: 'TAANZ' },
  { value: 'Other', label: 'Other(please specify)' },
];

export function DynamicRoleSection({ finalRole }: { finalRole: Role | null }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  switch (finalRole) {
    case Role.COOPERATE_AGENT:
      return (
        <Controller
          name='business_description'
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              label='Tell us about your travel business'
              type='textarea'
              placeholder='Describe your company services...'
              error={errors.business_description?.message}
            />
          )}
        />
      );

    case Role.INDEPENDENT_AGENT:
      return (
        <Controller
          name='certifications'
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              label='Certifications'
              type='combo'
              options={certificationOptions}
              placeholder='e.g. IATA, Local License'
              error={errors.certifications?.message}
            />
          )}
        />
      );

    case Role.AFFILIATE:
      return (
        <>
          <Controller
            name='find_us'
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                label='How did you hear about us?'
                placeholder='Social media, friend, etc.'
                error={errors.find_us?.message}
              />
            )}
          />
          <Controller
            name='community'
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                label='Community/Brand/Host agency name'
                placeholder='Enter organization name'
                error={errors.community?.message}
              />
            )}
          />
          <Controller
            name='website_link'
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                label='Website/Social Link'
                placeholder='https://...'
                error={errors.website_link?.message}
              />
            )}
          />
        </>
      );

    default:
      return null;
  }
}
