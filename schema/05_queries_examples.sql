-- Example 1: Semantic Search using Vector Similarity
-- Finds assets similar to a search query's embedding
/*
SELECT a.display_name, av.s3_key, (ae.embedding <=> '[0.12, 0.05, ...]') as distance
FROM assets a
JOIN asset_embeddings ae ON a.id = ae.asset_id
JOIN asset_versions av ON a.current_version_id = av.id
ORDER BY distance ASC
LIMIT 20;
*/

-- Example 2: Find all AI-suggested tags for a specific asset
/*
SELECT t.name, at.confidence_score
FROM tags t
JOIN asset_tags at ON t.id = at.tag_id
WHERE at.asset_id = 'uuid-here' AND at.is_ai_generated = TRUE;
*/

-- Example 3: Version History for a file
/*
SELECT version_number, s3_key, created_at
FROM asset_versions
WHERE asset_id = 'uuid-here'
ORDER BY version_number DESC;
*/