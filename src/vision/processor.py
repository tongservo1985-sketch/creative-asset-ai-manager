import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import numpy as np

class VisionProcessor:
    """
    Core engine for extracting embeddings and classifying assets using CLIP.
    """
    def __init__(self, model_name="openai/clip-vit-base-patch32"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = CLIPModel.from_pretrained(model_name).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_name)
        
    def generate_embedding(self, image_path):
        """
        Generates a 512-dimension vector for visual similarity search.
        """
        image = Image.open(image_path).convert("RGB")
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            image_features = self.model.get_image_features(**inputs)
        
        # Normalize the embedding for cosine similarity
        embedding = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
        return embedding.cpu().numpy().flatten().tolist()

    def get_top_tags(self, image_path, candidate_labels):
        """
        Zero-shot classification to tag images based on a list of creative concepts.
        """
        image = Image.open(image_path).convert("RGB")
        inputs = self.processor(
            text=candidate_labels, 
            images=image, 
            return_tensors="pt", 
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)

        # Map probabilities to labels
        results = zip(candidate_labels, probs[0].cpu().numpy())
        return sorted(results, key=lambda x: x[1], reverse=True)