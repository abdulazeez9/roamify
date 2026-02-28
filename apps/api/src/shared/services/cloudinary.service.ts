import cloudinary from 'src/config/cloudinary.config';
import { MediaType } from '@zagotours/database';

export interface UploadResult {
  url: string;
  publicId: string;
  mediaType: MediaType;
}

export type UploadContext =
  | 'adventure'
  | 'itinerary'
  | 'adventure-gallery'
  | 'platform-gallery'
  | 'platform-setting'
  | 'post'
  | 'profile'
  | 'contract'
  | 'event';

export class CloudinaryService {
  private static getFolderName(context: UploadContext): string {
    return `zagotours/${context}`;
  }

  static async uploadFile(
    file: Express.Multer.File,
    context: UploadContext,
    customId?: string,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.getFolderName(context),
          public_id: customId,
          invalidate: true,
          resource_type: 'auto',
          transformation: file.mimetype.startsWith('image/')
            ? [{ quality: 'auto:good', fetch_format: 'auto' }]
            : undefined,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            mediaType: this.getMediaType(file.mimetype),
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  static async uploadMultiple(
    files: Express.Multer.File[],
    context: UploadContext,
  ): Promise<UploadResult[]> {
    return Promise.all(files.map((file) => this.uploadFile(file, context)));
  }

  static async deleteFile(publicId: string): Promise<void> {
    if (!publicId) return;

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete from Cloudinary:', publicId, error);
      // Don't throw - deletion failures shouldn't break the app
    }
  }

  static getMediaType(mimetype: string): MediaType {
    if (mimetype.startsWith('image/')) return 'IMAGE';
    if (mimetype.startsWith('video/')) return 'VIDEO';
    return 'DOCUMENT';
  }
}
