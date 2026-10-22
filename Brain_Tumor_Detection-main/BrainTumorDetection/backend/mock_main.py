from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import random
import time

app = FastAPI(title="Brain Tumor Detection MOCK API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    # Artificial delay to simulate real AI processing
    time.sleep(1.5)
    
    # Simple Mock Logic
    labels = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]
    diagnosis = random.choice(labels)
    confidence = random.uniform(0.85, 0.99)
    
    return JSONResponse(content={
        "label": diagnosis,
        "confidence": confidence,
        "has_tumor": diagnosis != "No Tumor",
        "mock": True
    })

@app.get("/api/model-metrics")
def get_metrics():
    return {
        "accuracy": [0.85, 0.88, 0.92, 0.94, 0.95],
        "val_accuracy": [0.82, 0.85, 0.89, 0.91, 0.93],
        "loss": [0.45, 0.38, 0.22, 0.15, 0.12],
        "val_loss": [0.48, 0.40, 0.25, 0.18, 0.14]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
