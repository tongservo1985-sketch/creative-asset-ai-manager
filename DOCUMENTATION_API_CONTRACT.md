# API Contract: Computer Vision Metadata

The output of the `AssetAnalysisPipeline` is sent to the Orchestration Layer to be stored in the primary database and the Vector Index.

## Metadata Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| `asset_id` | String (UUID) | Unique identifier for the asset. |
| `vector` | Array(Float) | 512-dimension embedding for visual similarity. |
| `tags` | Array(String) | AI-generated semantic labels. |
| `palette` | Array(String) | Dominant Hex color codes. |
| `processed_status` | String | Status of the CV worker pipeline. |

## Search Capabilities Enabled
1.  **Similarity Search:** Find assets visually similar to a selected file using Cosine Similarity on the `vector` field.
2.  **Semantic Search:** Search for "vibrant minimalist designs" even if those words aren't in the filename.
3.  **Color Filtering:** Filter the library by assets containing specific brand colors (e.g., `#FF5733`).