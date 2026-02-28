import { MediaType } from '../enums';

export interface PlatformGalleryDto {
  id: string;
  title?: string | null;
  mediaUrl: string;
  publicId?: string | null;
  mediaType: MediaType;
  category?: string | null;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CreateGalleryDto {
  title?: string;
  mediaUrl: string;
  publicId?: string;
  mediaType?: MediaType;
  category?: string;
  featured?: boolean;
  order?: number;
}

export interface UpdateGalleryDto extends Partial<CreateGalleryDto> {}

export interface GalleryQueryDto {
  category?: string;
  featured?: string;
  page?: string;
  limit?: string;
}
