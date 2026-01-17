import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { StorageService } from "../services/storage.service";
import { OrchestratorService } from "../services/orchestrator.service";

const router = Router();
const prisma = new PrismaClient();

/**
 * Step 1: Request an upload. 
 * Returns a pre-signed URL and creates a 'PENDING' asset record.
 */
router.post("/upload/init", async (req, res) => {
  try {
    const { filename, mimeType, fileSize, userId } = req.body;

    const { uploadUrl, s3Key } = await StorageService.generatePresignedUrl(filename, mimeType);

    const asset = await prisma.asset.create({
      data: {
        filename,
        originalName: filename,
        s3Key,
        mimeType,
        fileSize,
        userId,
        status: "PENDING",
      },
    });

    res.json({
      assetId: asset.id,
      uploadUrl,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize upload" });
  }
});

/**
 * Step 2: Notify the server that upload is complete.
 * Triggers the AI Orchestration pipeline.
 */
router.post("/upload/complete", async (req, res) => {
  const { assetId } = req.body;

  try {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });

    if (!asset) return res.status(404).json({ error: "Asset not found" });

    // Update status and hand off to AI pipeline
    await prisma.asset.update({
      where: { id: assetId },
      data: { status: "PROCESSING" },
    });

    await OrchestratorService.queueAssetProcessing(asset.id, asset.s3Key);

    res.json({ message: "Processing started", assetId });
  } catch (error) {
    res.status(500).json({ error: "Failed to trigger processing" });
  }
});

export default router;