import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export class StorageService {
  /**
   * Generates a pre-signed URL for direct-to-S3 upload.
   * This reduces server load by bypassing the backend for large binary data.
   */
  static async generatePresignedUrl(filename: string, mimeType: string) {
    const fileExtension = filename.split('.').pop();
    const s3Key = `uploads/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      ContentType: mimeType,
    });

    // URL expires in 15 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    return {
      uploadUrl,
      s3Key,
    };
  }
}