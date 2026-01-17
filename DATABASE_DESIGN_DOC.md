# Database Design Document: Creator Asset AI

## 1. Overview
The database for Creator Asset AI is designed to handle high volumes of metadata, versioning, and semantic search capabilities. It uses a relational structure (PostgreSQL) with extensions for vector storage to support AI-driven retrieval.

## 2. Key Design Decisions
*   **PostgreSQL with pgvector:** Chosen to store high-dimensional vectors (e.g., CLIP embeddings) alongside traditional metadata, allowing for seamless semantic and keyword searching.
*   **JSONB for Format-Specific Metadata:** Since a `.psd` has different metadata than an `.mp4` or a `.wav`, we use JSONB to store technical specs without a rigid schema.
*   **Recursive Relationships:** To handle "derived" assets (e.g., a JPEG exported from a specific layer of a PSD).
*   **Soft Deletes:** Essential for creators who might accidentally delete "final_v2" and need immediate recovery.

## 3. Entity-Relationship Summary
- **Workspaces:** Multi-tenant isolation for freelancers or small agencies.
- **Assets & Versions:** The core entities. Assets represent the "conceptual" file, while Versions represent the physical binary states over time.
- **Tags & AI-Labels:** Differentiates between user-added tags and AI-suggested classifications.
- **Embeddings:** Vector representations for similarity search.