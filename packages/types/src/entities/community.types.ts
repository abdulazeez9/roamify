import { MediaType } from '../enums';
import { User } from './user.types';

export interface Post {
  id: string;
  userId: string;
  title: string;
  description: string;
  mediaUrl: string | null;
  publicId: string | null;
  mediaType: MediaType;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface PostWithRelations extends Post {
  user?: Omit<User, 'password' | 'resetPasswordToken' | 'resetPasswordExpires'>;
  comments?: Comment[];
  likes?: Like[];
  shares?: Share[];
  _count?: {
    comments: number;
    likes: number;
    shares: number;
  };
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface CommentWithUser extends Comment {
  user: Omit<User, 'password' | 'resetPasswordToken' | 'resetPasswordExpires'>;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
}

export interface Share {
  id: string;
  postId: string;
  userId: string;
}
