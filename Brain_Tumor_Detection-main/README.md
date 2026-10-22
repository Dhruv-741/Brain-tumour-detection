# Brain Tumor Detection & Segmentation (MRI)

A complete medical AI platform for high-accuracy brain tumor classification and segmentation from MRI images. The system uses **EfficientNetB0** for classification (98.7% accuracy) and **U-Net** for precise tumor localization.

---

## 🚀 Quick Start (Local Machine)

Follow these exact steps to run the project on your Windows PC.

### 1. Pre-requisite: Enable Windows Long Paths
Windows limits file paths to 260 characters by default, which blocks TensorFlow installation.
1. Open **PowerShell** as **Administrator**.
2. Run this command:
   ```powershell
   Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1
   ```

### 2. Backend Setup (AI Engine)
1. Open a terminal in `BrainTumorDetection/backend`.
2. Install the optimized dependencies:
   ```powershell
   .venv\Scripts\pip install tensorflow==2.15.0 scikit-learn opencv-python pillow fastapi uvicorn
   ```
3. Start the real AI server:
   ```powershell
   .venv\Scripts\python main.py
   ```
   *The server is ready when you see: `INFO: Application startup complete.`*

### 3. Frontend Setup (User Interface)
1. Open a **new terminal** in `BrainTumorDetection/frontend`.
2. Install the UI dependencies:
   ```powershell
   npm install
   ```
3. Start the interface:
   ```powershell
   npm run dev
   ```
4. Access the app at: `http://localhost:5173`

---

## 🧠 Model Training & Performance

If you want to retrain the model on the BRISC dataset:
1. Ensure your data is in `data/classification/train/`.
2. Run the optimized training pipeline:
   ```powershell
   backend\.venv\Scripts\python train_classification.py
   ```
**Performance achieved:**
- **Training Accuracy:** 99.4%
- **Peak Validation Accuracy:** 98.7%
- **Architecture:** EfficientNetB0 (Compound Scaling)

---

## 📂 Project Structure

- `/backend`: FastAPI server + AI Logic.
- `/frontend`: React + Vite + Tailwind CSS interface.
- `/models`: Trained `.h5` model files.
- `/docs`: Detailed technical reports and research references.
- `/data`: Dataset storage for MRI images.

---

## 📄 Technical Documentation
For a deep dive into the math, architecture, and research behind the 98% accuracy boost, see:
`BrainTumorDetection/docs/BRAIN_TUMOR_DETECTION_TECHNICAL_REPORT.md`