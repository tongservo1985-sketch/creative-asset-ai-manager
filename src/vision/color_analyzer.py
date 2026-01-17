import cv2
import numpy as np
from sklearn.cluster import KMeans

class ColorAnalyzer:
    """
    Extracts dominant color palettes to enable "Search by Color".
    """
    def extract_palette(self, image_path, k=5):
        image = cv2.imread(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Resize to speed up processing
        image = cv2.resize(image, (100, 100), interpolation=cv2.INTER_AREA)
        pixels = image.reshape(-1, 3)
        
        # Use KMeans to find dominant clusters
        kmeans = KMeans(n_clusters=k, n_init=10)
        kmeans.fit(pixels)
        
        colors = kmeans.cluster_centers_.astype(int)
        
        # Convert to Hex for easy UI rendering
        return [self._rgb_to_hex(color) for color in colors]

    def _rgb_to_hex(self, rgb):
        return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])