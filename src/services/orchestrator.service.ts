import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Define the queue for asset processing
export const mediaProcessingQueue = new Queue("media-processing", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

export class OrchestratorService {
  /**
   * Dispatches a sequence of AI processing tasks.
   * Following the "Event-Driven" philosophy from ARCHITECTURE_OVERVIEW.md.
   */
  static async queueAssetProcessing(assetId: string, s3Key: string) {
    await mediaProcessingQueue.add("process-asset", {
      assetId,
      s3Key,
      tasks: [
        "GENERATE_THUMBNAIL",
        "CLIP_VECTOR_EMBEDDING",
        "OBJECT_DETECTION",
        "AUTO_TAGGING"
      ],
    });
  }
}