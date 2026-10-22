import torch
import torch.nn as nn
from torchvision import models

class BrainTumorClassifier(nn.Module):
    """
    Advanced PyTorch Classifier using ResNet50 as a backbone.
    Includes Dropout and a high-capacity head for medical scans.
    """
    def __init__(self, num_classes=4):
        super(BrainTumorClassifier, self).__init__()
        # Load a high-performance pretrained backbone
        self.backbone = models.resnet50(pretrained=True)
        
        # Unfreeze all layers for fine-tuning
        for param in self.backbone.parameters():
            param.requires_grad = True

        # Extract features from the last layer before the global pool
        in_features = self.backbone.fc.in_features
        
        # Replace the fully connected layer with a modular architecture
        self.backbone.fc = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(512, num_classes),
            nn.LogSoftmax(dim=1)
        )

    def forward(self, x):
        return self.backbone(x)

def get_production_model(num_classes=4):
    """Factory method for model instantiation."""
    return BrainTumorClassifier(num_classes=num_classes)
