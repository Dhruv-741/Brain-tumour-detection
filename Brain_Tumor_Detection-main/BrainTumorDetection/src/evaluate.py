"""
Evaluation script for image classification model.
"""

import os
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns


class ModelEvaluator:
    """Evaluator class for image classification models."""
    
    def __init__(self, model_path=None):
        """
        Initialize evaluator.
        
        Args:
            model_path (str): Path to the saved model
        """
        self.model = None
        if model_path:
            self.load_model(model_path)
    
    def load_model(self, model_path):
        """Load a trained model."""
        self.model = tf.keras.models.load_model(model_path)
        print(f"Model loaded from {model_path}")
    
    def evaluate_on_dataset(self, test_dataset):
        """
        Evaluate model on test dataset.
        
        Args:
            test_dataset: Test dataset
            
        Returns:
            dict: Evaluation metrics
        """
        loss, accuracy = self.model.evaluate(test_dataset)
        return {
            'loss': loss,
            'accuracy': accuracy
        }
    
    def get_predictions(self, test_dataset, class_names=None):
        """
        Get predictions on test dataset.
        
        Args:
            test_dataset: Test dataset
            class_names (list): List of class names
            
        Returns:
            tuple: (predictions, true_labels)
        """
        y_pred = []
        y_true = []
        
        for images, labels in test_dataset:
            predictions = self.model.predict(images)
            y_pred.extend(np.argmax(predictions, axis=1))
            y_true.extend(np.argmax(labels, axis=1))
        
        return np.array(y_pred), np.array(y_true)
    
    def print_classification_report(self, y_pred, y_true, class_names=None):
        """Print classification report."""
        if class_names is None:
            class_names = [f"Class_{i}" for i in range(len(np.unique(y_true)))]
        
        print("\nClassification Report:")
        print(classification_report(y_true, y_pred, target_names=class_names))
    
    def plot_confusion_matrix(self, y_pred, y_true, class_names=None, save_path=None):
        """Plot confusion matrix."""
        if class_names is None:
            class_names = [f"Class_{i}" for i in range(len(np.unique(y_true)))]
        
        cm = confusion_matrix(y_true, y_pred)
        
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                    xticklabels=class_names, yticklabels=class_names)
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path)
        plt.show()
    
    def evaluate(self, test_dataset, class_names=None, save_confusion_matrix=None):
        """
        Full evaluation pipeline.
        
        Args:
            test_dataset: Test dataset
            class_names (list): List of class names
            save_confusion_matrix (str): Path to save confusion matrix plot
        """
        print("Evaluating model...")
        
        # Get evaluation metrics
        metrics = self.evaluate_on_dataset(test_dataset)
        print(f"\nTest Loss: {metrics['loss']:.4f}")
        print(f"Test Accuracy: {metrics['accuracy']:.4f}")
        
        # Get predictions
        y_pred, y_true = self.get_predictions(test_dataset, class_names)
        
        # Classification report
        self.print_classification_report(y_pred, y_true, class_names)
        
        # Confusion matrix
        self.plot_confusion_matrix(y_pred, y_true, class_names, save_confusion_matrix)
        
        return metrics, y_pred, y_true


def main():
    """Main evaluation script."""
    print("Starting evaluation...")
    
    # Configuration
    MODEL_PATH = '../models/image_classifier.h5'
    CLASS_NAMES = ['Class_0', 'Class_1']
    
    # Initialize evaluator
    evaluator = ModelEvaluator(model_path=MODEL_PATH)
    
    # TODO: Load your test data here
    # test_dataset = load_test_data(...)
    
    # Evaluate
    # metrics, y_pred, y_true = evaluator.evaluate(
    #     test_dataset,
    #     class_names=CLASS_NAMES,
    #     save_confusion_matrix='../models/confusion_matrix.png'
    # )
    
    print("Evaluation complete!")


if __name__ == "__main__":
    main()
