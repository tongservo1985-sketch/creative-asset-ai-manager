# System Architecture: High-Volume Media Processing Engine

## 1. Architectural Philosophy
To handle the "Great Migration" (bulk ingestion of 50GB+ folders), we utilize an **Event-Driven Microservices Architecture**. This ensures the system remains responsive even when thousands of files are being processed simultaneously.

## 2. Core Components
*   **Ingestion Gateway:** Handles multi-part uploads and generates pre-signed URLs for direct-to-S3 uploads to reduce server load.
*   **Message Broker (Redis/RabbitMQ):** Decouples upload completion from AI processing.
*   **Orchestration Layer (Temporal/Step Functions):** Manages the sequence of processing (e.g., Thumbnail -> Vector Embedding -> Auto-tagging).
*   **Processing Workers:** Specialized containers for:
    *   *Visual Worker:* Uses Vision Transformers (ViT) for image tagging.
    *   *Audio Worker:* Whisper/FFMPEG for transcription and waveform.
    *   *Vector Worker:* Generates embeddings for semantic search.
*   **Data Lake & Vector Store:** 
    *   **S3:** Raw and processed assets.
    *   **PostgreSQL (pgvector):** Metadata and relational data.
    *   **Pinecone/Milvus:** High-speed semantic similarity search.

## 3. Data Flow
1. **Client** requests upload -> **API** returns Pre-signed URL.
2. **Client** uploads directly to **S3**.
3. **S3 Event Notification** triggers a **Lambda/Webhook** to queue a `MEDIA_READY` message.
4. **Task Orchestrator** picks up the message and starts a workflow.
5. **Workers** process the file in parallel, updating the **Database** and **Vector Store**.
6. **Websockets** notify the client of progress.