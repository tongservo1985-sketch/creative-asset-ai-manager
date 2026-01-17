import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

/**
 * Generates a short-lived signed URL for asset retrieval.
 * This prevents Intellectual Property from being leaked via permanent links.
 */
export async function getSecureAssetUrl(s3Key: string, expiresIn: number = 900): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_ASSET_BUCKET,
    Key: s3Key,
  });

  // URL expires in 15 minutes (900 seconds) by default
  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL", error);
    throw new Error("Could not generate secure access link.");
  }
}