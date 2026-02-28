'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AdminRegisterDto,
} from '@zagotours/types';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { authKeys } from './query-keys';
import { notify } from '@/lib/toast';

// ============================================
// AUTH HOOK (Login, Register, Logout)
// ============================================
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // --- LOGIN MUTATION ---
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginDto) => {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid credentials');
      }

      if (!result?.ok) {
        throw new Error('Invalid credentials');
      }

      return result;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });

      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get('callbackUrl');

      if (callbackUrl) {
        window.location.href = decodeURIComponent(callbackUrl);
        return;
      }

      router.push('/dashboard');
    },
    onError: () => {
      notify('Login Failed', 'error', 'Invalid email or password');
    },
  });

  // --- REGISTER MUTATION ---
  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) =>
      apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      notify(
        'Account Created',
        'success',
        'Please check your email to verify your account.',
      );
      router.push('/login');
    },
    onError: (error: any) => {
      const serverMessage =
        error?.message || 'Unable to create account. Please try again.';
      notify('Registration Failed', 'error', serverMessage);
    },
  });

  // --- ADMIN REGISTER MUTATION ---
  const registerAdmin = useMutation({
    mutationFn: (data: AdminRegisterDto) =>
      apiRequest(API_ENDPOINTS.AUTH.REGISTER_ADMIN, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notify('Success', 'success', 'Admin account created successfully');
    },
    onError: () => {
      notify('Failed', 'error', 'Unable to create admin account');
    },
  });

  // --- LOGOUT ---
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    queryClient.clear();
  };

  return {
    // Login
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,

    // Register
    register: registerMutation.mutate,
    registerAdmin: registerAdmin.mutate,
    isRegisteringAdmin: registerAdmin.isPending,
    isRegistering: registerMutation.isPending,

    logout: handleLogout,
  };
}

// ============================================
// PASSWORD HOOK (Forgot, Reset)
// ============================================
export function usePassword() {
  // --- Forgot Password Mutation ---
  const forgotPassword = useMutation({
    mutationFn: async (data: ForgotPasswordDto) => {
      return apiRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      notify(
        'Email Sent',
        'success',
        'If an account exists, you will receive a password reset link',
      );
    },
    onError: () => {
      notify('Failed', 'error', 'Error sending email');
    },
  });

  // --- Reset Password Mutation ---
  const resetPassword = useMutation({
    mutationFn: async (data: ResetPasswordDto) => {
      return apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      notify(
        'Password Reset',
        'success',
        'Your password has been reset successfully',
      );
    },
    onError: () => {
      notify('Reset Failed', 'error', 'Invalid or expired reset link');
    },
  });

  return {
    // Forgot Password exports
    sendResetLink: forgotPassword.mutate,
    isSendingLink: forgotPassword.isPending,

    // Reset Password exports
    resetPassword: resetPassword.mutate,
    isResetting: resetPassword.isPending,
  };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => apiRequest(API_ENDPOINTS.AUTH.ME),
    staleTime: 5 * 60 * 1000,
  });
}
