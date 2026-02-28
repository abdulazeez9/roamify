import { Avatar } from '@chakra-ui/react';
import { useMemo } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarImageProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  id?: string;
  alt?: string;
}

export const AvatarImage = ({
  src,
  name,
  size = 'md',
  id,
  alt,
}: AvatarImageProps) => {
  const stableId = useMemo(() => {
    if (id) return id;
    return `avatar-${name?.toLowerCase().replace(/\s+/g, '-')}`;
  }, [id, name]);

  return (
    <Avatar.Root size={size} id={stableId}>
      <Avatar.Fallback name={name} />
      {src && <Avatar.Image src={src} alt={alt ?? name} />}{' '}
    </Avatar.Root>
  );
};
