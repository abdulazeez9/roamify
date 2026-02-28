import { useFormContext, Controller } from 'react-hook-form';
import { Role } from '@zagotours/types';
import { FormField } from './FormField';

export function SecuritySection({ finalRole }: any) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Controller
        name='password'
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            label='Password'
            type='password'
            error={errors.password?.message}
          />
        )}
      />
      <Controller
        name='confirmPassword'
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            label='Confirm Password'
            type='password'
            error={errors.confirmPassword?.message}
          />
        )}
      />

      {finalRole === Role.ADVENTURER && (
        <Controller
          name='safetyAmbassador'
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              label='Become a Safety Ambassador'
              type='checkbox'
            />
          )}
        />
      )}
    </>
  );
}
