import { User } from './user.types';

export interface Review {
  id: string;
  title: string | null;
  content: string;
  rating: number;
  isFeatured: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithUser extends Review {
  user: Omit<User, 'password' | 'resetPasswordToken' | 'resetPasswordExpires'>;
}
