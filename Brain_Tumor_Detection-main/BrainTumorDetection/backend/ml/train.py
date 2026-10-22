import torch
import torch.optim as optim
import torch.nn as nn
import os
try:
    from model import get_production_model
    from dataset import get_dataloaders
except ImportError:
    from .model import get_production_model
    from .dataset import get_dataloaders

def run_training_pipeline(data_dir, epochs=50, batch_size=16):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🖥️ Training on device: {device}")

    # 1. Initialize Pipeline Components
    train_loader, val_loader = get_dataloaders(data_dir, batch_size=batch_size)
    model = get_production_model().to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=1e-4, weight_decay=1e-2)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=3)

    best_val_loss = float('inf')
    os.makedirs("../../models", exist_ok=True)

    # 2. Main Execution Loop
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()

        # 3. Validation Logic
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                val_loss += criterion(outputs, labels).item()

        avg_val_loss = val_loss / len(val_loader)
        scheduler.step(avg_val_loss)

        print(f"Epoch {epoch+1}/{epochs} | Val Loss: {avg_val_loss:.4f}")

        # 4. Critical Checkpointing
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            # Save into models folder
            torch.save(model.state_dict(), "../../models/production_brain_model.pt")
            print("💾 Better model checkpointed.")

    print("✅ Full Pipeline Execution Complete.")

if __name__ == "__main__":
    # Standard entry point for root data folder
    run_training_pipeline("../../data/classification/train")
