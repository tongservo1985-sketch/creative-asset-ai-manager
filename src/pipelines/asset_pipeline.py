import logging
from src.vision.processor import VisionProcessor
from src.vision.color_analyzer import ColorAnalyzer

# Simulated candidate labels for Creative Assets
CREATIVE_VOCABULARY = [
    "minimalist", "vibrant", "dark aesthetic", "corporate", 
    "hand-drawn", "3D render", "nature", "urban", "typography",
    "flat design", "textured", "abstract", "portrait"
]

class AssetAnalysisPipeline:
    def __init__(self):
        self.vision = VisionProcessor()
        self.color = ColorAnalyzer()
        logging.basicConfig(level=logging.INFO)

    def process_asset(self, asset_id, file_path):
        """
        The main pipeline entry point for a single file.
        """
        logging.info(f"Processing Asset: {asset_id}")

        # 1. Generate Vector Embedding for Visual Search
        embedding = self.vision.generate_embedding(file_path)

        # 2. Perform Auto-Tagging (Zero-Shot)
        tags_raw = self.vision.get_top_tags(file_path, CREATIVE_VOCABULARY)
        # Filter tags with > 20% confidence
        tags = [tag for tag, score in tags_raw if score > 0.2]

        # 3. Analyze Color Palette
        palette = self.color.extract_palette(file_path)

        # 4. Construct Metadata Object
        metadata = {
            "asset_id": asset_id,
            "vector": embedding,
            "tags": tags,
            "palette": palette,
            "processed_status": "completed"
        }

        logging.info(f"Analysis Complete for {asset_id}. Tags found: {tags}")
        return metadata

# Example Usage:
# pipeline = AssetAnalysisPipeline()
# result = pipeline.process_asset("asset_101", "uploads/client_work_v1.jpg")