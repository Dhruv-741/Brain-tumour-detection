"""
Prediction script for image classification model.
"""

import os
import numpy as np
import tensorflow as tf
from PIL import Image
import cv2
from pathlib import Path


class ImagePredictor:
    """Predictor class for making predictions on images."""
    
    def __init__(self, model_path, img_size=(224, 224), class_names=None):
        """
        Initialize predictor.
        
        Args:
            model_path (str): Path to the saved model
            img_size (tuple): Input image size
            class_names (list): List of class names
        """
        self.model_path = model_path
        self.img_size = img_size
        self.class_names = class_names or ['Class_0', 'Class_1']
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load the trained model."""
        self.model = tf.keras.models.load_model(self.model_path)
        print(f"Model loaded from {self.model_path}")
    
    def preprocess_image(self, image_path):
        """
        Preprocess image for prediction.
        
        Args:
            image_path (str): Path to the image
            
        Returns:
            np.ndarray: Preprocessed image
        """
        image = Image.open(image_path).convert('RGB')
        image = image.resize(self.img_size)
        image_array = np.array(image) / 255.0
        return image_array
    
    def preprocess_image_cv2(self, image_path):
        """
        Preprocess image using OpenCV.
        
        Args:
            image_path (str): Path to the image
            
        Returns:
            np.ndarray: Preprocessed image
        """
        image = cv2.imread(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, self.img_size)
        image_array = image.astype('float32') / 255.0
        return image_array
    
    def predict_single(self, image_path, return_confidence=False):
        """
        Make prediction on a single image.
        
        Args:
            image_path (str): Path to the image
            return_confidence (bool): Whether to return confidence scores
            
        Returns:
            str or tuple: Predicted class name (and confidence if requested)
        """
        image = self.preprocess_image(image_path)
        image = np.expand_dims(image, axis=0)
        
        prediction = self.model.predict(image, verbose=0)
        predicted_class_idx = np.argmax(prediction[0])
        confidence = prediction[0][predicted_class_idx]
        
        predicted_class = self.class_names[predicted_class_idx]
        
        if return_confidence:
            return predicted_class, float(confidence)
        return predicted_class
    
    def predict_batch(self, image_dir, return_confidence=False):
        """
        Make predictions on multiple images.
        
        Args:
            image_dir (str): Directory containing images
            return_confidence (bool): Whether to return confidence scores
            
        Returns:
            dict: Dictionary with image paths as keys and predictions as values
        """
        results = {}
        image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.gif'}
        
        for image_file in os.listdir(image_dir):
            if Path(image_file).suffix.lower() in image_extensions:
                image_path = os.path.join(image_dir, image_file)
                try:
                    prediction = self.predict_single(image_path, return_confidence)
                    results[image_file] = prediction
                except Exception as e:
                    results[image_file] = f"Error: {str(e)}"
        
        return results
    
    def predict_with_visualization(self, image_path, save_path=None):
        """
        Make prediction and visualize the result.
        
        Args:
            image_path (str): Path to the image
            save_path (str): Path to save the visualization
        """
        import matplotlib.pyplot as plt
        
        predicted_class, confidence = self.predict_single(image_path, return_confidence=True)
        
        image = Image.open(image_path)
        
        plt.figure(figsize=(8, 6))
        plt.imshow(image)
        plt.title(f"Prediction: {predicted_class}\nConfidence: {confidence:.2%}")
        plt.axis('off')
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path)
        plt.show()


def main():
    """Main prediction script."""
    print("Starting prediction...")
    
    # Configuration
    MODEL_PATH = '../models/image_classifier.h5'
    IMG_SIZE = (224, 224)
    CLASS_NAMES = ['Class_0', 'Class_1']
    
    # Initialize predictor
    predictor = ImagePredictor(
        model_path=MODEL_PATH,
        img_size=IMG_SIZE,
        class_names=CLASS_NAMES
    )
    
    # TODO: Make predictions
    # Single prediction
    # prediction = predictor.predict_single('../data/test/sample.jpg', return_confidence=True)
    # print(f"Prediction: {prediction}")
    
    # Batch prediction
    # results = predictor.predict_batch('../data/test')
    # for image, pred in results.items():
    #     print(f"{image}: {pred}")
    
    # Prediction with visualization
    # predictor.predict_with_visualization(
    #     '../data/test/sample.jpg',
    #     save_path='../models/prediction_result.png'
    # )
    
    print("Prediction complete!")


if __name__ == "__main__":
    main()
