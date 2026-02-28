'use client';

import {
  Card,
  Badge,
  Text,
  Flex,
  Icon,
  Box,
  IconButton,
  AspectRatio,
  RatingGroup,
} from '@chakra-ui/react';
import { CheckCircleIcon, Heart } from 'lucide-react';
import { ResponsiveImage } from '../../media/ResponsiveImage';
import { AdventureDetailResponseDto } from '@zagotours/types';
import Button from '../button/Button';
import { AppLink } from '../link/AppLink';
import { usePermissions, useToggleLikeAdventure } from '@/hooks';
import { useRouter } from 'next/navigation';

const AdventureCard = ({
  adventure,
}: {
  adventure: AdventureDetailResponseDto;
}) => {
  const nights = adventure.days > 1 ? adventure.days - 1 : 0;
  const router = useRouter();
  const { mutate: toggleLike } = useToggleLikeAdventure();
  const { isAuthenticated } = usePermissions();

  const handleWhatsAppBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const phoneNumber = '447418627748';
    const message = `Hi! I'm interested in booking the "${adventure.title}" adventure for $${adventure.price}. Could you provide more details?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    toggleLike(adventure.id);
  };

  return (
    <Card.Root
      w='full'
      variant='elevated'
      overflow='hidden'
      borderRadius='3xl'
      role='group'
      transition='all 0.3s ease'
      _hover={{
        md: {
          boxShadow: '2xl',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* IMAGE SECTION WITH PADDING */}
      <Box position='relative' overflow='hidden' p='3' pb='0'>
        <AspectRatio ratio={4 / 3}>
          <ResponsiveImage
            src={adventure.mediaUrl || ''}
            alt={adventure.title}
            width='100%'
            height='100%'
            borderRadius='2xl'
            objectFit='cover'
            objectPosition='top'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 280px'
            containerProps={{
              transition: 'transform 0.5s ease',
              _groupHover: { transform: 'scale(1.08)' },
            }}
          />
        </AspectRatio>

        {/* Adjusted Badge and Heart to align with inset padding */}
        <Flex
          position='absolute'
          top='5'
          left='5'
          right='5'
          justify='flex-end'
          gap='2'
          zIndex='2'
        >
          {adventure.isVerified && (
            <Badge
              px='2'
              py='0.5'
              borderRadius='full'
              variant='solid'
              colorPalette='green'
              bg='whiteAlpha.900'
              color='green.600'
              display='flex'
              alignItems='center'
              fontSize='xs'
              mr='auto'
            >
              Verified <Icon as={CheckCircleIcon} ml='1' boxSize='3' />
            </Badge>
          )}

          <IconButton
            aria-label='Like'
            size='sm'
            variant={adventure?.isLiked ? 'solid' : 'outline'}
            onClick={handleLikeClick}
            bg='whiteAlpha.900'
            borderRadius='full'
            _hover={{ bg: 'white', transform: 'scale(1.1)' }}
          >
            <Icon
              as={Heart}
              boxSize='4'
              color={adventure?.isLiked ? 'red.500' : 'gray.400'}
              fill={adventure?.isLiked ? 'red.500' : 'none'}
            />
          </IconButton>
        </Flex>
      </Box>

      <AppLink href={`/adventures/${adventure.id}`}>
        <Card.Body p='4' pt='5' gap='0.5' position='relative'>
          {/* Rating adjusted left to 6 to align with image edge */}
          <Flex
            position='absolute'
            top='0'
            left='6'
            transform='translateY(-50%)'
            bg='white'
            px='2'
            py='1'
            borderRadius='full'
            boxShadow='md'
            alignItems='center'
            zIndex='3'
          >
            <RatingGroup.Root
              count={5}
              value={adventure.rating}
              readOnly
              allowHalf
              size='xs'
            >
              <RatingGroup.HiddenInput />
              <RatingGroup.Control
                aria-hidden='true'
                css={{ '& [data-part="item"]': { padding: '4px' } }}
              />
            </RatingGroup.Root>

            <Text fontWeight='bold' fontSize='xs' ml='1' color='gray.600'>
              {adventure.rating.toFixed(1)}
            </Text>
          </Flex>

          <Card.Title fontWeight='bold' fontSize='md' lineHeight='tight' mt='1'>
            {adventure.title}
          </Card.Title>
          <Card.Description color='gray.500' fontSize='xs' fontWeight='medium'>
            {adventure.days} Days / {nights} {nights === 1 ? 'Night' : 'Nights'}
          </Card.Description>
        </Card.Body>
      </AppLink>

      <Card.Footer pt='0'>
        <Flex
          w='full'
          justify='space-between'
          align='center'
          borderTop='1px solid'
          borderColor='gray.100'
          pt='3'
        >
          <Box>
            <Text as='span' fontSize='lg' fontWeight='bold'>
              ${adventure.price}
            </Text>
            <Text as='span' color='gray.500' fontSize='2xs' ml='1'>
              / person
            </Text>
          </Box>
          <Button
            onClick={handleWhatsAppBooking}
            bg='black'
            color='white'
            size='sm'
            px='4'
            borderRadius='xl'
            fontWeight='bold'
          >
            Book Now
          </Button>
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
};

export default AdventureCard;
