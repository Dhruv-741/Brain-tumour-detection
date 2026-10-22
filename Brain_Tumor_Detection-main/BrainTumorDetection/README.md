# Deep Learning Based Automated Brain Tumor Detection

A comprehensive, full-stack AI application for detecting brain tumors from MRI scans. This project uses a Convolutional Neural Network (CNN) built with **PyTorch** for image analysis, a FastAPI backend for high-performance inference, and a modern React frontend for the user interface.

## System Architecture

- **Frontend**: React.js, Tailwind CSS, Recharts (Medical-grade UI)
- **Backend**: FastAPI (Python), REST API
- **Machine Learning**: **PyTorch**, NumPy, OpenCV
- **Data**: Supported formats: PNG, JPG, DICOM (converted)

## Directory Structure

```
/
├── backend/
│   ├── app/            # API logic
│   ├── ml/             # ML pipeline (train, predict, model)
│   ├── main.py         # App entry point
│   └── requirements.txt
├── frontend/           # React Application
├── data/               # MRI Dataset (train/val)
└── model/              # Saved .pth models
```

## Setup Instructions

### Prerequisites
- Python 3.11 (Required for PyTorch/NumPy compatibility)
- Node.js & npm

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (using Python 3.11):
   ```bash
   # Create venv with Python 3.11
   py -3.11 -m venv venv
   
   # Windows Activation
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: This installs PyTorch, which is compatible with newer Python versions.*

4. **Train the Model** (Required first time):
   ```bash
   python ml/train.py
   ```
   *Note: This will generate dummy data if no real data is found in `../data`.*

5. Start the Server:
   ```bash
   python main.py
   ```
   Server will run at `http://localhost:8000`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Development Server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Features

- **Upload & Analyze**: Drag-and-drop MRI scans for instant analysis.
- **Visual Results**: Clear "Tumor Detected" / "No Tumor" status with specific confidence scores.
- **Performance Metrics**: View real-time training accuracy and loss graphs.
- **Medical Design**: Clean, professional, and responsive interface.

## Technology Stack

- **Deep Learning**: PyTorch
- **Backend Framework**: FastAPI
- **Frontend Framework**: React (Vite)
- **Styling**: Tailwind CSS
