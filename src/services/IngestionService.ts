import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Queue } from "bullmq";

/**
 * IngestionService handles the initial handshake for large file uploads.
 * It provides pre-signed URLs to allow creators to upload directly to S3,
 * bypassing the application server for maximum throughput.
 */
export class IngestionService {
  private s3: S3Client;
  private uploadQueue: Queue;

  constructor() {
    this.s3 = new S3Client({ region: process.env.AWS_REGION });
    this.uploadQueue = new Queue('media-processing', {
      connection: { host: 'redis', port: 6379 }
    });
  }

  async generateUploadUrl(userId: string, fileName: string, fileType: string) {
    const assetId = crypto.randomUUID();
    const s3Key = `raw/${userId}/${assetId}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.ASSET_BUCKET,
      Key: s3Key,
      ContentType: fileType,
      Metadata: {
        "user-id": userId,
        "original-name": fileName
      }
    });

    // URL valid for 60 minutes for large uploads
    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    return {
      assetId,
      uploadUrl: signedUrl,
      s3Key
    };
  }

  // Called via S3 Event Bridge or Webhook after upload completion
  async notifyUploadComplete(assetMetadata: any) {
    await this.uploadQueue.add('process-new-asset', assetMetadata, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 }
    });
  }
}