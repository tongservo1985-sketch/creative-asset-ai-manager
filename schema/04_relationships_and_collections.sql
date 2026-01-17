-- Folders or Projects
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES collections(id), -- Nested collections
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-Many relationship between Assets and Collections
CREATE TABLE collection_assets (
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (collection_id, asset_id)
);

-- Asset Relationships (Lineage)
-- Tracks how "final_v1.jpg" was derived from "master.psd"
CREATE TABLE asset_lineage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    child_asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL, -- 'derivative', 'component', 'duplicate'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);