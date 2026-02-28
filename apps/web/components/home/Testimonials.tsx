'use client';

import {
  Carousel,
  IconButton,
  Container,
  Heading,
  Text,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import { TestimonialCard } from '../ui/card/TestimonialCard';
import { useReviews } from '@/hooks';

const staticTestimonials = [
  {
    qoute:
      " Nunca deja de ser increíble' es una frase que dije una y otra vez! Este fue un viaje místico increíble con impresionantes vistas inspiradoras",
    author: 'Atend John',
    rating: 5,
  },
  {
    qoute:
      "5 stars isn't even enough. It's an incredible experience. We have been traveling for almost 13 months now and it's one of our highlights",
    author: 'Sara Mohamed',
    rating: 5,
  },
  {
    qoute:
      'Had a fabulous experience from start to finish with Moses and his team. Excellent communication, tailored options, and a great experience provided on ground. Support local operators!',
    author: 'Joe Atla',
    rating: 5,
  },
  {
    qoute:
      "As a first time and second time rafting couple, we were amazed about how serious they take safety measures. They explain you how to react and what to do. We always felt safe, even with the rough river conditions. Two times we needed to walk because the water level was just too high. We didn't mind at all, because safety first. Halfway you enjoy your lunch together with the crew. They prepare it themselves. It was very nice. And the fruits oh my oh my so sweet!",
    author: 'San Martins',
    rating: 5,
  },
];

export function Testimonials() {
  const slidesPerPage = useBreakpointValue({ base: 1, md: 3 }) ?? 1;
  const { data: reviewsResponse } = useReviews();

  const apiReviews = (reviewsResponse?.data || []).map((review: any) => ({
    qoute: review.content,
    author: review.user?.name || 'Anonymous',
    rating: review.rating,
  }));

  // Combine static testimonials with API reviews
  const allTestimonials = [...staticTestimonials, ...apiReviews];

  return (
    <Container bg='surface' width='100%' py={{ base: 5, md: 10 }} mt={6}>
      <Stack mb={10}>
        <Heading
          size={{ base: '2xl', md: '4xl' }}
          lineHeight='1.2'
          color='primary'
          fontWeight='bolder'
        >
          They Love Zago
        </Heading>
        <Text>What travelers are saying about our partners</Text>
      </Stack>
      <Carousel.Root
        slideCount={allTestimonials.length}
        gap='6'
        allowMouseDrag
        slidesPerPage={slidesPerPage}
        position='relative'
      >
        <Carousel.Control mb={4} justifyContent='flex-end' gap='3'>
          <Carousel.PrevTrigger asChild>
            <IconButton
              variant='subtle'
              borderRadius='full'
              aria-label='Previous slide'
              _hover={{ bg: 'green.50', color: 'green.600' }}
            >
              <LuArrowLeft />
            </IconButton>
          </Carousel.PrevTrigger>
          <Carousel.NextTrigger asChild>
            <IconButton
              variant='subtle'
              borderRadius='full'
              aria-label='Next slide'
              _hover={{ bg: 'green.50', color: 'green.600' }}
            >
              <LuArrowRight />
            </IconButton>
          </Carousel.NextTrigger>
        </Carousel.Control>

        <Carousel.ItemGroup>
          {allTestimonials.map((item, index) => (
            <Carousel.Item key={index} index={index}>
              <TestimonialCard
                quote={item.qoute}
                author={item.author}
                rating={item.rating}
              />
            </Carousel.Item>
          ))}
        </Carousel.ItemGroup>
      </Carousel.Root>
    </Container>
  );
}
