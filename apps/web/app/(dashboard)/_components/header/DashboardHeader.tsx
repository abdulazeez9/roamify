'use client';

import Button from '@/components/ui/button/Button';
import { Box, Heading, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PlanningCallDialog } from '../dialogs/PlanningCallDialog';
import { usePermissions } from '@/hooks';

export default function DashboardHeader() {
  const [isPlanningCallDialogOpen, setIsPlanningCallDialogOpen] =
    useState(false);
  const { isAnyAdmin } = usePermissions();
  return (
    <>
      <Box
        bg='primary'
        display='flex'
        justifyContent='center'
        alignItems='center'
        borderRadius={{ base: 'none', md: '3xl' }}
        p={16}
        maxH={{ base: '200px', md: '300px' }}
        mb={10}
        position='relative'
        overflow='hidden'
      >
        {/* Left side triangles */}
        <Box
          position='absolute'
          left={0}
          top={0}
          bottom={0}
          width='150px'
          pointerEvents='none'
        >
          <svg width='100%' height='100%' style={{ position: 'absolute' }}>
            <polygon points='20,30 35,60 5,55' fill='#FDB71A' opacity='0.3' />
            <polygon
              points='40,80 55,105 30,100'
              fill='#FFD966'
              opacity='0.4'
            />
            <polygon
              points='10,120 28,145 8,150'
              fill='#FDB71A'
              opacity='0.25'
            />
            <polygon
              points='45,160 60,180 35,185'
              fill='#FFCC33'
              opacity='0.35'
            />
            <polygon
              points='15,200 30,225 10,220'
              fill='#FFD966'
              opacity='0.3'
            />
            <polygon points='50,45 65,65 40,70' fill='#FFCC33' opacity='0.4' />
          </svg>
        </Box>

        {/* Right side triangles */}
        <Box
          position='absolute'
          right={0}
          top={0}
          bottom={0}
          width='150px'
          pointerEvents='none'
        >
          <svg width='100%' height='100%' style={{ position: 'absolute' }}>
            <polygon
              points='130,40 145,65 120,70'
              fill='#FDB71A'
              opacity='0.35'
            />
            <polygon
              points='110,90 125,110 100,115'
              fill='#FFD966'
              opacity='0.3'
            />
            <polygon
              points='140,130 150,155 130,150'
              fill='#FFCC33'
              opacity='0.4'
            />
            <polygon
              points='105,170 120,190 95,195'
              fill='#FDB71A'
              opacity='0.25'
            />
            <polygon
              points='135,210 145,230 125,235'
              fill='#FFD966'
              opacity='0.35'
            />
            <polygon
              points='115,50 130,70 105,75'
              fill='#FFCC33'
              opacity='0.3'
            />
          </svg>
        </Box>

        <VStack gap={9} position='relative' zIndex={1}>
          <Heading
            fontWeight='bolder'
            color='white'
            fontSize={{ base: '2xl', md: '3xl' }}
            letterSpacing='wider'
          >
            Dashboard
          </Heading>
          {!isAnyAdmin && (
            <Button
              bg='white'
              color='primary'
              onClick={() => setIsPlanningCallDialogOpen(true)}
            >
              Book your trip planning call
            </Button>
          )}
        </VStack>
      </Box>

      <PlanningCallDialog
        open={isPlanningCallDialogOpen}
        onOpenChange={(e) => setIsPlanningCallDialogOpen(e.open)}
      />
    </>
  );
}
