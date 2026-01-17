-- Taxonomy for organization
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id),
    name VARCHAR(100) NOT NULL,
    color_code VARCHAR(7),
    UNIQUE(workspace_id, name)
);

-- Join table for Tags and Assets (AI and Manual)
CREATE TABLE asset_tags (
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    confidence_score FLOAT DEFAULT 1.0, -- 1.0 for manual, < 1.0 for AI generated
    is_ai_generated BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (asset_id, tag_id)
);

-- Vector Embeddings for Semantic Search (using CLIP model outputs)
-- Standard CLIP-ViT-B/32 generates 512 dimensions
CREATE TABLE asset_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    version_id UUID REFERENCES asset_versions(id) ON DELETE CASCADE,
    embedding vector(512), -- Dimension size matches the AI model
    model_version VARCHAR(50), -- To track which AI model generated this
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create HNSW index for fast similarity search
CREATE INDEX ON asset_embeddings USING hnsw (embedding vector_cosine_ops);