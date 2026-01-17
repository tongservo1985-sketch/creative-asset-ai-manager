# Infrastructure Deployment Guide: Creator Asset AI

## 1. Design Philosophy
This infrastructure is built to support the **"Zero-Effort Ingestion"** pillar. By offloading file processing to an event-driven SQS queue triggered directly by S3, the API remains lightweight and responsive.

## 2. Storage Strategy & Lifecycle Rules
*   **Default Tier:** `S3 Intelligent-Tiering`. This is essential for creative workflows where assets are frequently accessed during the "Project Active" phase and rarely accessed after delivery.
*   **Archival Tier:** Assets moved to `GLACIER_IR` (Instant Retrieval) after 90 days if stored in the `/archives` directory. This ensures creators never "lose" a file, but the cost of the "Second Brain" remains sustainable.
*   **Multipart Cleanup:** Incomplete uploads are purged after 7 days, preventing hidden costs from failed 50GB+ migration attempts.

## 3. Deployment Instructions
1.  Initialize Terraform: `terraform init`
2.  Review Execution Plan: `terraform plan`
3.  Deploy: `terraform apply`

## 4. Post-Deployment
Once the S3 bucket and SQS queue are active, the **Processing Workers** (defined in the Architecture Overview) should be configured to poll the `${aws_sqs_queue.ingestion_queue.url}` for new object events.