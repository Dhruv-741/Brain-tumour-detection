import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils.class_weight import compute_class_weight

# ==============================================================
# WHY THE MODEL WAS STUCK AT ~25% (RANDOM GUESSING FOR 4 CLASSES)
# ==============================================================
# ROOT CAUSE 1: Preprocessing mismatch
#   - EfficientNetB0 was pretrained on ImageNet with a specific preprocessing
#     (scaling pixels to [-1, 1] via tf.keras.applications.efficientnet.preprocess_input).
#   - The old code used rescale=1./255 which maps to [0, 1].
#   - This mismatch means ALL pretrained feature maps produce wrong activations.
#   - FIX: Use EfficientNetB0's native preprocessing function.
#
# ROOT CAUSE 2: No class weights
#   - Dataset is imbalanced (pituitary=1457, no_tumor=1067).
#   - Without class weights, model biases toward majority class.
#   - FIX: Compute and apply class weights during training.
#
# ROOT CAUSE 3: Missing evaluation
#   - No confusion matrix or classification report was generated.
#   - FIX: Added full evaluation after training.
# ==============================================================

# --------------------
# Paths & Params
# --------------------
IMG_SIZE = 224       # EfficientNetB0 native input size
BATCH_SIZE = 16      # CPU-friendly batch size
PHASE1_EPOCHS = 10   # Head-only training
PHASE2_EPOCHS = 25   # Fine-tuning with unfrozen base

TRAIN_DIR = "data/classification/train"
VAL_DIR   = "data/classification/test"

MODEL_PATH = "models/classification_model_v2.h5"
HISTORY_PATH = "models/training_history.json"
os.makedirs("models", exist_ok=True)

# --------------------
# Data Generators
# --------------------
# FIX: Use EfficientNetB0's native preprocessing instead of manual rescale.
# EfficientNetB0 expects pixels scaled to [-1, 1], NOT [0, 1].
# Using rescale=1./255 was the PRIMARY reason accuracy was stuck at 25%.
from tensorflow.keras.applications.efficientnet import preprocess_input

train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,   # Correct: maps to [-1, 1]
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.15,
    horizontal_flip=True,
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input     # Must match training preprocessing
)

print("📦 Loading Data...")
train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=True
)

val_gen = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False    # Don't shuffle validation for proper evaluation
)

NUM_CLASSES = train_gen.num_classes
print(f"✅ Found {NUM_CLASSES} classes: {train_gen.class_indices}")
print(f"   Train samples: {train_gen.samples}")
print(f"   Val samples:   {val_gen.samples}")

# --------------------
# Compute Class Weights (handles imbalance)
# --------------------
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_gen.classes),
    y=train_gen.classes
)
class_weight_dict = dict(enumerate(class_weights))
print(f"📊 Class weights: {class_weight_dict}")

# --------------------
# Model: EfficientNetB0 (Transfer Learning)
# --------------------
base_model = EfficientNetB0(
    weights="imagenet",
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

# PHASE 1: Freeze the ENTIRE base model.
# Only train the new classification head first.
base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation="relu")(x)
x = Dropout(0.5)(x)
outputs = Dense(NUM_CLASSES, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=outputs)

# Compile for Phase 1 (head-only, higher learning rate is OK)
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# --------------------
# Callbacks
# --------------------
callbacks_phase1 = [
    ModelCheckpoint(MODEL_PATH, save_best_only=True, verbose=1, monitor='val_accuracy'),
    EarlyStopping(patience=5, restore_best_weights=True, monitor='val_loss'),
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, min_lr=1e-7, verbose=1)
]

# --------------------
# PHASE 1: Train Head Only
# --------------------
print("\n🚀 PHASE 1: Training classification head (base frozen)...")
print(f"   Epochs: {PHASE1_EPOCHS}, LR: 1e-3")
history1 = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=PHASE1_EPOCHS,
    class_weight=class_weight_dict,
    callbacks=callbacks_phase1
)

# --------------------
# PHASE 2: Fine-tune entire model
# --------------------
print("\n🔓 PHASE 2: Unfreezing base model for fine-tuning...")
base_model.trainable = True

# Keep BatchNorm layers frozen (critical for small-batch training stability)
for layer in base_model.layers:
    if isinstance(layer, BatchNormalization):
        layer.trainable = False

# Recompile with much lower learning rate
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

callbacks_phase2 = [
    ModelCheckpoint(MODEL_PATH, save_best_only=True, verbose=1, monitor='val_accuracy'),
    EarlyStopping(patience=8, restore_best_weights=True, monitor='val_loss'),
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=1e-7, verbose=1)
]

print(f"   Epochs: {PHASE2_EPOCHS}, LR: 1e-5")
history2 = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=PHASE2_EPOCHS,
    class_weight=class_weight_dict,
    callbacks=callbacks_phase2
)

# --------------------
# Save Training History
# --------------------
full_history = {}
for key in history1.history:
    full_history[key] = history1.history[key] + history2.history[key]

# Convert numpy values to native Python for JSON serialization
for key in full_history:
    full_history[key] = [float(v) for v in full_history[key]]

with open(HISTORY_PATH, 'w') as f:
    json.dump(full_history, f, indent=2)
print(f"📈 Training history saved to {HISTORY_PATH}")

# --------------------
# Evaluation on Validation Set
# --------------------
print("\n📊 Evaluating on validation set...")

# Reset generator for clean evaluation
val_gen.reset()
y_pred_probs = model.predict(val_gen, verbose=1)
y_pred = np.argmax(y_pred_probs, axis=1)
y_true = val_gen.classes[:len(y_pred)]

# Get class names in correct order
class_names = list(train_gen.class_indices.keys())

print("\n" + "="*60)
print("CLASSIFICATION REPORT")
print("="*60)
print(classification_report(y_true, y_pred, target_names=class_names))

print("\nCONFUSION MATRIX")
print("="*60)
cm = confusion_matrix(y_true, y_pred)
print(f"{'':>12}", end="")
for name in class_names:
    print(f"{name:>12}", end="")
print()
for i, row in enumerate(cm):
    print(f"{class_names[i]:>12}", end="")
    for val in row:
        print(f"{val:>12}", end="")
    print()

# Final accuracy
val_loss, val_acc = model.evaluate(val_gen, verbose=0)
print(f"\n✅ Final Validation Accuracy: {val_acc*100:.2f}%")
print(f"✅ Final Validation Loss: {val_loss:.4f}")
print(f"✅ Training complete! Best model saved at: {MODEL_PATH}")