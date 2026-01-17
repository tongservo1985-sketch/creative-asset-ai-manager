import { Worker } from "bullmq";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

/**
 * This worker processes the AI pipeline. 
 * In a production environment, this would call specialized 
 * Microservices or Python/ML containers for CLIP and YOLOv8.
 */
const worker = new Worker(
  "media-processing",
  async (job) => {
    const { assetId, s3Key, tasks } = job.data;
    console.log(`Processing Asset: ${assetId} for tasks: ${tasks.join(", ")}`);

    try {
      // 1. Simulate CLIP Embedding Generation
      // In reality: await axios.post(AI_SERVICE_URL/embed, { s3Key })
      const mockVector = new Array(512).fill(0).map(() => Math.random());
      
      // Store vector embedding using raw SQL (Prisma doesn't support pgvector natively yet)
      await prisma.$executeRawUnsafe(
        `INSERT INTO "VectorEmbedding" ("assetId", "embedding") 
         VALUES ($1, $2::vector) 
         ON CONFLICT ("assetId") DO UPDATE SET "embedding" = $2::vector`,
        assetId,
        `[${mockVector.join(",")}]`
      );

      // 2. Simulate Auto-Tagging
      const tags = ["minimalist", "design", "workflow"];
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });

        await prisma.assetTag.upsert({
          where: { assetId_tagId: { assetId, tagId: tag.id } },
          update: {},
          create: { assetId, tagId: tag.id },
        });
      }

      // 3. Mark Asset as Completed
      await prisma.asset.update({
        where: { id: assetId },
        data: { status: "COMPLETED" },
      });

    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      await prisma.asset.update({
        where: { id: assetId },
        data: { status: "FAILED" },
      });
      throw error;
    }
  },
  { connection }
);

console.log("Media Processing Worker is online.");