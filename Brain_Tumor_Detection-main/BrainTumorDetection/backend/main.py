from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import router
import os

app = FastAPI(title="Brain Tumor Detection API", version="1.0")

# CORS Setup
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes with /api prefix to match frontend
app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Brain Tumor Detection API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
