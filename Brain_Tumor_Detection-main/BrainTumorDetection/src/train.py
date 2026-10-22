"""
Training script for deep learning image classification model using TensorFlow.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt


class ImageClassificationTrainer:
    """Trainer class for image classification models."""
    
    def __init__(self, model_name='image_classifier', img_size=(224, 224), num_classes=2):
        """
        Initialize the trainer.
        
        Args:
            model_name (str): Name of the model
            img_size (tuple): Input image size (height, width)
            num_classes (int): Number of output classes
        """
        self.model_name = model_name
        self.img_size = img_size
        self.num_classes = num_classes
        self.model = None
        self.history = None
    
    def build_model(self):
        """Build a CNN model for image classification."""
        model = models.Sequential([
            layers.Rescaling(1./255),
            
            # First Conv Block
            layers.Conv2D(32, 3, activation='relu', padding='same', input_shape=(*self.img_size, 3)),
            layers.BatchNormalization(),
            layers.MaxPooling2D(2),
            layers.Dropout(0.25),
            
            # Second Conv Block
            layers.Conv2D(64, 3, activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D(2),
            layers.Dropout(0.25),
            
            # Third Conv Block
            layers.Conv2D(128, 3, activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D(2),
            layers.Dropout(0.25),
            
            # Dense layers
            layers.Flatten(),
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(128, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(self.num_classes, activation='softmax')
        ])
        
        self.model = model
        return model
    
    def compile_model(self, learning_rate=1e-3):
        """Compile the model."""
        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
        self.model.compile(
            optimizer=optimizer,
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
    
    def train(self, train_dataset, val_dataset, epochs=25, batch_size=32):
        """
        Train the model.
        
        Args:
            train_dataset: Training dataset
            val_dataset: Validation dataset
            epochs (int): Number of training epochs
            batch_size (int): Batch size
        """
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=5,
                restore_best_weights=True
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=3,
                min_lr=1e-7
            )
        ]
        
        self.history = self.model.fit(
            train_dataset,
            validation_data=val_dataset,
            epochs=epochs,
            callbacks=callbacks
        )
        
        return self.history
    
    def save_model(self, save_dir='../models'):
        """Save the trained model."""
        os.makedirs(save_dir, exist_ok=True)
        model_path = os.path.join(save_dir, f'{self.model_name}.h5')
        self.model.save(model_path)
        print(f"Model saved to {model_path}")
    
    def plot_training_history(self, save_path=None):
        """Plot training history."""
        fig, axes = plt.subplots(1, 2, figsize=(12, 4))
        
        axes[0].plot(self.history.history['accuracy'], label='Train Accuracy')
        axes[0].plot(self.history.history['val_accuracy'], label='Val Accuracy')
        axes[0].set_xlabel('Epoch')
        axes[0].set_ylabel('Accuracy')
        axes[0].set_title('Model Accuracy')
        axes[0].legend()
        axes[0].grid(True)
        
        axes[1].plot(self.history.history['loss'], label='Train Loss')
        axes[1].plot(self.history.history['val_loss'], label='Val Loss')
        axes[1].set_xlabel('Epoch')
        axes[1].set_ylabel('Loss')
        axes[1].set_title('Model Loss')
        axes[1].legend()
        axes[1].grid(True)
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path)
        plt.show()


def main():
    """Main training script."""
    print("Starting training...")
    
    # Configuration
    IMG_SIZE = (224, 224)
    BATCH_SIZE = 32
    EPOCHS = 25
    NUM_CLASSES = 2
    
    # Initialize trainer
    trainer = ImageClassificationTrainer(
        model_name='image_classifier',
        img_size=IMG_SIZE,
        num_classes=NUM_CLASSES
    )
    
    # Build and compile model
    trainer.build_model()
    trainer.model.summary()
    trainer.compile_model()
    
    # TODO: Load your data here
    # train_dataset = load_training_data(...)
    # val_dataset = load_validation_data(...)
    
    # Train model
    # trainer.train(train_dataset, val_dataset, epochs=EPOCHS, batch_size=BATCH_SIZE)
    
    # Save model
    # trainer.save_model()
    
    # Plot results
    # trainer.plot_training_history(save_path='../models/training_history.png')
    
    print("Training complete!")


if __name__ == "__main__":
    main()
