'use client';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, VStack } from '@chakra-ui/react';
import Button from '@/components/ui/button/Button';
import { useRegistrationLogic } from '@/hooks/settings/use-registration-logic';
import {
  RegistrationFormData,
  registrationSchema,
} from '@/app/validations/auth-validation';
import { useEffect, Suspense } from 'react';
import { RegistrationHeader } from '../RegistrationHeader';
import { AgentTypeSelector } from '../AgentTypeSelector';
import { IdentitySection } from './IdentitySection';
import { DynamicRoleSection } from './DynamicRoleSection';
import { SecuritySection } from './SecuritySection';
import { RegisterDto, CustomerRole, Role } from '@zagotours/types';
import { useAuth } from '@/hooks';
import { useSearchParams } from 'next/navigation';

function RegistrationFormContent() {
  const { register, isRegistering } = useAuth();
  const searchParams = useSearchParams();

  const {
    selectedCategory,
    selectedAgentType,
    finalRole,
    handleAgentTypeSelect,
  } = useRegistrationLogic();

  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      country: '',
      role: finalRole || undefined,
      referralCode: '',
      business_description: '',
      certifications: [] as string[],
      howDidYouHear: '',
      community: '',
      website_link: '',
      safetyAmbassador: false,
    },
  });

  // Capture referral code from URL query
  useEffect(() => {
    const referralCode = searchParams.get('ref');
    if (referralCode) {
      methods.setValue('referralCode', referralCode, { shouldValidate: true });
    }
  }, [searchParams, methods]);

  useEffect(() => {
    if (finalRole) {
      methods.setValue('role', finalRole, { shouldValidate: true });
    }
  }, [finalRole, methods]);

  const onFormSubmit = (data: RegistrationFormData) => {
    const payload: RegisterDto = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      country: data.country,
      role: data.role as CustomerRole,
      referralCode: data.referralCode,
      safetyAmbassador: data.safetyAmbassador,
    };

    // Add nested details based on role
    if (data.role === Role.INDEPENDENT_AGENT) {
      payload.agentDetails = {
        certifications: data.certifications as string[],
        howDidYouHear: data.howDidYouHear,
      };
    }

    if (data.role === Role.COOPERATE_AGENT) {
      payload.cooperateDetails = {
        companyName: data.name,
        travelBusinessDescription: data.business_description!,
        howDidYouHear: data.howDidYouHear,
      };
    }

    if (data.role === Role.AFFILIATE) {
      payload.affiliateDetails = {
        communityBrand: data.community!,
        socialLinks: data.website_link ? [data.website_link] : [],
        howDidYouHear: data.howDidYouHear,
      };
    }

    register(payload);
  };

  return (
    <Box
      bg='white'
      p={{ base: 5, md: 7 }}
      borderRadius='lg'
      boxShadow='sm'
      width={{ base: '100%', md: 'md' }}
      maxW={{ base: '100%', md: 'md' }}
      maxH={{ base: 'none', md: '570px' }}
      overflowY='auto'
      css={{
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onFormSubmit)}>
          <VStack align='stretch' gap={4}>
            <RegistrationHeader />

            {selectedCategory === 'AGENT' && (
              <AgentTypeSelector
                selectedAgentType={selectedAgentType}
                onAgentTypeChange={handleAgentTypeSelect}
              />
            )}

            <IdentitySection finalRole={finalRole} />
            <DynamicRoleSection finalRole={finalRole} />
            <SecuritySection finalRole={finalRole} />

            <Button
              type='submit'
              bg='primary'
              width='100%'
              loading={isRegistering}
            >
              Create Account
            </Button>
          </VStack>
        </form>
      </FormProvider>
    </Box>
  );
}

export default function RegistrationForm() {
  return (
    <Suspense
      fallback={
        <Box
          bg='white'
          p={{ base: 5, md: 7 }}
          borderRadius='lg'
          boxShadow='sm'
          width={{ base: '100%', md: 'md' }}
          maxW={{ base: '100%', md: 'md' }}
          height={{ base: 'auto', md: '570px' }}
          minH={{ base: '400px', md: '570px' }}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          Loading...
        </Box>
      }
    >
      <RegistrationFormContent />
    </Suspense>
  );
}
