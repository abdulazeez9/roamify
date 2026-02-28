import { Controller, useFormContext } from 'react-hook-form';
import { Role } from '@zagotours/types';
import { FormField } from './FormField';

export function IdentitySection({ finalRole }: { finalRole: Role | null }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Define your dynamic logic in a simple object
  const isCorporate = finalRole === Role.COOPERATE_AGENT;
  const isAffiliate = finalRole === Role.AFFILIATE;

  const labels = {
    name: isCorporate ? 'Company Name' : 'Full Name',
    email: isCorporate ? 'Contact Email' : 'Email address',
    placeholder: isCorporate
      ? 'Enter registered company name'
      : 'Enter your full name',
  };

  return (
    <>
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            label={labels?.name}
            placeholder={labels.placeholder}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        name='email'
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            label={labels.email}
            type='email'
            placeholder='email@example.com'
            error={errors.email?.message}
          />
        )}
      />

      {/* Logic-based visibility is now very clean */}
      {finalRole === Role.ADVENTURER && (
        <Controller
          name='country'
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              label='Country of Residence'
              type='select' // or 'combo'
              error={errors.country?.message}
            />
          )}
        />
      )}

      {finalRole !== Role.COOPERATE_AGENT && (
        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              label='Phone'
              type='tel'
              placeholder='Enter phone number'
              error={errors.phone?.message}
            />
          )}
        />
      )}
    </>
  );
}
