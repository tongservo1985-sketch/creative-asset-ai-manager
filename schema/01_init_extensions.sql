-- Enable pgvector for semantic search capabilities
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Purpose: This file initializes the required PostgreSQL extensions 
-- for UUID generation and Vector similarity search (CLIP embeddings).