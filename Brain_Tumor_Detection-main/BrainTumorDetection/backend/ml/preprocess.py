import cv2
import numpy as np
import logging

# Production-grade logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Standardized production resolution
IMG_SIZE = (300, 300)

class MedicalEnchanter:
    """
    Utility class for MRI image enhancement.
    Uses CLAHE (Contrast Limited Adaptive Histogram Equalization)
    to bring out tumor details.
    """
    def __init__(self, clip_limit=3.0, tile_grid_size=(8, 8)):
        self.clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)

    def enhance(self, img):
        """Enhances contrast while maintaining structure."""
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img
        
        enhanced = self.clahe.apply(gray)
        return cv2.cvtColor(enhanced, cv2.COLOR_GRAY2RGB)

def load_and_preprocess_image(image_path, target_size=IMG_SIZE):
    """
    Production utility for loading and enhancing a single image.
    Used by the FastAPI inference backend.
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return None
        
        # 1. Enhance
        enchanter = MedicalEnchanter()
        img = enchanter.enhance(img)
        
        # 2. Resize
        img = cv2.resize(img, target_size)
        
        # 3. Scale [0, 1]
        img = img / 255.0
        return img.astype(np.float32)
        
    except Exception as e:
        logger.error(f"Error in preprocessing for {image_path}: {e}")
        return None
