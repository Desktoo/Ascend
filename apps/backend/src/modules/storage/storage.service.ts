import { env } from '@day-mark/config';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ObjectStorageClient } from 'oci-objectstorage/lib/client';
import { Region, SimpleAuthenticationDetailsProvider } from 'oci-common';
import { v4 as uuidv4 } from 'uuid';
import 'multer';
import sharp from 'sharp';

export interface ValidUploadFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Injectable()
export class StorageService {
  private readonly client: ObjectStorageClient;
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    const privateKey = Buffer.from(env.OCI_PRIVATE_KEY, 'base64').toString(
      'utf-8',
    );

    const provider = new SimpleAuthenticationDetailsProvider(
      env.OCI_TENANCY,
      env.OCI_USER,
      env.OCI_FINGERPRINT,
      privateKey,
      null,
      Region.fromRegionId(env.OCI_REGION),
    );

    this.client = new ObjectStorageClient({
      authenticationDetailsProvider: provider,
    });
  }

  async uploadAvatar(file: ValidUploadFile): Promise<string> {
    this.validateFile(file);

    const { processedBuffer, mimetype, size, extension } =
      await this.processAvatar(file.buffer);

    const objectName = `avatars/${uuidv4()}${extension}`;

    try {
      await this.client.putObject({
        namespaceName: env.OCI_NAMESPACE,
        bucketName: env.OCI_BUCKET_NAME,
        objectName,
        putObjectBody: processedBuffer,
        contentLength: size,
        contentType: mimetype,
      });

      return `https://objectstorage.${env.OCI_REGION}.oraclecloud.com/n/${env.OCI_NAMESPACE}/b/${env.OCI_BUCKET_NAME}/o/${encodeURIComponent(objectName)}`;
    } catch (error) {
      this.logger.error('OCI Upload failed', error);
      throw new InternalServerErrorException('Avatar upload failed');
    }
  }

  async updateAvatar(
    file: ValidUploadFile,
    oldFileUrl?: string,
  ): Promise<string> {
    // 1. Upload the new file and generate the new URL
    const newAvatarUrl = await this.uploadAvatar(file);

    // 2. If an old URL was provided, attempt to delete the old object to prevent storage bloat
    if (oldFileUrl) {
      try {
        // Extract the objectName from the standard OCI Object Storage URL
        const urlParts = oldFileUrl.split('/o/');
        if (urlParts.length === 2) {
          const oldObjectName = decodeURIComponent(urlParts[1]);

          await this.client.deleteObject({
            namespaceName: env.OCI_NAMESPACE,
            bucketName: env.OCI_BUCKET_NAME,
            objectName: oldObjectName,
          });

          this.logger.log(`Successfully deleted old avatar: ${oldObjectName}`);
        }
      } catch (error) {
        // We don't throw an error here because the new upload was successful.
        // It's just a cleanup task that failed (e.g. file already deleted or not found).
        this.logger.warn(`Failed to delete old avatar at ${oldFileUrl}`, error);
      }
    }

    return newAvatarUrl;
  }

  private validateFile(file: ValidUploadFile) {
    if (!file || !file.buffer) {
      throw new BadRequestException('File is required');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        'File size exceeds the maximum allowed size.',
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('File type is not allowed.');
    }
  }

  private async processAvatar(buffer: Buffer): Promise<{
    processedBuffer: Buffer;
    mimetype: string;
    size: number;
    extension: string;
  }> {
    try {
      const processedBuffer = await sharp(buffer)
        .resize(256, 256, {
          fit: 'cover', // Crops perfectly from the center without stretching
          position: 'center',
        })
        .webp({ quality: 80 }) // Compress to WebP at 80% quality
        .toBuffer();

      return {
        processedBuffer,
        mimetype: 'image/webp',
        extension: '.webp',
        size: processedBuffer.length,
      };
    } catch (error) {
      this.logger.error('Image processing failed via sharp', error);
      throw new InternalServerErrorException('Failed to process image');
    }
  }
}
