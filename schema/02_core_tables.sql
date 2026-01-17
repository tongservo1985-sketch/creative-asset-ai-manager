-- Workspaces for multi-tenancy
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    settings JSONB DEFAULT '{}'
);

-- Assets represent the logical object (e.g., "Client Brand Logo")
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    display_name VARCHAR(512) NOT NULL,
    current_version_id UUID, -- Circular ref handled after version table
    category VARCHAR(50), -- e.g., 'image', 'video', 'document', 'audio'
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Asset Versions represent the physical files and their history
CREATE TABLE asset_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    s3_key TEXT NOT NULL, -- Path to the file in storage
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    checksum TEXT, -- For integrity/duplicate detection
    technical_metadata JSONB, -- EXIF, bitrate, resolution, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID
);

-- Add foreign key constraint to assets for the current version
ALTER TABLE assets 
ADD CONSTRAINT fk_current_version 
FOREIGN KEY (current_version_id) REFERENCES asset_versions(id) ON DELETE SET NULL;