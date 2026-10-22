import os
import cv2
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.applications.efficientnet import preprocess_input

# --------------------
# Configuration
# --------------------
# Note: Models load karte waqt hum compile=False use karenge
# kyunki humein sirf prediction karni hai, training nahi.
CLASS_MODEL_PATH = "models/classification_model_v2.h5"
SEG_MODEL_PATH = "models/segmentation_unet.h5"

# Image Sizes (Must match training exactly)
CLS_IMG_SIZE = 224  # EfficientNetB0
SEG_IMG_SIZE = 256  # U-Net

# ⚠️ IMPORTANT: Update these based on your training folder names!
# Alphabetical order mein folder names check karo 'data/classification/train' mein
CLASS_LABELS = {
    0: 'Glioma', 
    1: 'Meningioma', 
    2: 'No Tumor', 
    3: 'Pituitary'
}

# --------------------
# Load Models
# --------------------
print("⏳ Loading Classification Model...")
class_model = tf.keras.models.load_model(CLASS_MODEL_PATH, compile=False)

print("⏳ Loading Segmentation Model...")
seg_model = tf.keras.models.load_model(SEG_MODEL_PATH, compile=False)

print("✅ Models Loaded Successfully!")

# --------------------
# Helper Functions
# --------------------
def preprocess_for_classification(img):
    """Preprocessing that matches training: resize + EfficientNet preprocess."""
    img = cv2.resize(img, (CLS_IMG_SIZE, CLS_IMG_SIZE))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img.astype(np.float32)
    img = preprocess_input(img)   # Scales to [-1, 1] matching training
    return np.expand_dims(img, axis=0)


def preprocess_for_segmentation(img):
    """Resizes and normalizes image for U-Net"""
    img = cv2.resize(img, (SEG_IMG_SIZE, SEG_IMG_SIZE))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def overlay_mask(image, mask, color=(0, 255, 0), alpha=0.5):
    """Draws the segmentation mask on top of the image"""
    # Resize mask to match original image
    mask = cv2.resize(mask, (image.shape[1], image.shape[0]))
    
    # Create colored mask
    colored_mask = np.zeros_like(image)
    colored_mask[mask == 1] = color
    
    # Overlay
    mask_indices = mask == 1
    overlayed_img = image.copy()
    overlayed_img[mask_indices] = cv2.addWeighted(image[mask_indices], 1-alpha, colored_mask[mask_indices], alpha, 0)
    
    return overlayed_img

# --------------------
# Main Prediction Logic
# --------------------
def predict_pipeline(image_path):
    if not os.path.exists(image_path):
        print(f"❌ Error: Image not found at {image_path}")
        return

    # 1. Read Original Image
    original_img = cv2.imread(image_path)
    if original_img is None:
        print("❌ Error: Could not read image.")
        return

    # 2. Run Classification
    input_cls = preprocess_for_classification(original_img)
    cls_preds = class_model.predict(input_cls, verbose=0)
    
    class_idx = np.argmax(cls_preds)
    confidence = np.max(cls_preds)
    label = CLASS_LABELS.get(class_idx, "Unknown")

    print(f"\n🧠 Diagnosis: {label}")
    print(f"📊 Confidence: {confidence * 100:.2f}%")

    # Visualization Setup
    plt.figure(figsize=(12, 5))
    
    # Show Original
    plt.subplot(1, 3, 1)
    plt.title(f"Input: {label} ({confidence:.2f})")
    plt.imshow(cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB))
    plt.axis('off')

    # 3. Decision Logic
    if label == 'No Tumor':
        print("✅ No Tumor detected. Skipping segmentation.")
        plt.subplot(1, 3, 2)
        plt.text(0.5, 0.5, "Healthy Brain\nNo Tumor", 
                 fontsize=14, ha='center', va='center')
        plt.axis('off')
    else:
        print("⚠️ Tumor detected! Running Segmentation...")
        
        # 4. Run Segmentation
        input_seg = preprocess_for_segmentation(original_img)
        seg_pred = seg_model.predict(input_seg, verbose=0)
        
        # Thresholding (Probability -> Binary Mask)
        mask = (seg_pred > 0.5).astype(np.uint8)[0, :, :, 0]

        # Check if mask is empty (sometimes classification says yes, but segmentation finds nothing)
        if np.sum(mask) == 0:
            print("⚠️ Warning: Classification detected tumor, but Segmentation mask is empty.")
        
        # 5. Overlay Result
        overlay = overlay_mask(original_img, mask)

        # Plot Mask
        plt.subplot(1, 3, 2)
        plt.title("Generated Mask")
        plt.imshow(mask, cmap='gray')
        plt.axis('off')

        # Plot Overlay
        plt.subplot(1, 3, 3)
        plt.title(f"Overlay: {label}")
        plt.imshow(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
        plt.axis('off')

    plt.tight_layout()
    plt.show()

# --------------------
# Run Prediction
# --------------------
# Yahan apni test image ka path dalo
TEST_IMAGE_PATH = "data/classification/test/Glioma/image_15.jpg"  # Example Path
# TEST_IMAGE_PATH = "data/classification/test/No_Tumor/image_5.jpg" # Example Path

predict_pipeline(TEST_IMAGE_PATH)