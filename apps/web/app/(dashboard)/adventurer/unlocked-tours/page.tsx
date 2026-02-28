'use client';

import { AppLink } from '@/components/ui/link/AppLink';
import {
  Box,
  Button,
  Grid,
  Heading,
  Card,
  Icon,
  Image,
} from '@chakra-ui/react';
import React from 'react';
import { Play } from 'lucide-react';

const videos = [
  {
    name: 'Tarangire National Park: Wildlife Watching',
    url: 'https://youtube.com/shorts/k4Wrre-s--I',
  },
  {
    name: 'Hot Air Balloon Safari (South Africa)',
    url: 'https://youtu.be/lWtPeN8NYNQ',
  },
  { name: 'Masai Mara (Kenya)', url: 'https://youtu.be/h6Xd_tsqt50' },
  {
    name: 'Inca Trail Trek (Peru)',
    url: 'https://youtube.com/shorts/Jmq5TNyGDjI',
  },
  {
    name: 'Island Hopping (Philippines)',
    url: 'https://youtube.com/shorts/MPBg_hmeCSg',
  },
  {
    name: 'White Water Rafting (Uganda)',
    url: 'https://youtube.com/shorts/To6gLWHcwMA',
  },
  {
    name: 'Game Driving and Viewing (South Africa):',
    url: 'https://youtu.be/b1bDfj8LvZ8',
  },
  {
    name: 'Mountain Trekking (Tanzania)',
    url: 'https://youtube.com/shorts/kNn6lu1MiNg',
  },
  {
    name: 'Paragliding in South Africa',
    url: 'https://youtube.com/shorts/ZZmOg4Gx-jk',
  },
];

/**
 * Extracts the YouTube Video ID from various URL formats
 * (Shorts, youtu.be, or standard watch URLs)
 */
const getYouTubeId = (url: string) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[8]?.length === 11 ? match[8] : null;
};

export default function UnlockedTours() {
  return (
    <Box p={8}>
      <Heading mb={6}>Unlocked Tours</Heading>

      <Grid
        gridTemplateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={6}
      >
        {videos.map((video, index) => {
          const videoId = getYouTubeId(video.url);
          // hqdefault.jpg is high quality, maxresdefault.jpg is highest (if available)
          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

          return (
            <Card.Root
              key={index}
              boxShadow='md'
              borderRadius='lg'
              overflow='hidden'
            >
              <Card.Body p={0}>
                <Box
                  position='relative'
                  height='200px'
                  bg='black'
                  overflow='hidden'
                  role='group'
                >
                  {/* The Thumbnail Image */}
                  <Image
                    src={thumbnailUrl}
                    alt={video.name}
                    width='100%'
                    height='100%'
                    objectFit='cover'
                    transition='transform 0.3s ease'
                    _groupHover={{ transform: 'scale(1.05)' }}
                  />

                  {/* Play button overlay */}
                  <Box
                    position='absolute'
                    top='50%'
                    left='50%'
                    transform='translate(-50%, -50%)'
                    transition='all 0.2s ease'
                    _groupHover={{
                      transform: 'translate(-50%, -50%) scale(1.1)',
                    }}
                  >
                    <Box
                      bg='rgba(0, 0, 0, 0.7)'
                      borderRadius='full'
                      p={4}
                      display='flex'
                      backdropBlur='sm'
                    >
                      <Icon as={Play} boxSize={8} color='white' fill='white' />
                    </Box>
                  </Box>
                </Box>

                <Box p={4}>
                  <Heading size='md' lineClamp={1}>
                    {video.name}
                  </Heading>
                </Box>
              </Card.Body>

              <Card.Footer p={4} pt={0}>
                <AppLink
                  href={video.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  width='100%'
                >
                  <Button colorPalette='teal' width='100%'>
                    Watch Full Video
                  </Button>
                </AppLink>
              </Card.Footer>
            </Card.Root>
          );
        })}
      </Grid>
    </Box>
  );
}
