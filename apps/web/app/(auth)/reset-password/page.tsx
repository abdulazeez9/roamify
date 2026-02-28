'use client';

import React, { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPassword;
