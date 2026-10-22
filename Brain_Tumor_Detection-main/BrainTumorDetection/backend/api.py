from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
import io
import json
import os
import sys
import numpy as np
import cv2

# Import local ML modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'ml'))

router = APIRouter()

# Use a robust absolute path for the model relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../models/classification_model_v2.h5")
HISTORY_PATH = "model/training_history.json"

model = None

def load_model():
    global model
    if model is None:
        if os.path.exists(MODEL_PATH):
            print(f"Loading TensorFlow model from {MODEL_PATH}...")
            model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        else:
            print("Model not found at startup. Please run 'train_classification.py' first.")

load_model()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    global model
    if model is None:
        load_model()
        if model is None:
            raise HTTPException(status_code=503, detail="Model file not found. Please train first.")
    
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # Simple preprocessing: must match training exactly (resize + rescale)
        img_np = np.array(image)
        img_resized = cv2.resize(img_np, (224, 224))
        img_float = img_resized.astype(np.float32)
        img_normalized = preprocess_input(img_float)  # Scales to [-1,1] matching training
        input_tensor = np.expand_dims(img_normalized, axis=0)

        
        # 2. Inference
        preds = model.predict(input_tensor, verbose=0)
        class_idx = np.argmax(preds[0])
        confidence = float(np.max(preds[0]))
        
        # Labels (Standardized alphabetical)
        labels = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]
        diagnosis = labels[class_idx]
        
        return JSONResponse(content={
            "label": diagnosis,
            "confidence": confidence,
            "has_tumor": diagnosis != "No Tumor"
        })
        
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@router.get("/model-metrics")
def get_metrics():
    if not os.path.exists(HISTORY_PATH):
        raise HTTPException(status_code=404, detail="Training history not found.")
    
    with open(HISTORY_PATH, 'r') as f:
        history = json.load(f)
        
    return history
