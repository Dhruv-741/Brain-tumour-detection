import os
import argparse
from model import get_production_model
from train import run_training_pipeline

def main():
    """
    Final Pipeline Orchestrator.
    Run this file to execute the complete training process 
    using the modular architecture.
    """
    parser = argparse.ArgumentParser(description="Medical Imaging Production Pipeline")
    # Make path relative to this script for reliability
    base_path = os.path.dirname(os.path.abspath(__file__))
    default_data = os.path.join(base_path, "../../data/classification/train")
    
    parser.add_argument("--data_dir", type=str, default=default_data, 
                        help="Path to training data")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=16, help="Training batch size")
    
    args = parser.parse_args()

    if not os.path.exists(args.data_dir):
        print(f"❌ Error: Data directory not found at {args.data_dir}")
        return

    print("--- 🧠 PRODUCTION-LEVEL BRAIN TUMOR PIPELINE ---")
    run_training_pipeline(
        data_dir=args.data_dir, 
        epochs=args.epochs, 
        batch_size=args.batch_size
    )

if __name__ == "__main__":
    main()
