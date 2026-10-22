import os
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

# --------------------
# Paths
# --------------------
IMG_HEIGHT = 256
IMG_WIDTH = 256

TRAIN_IMG_DIR = "data/segmentation/train/images"
TRAIN_MASK_DIR = "data/segmentation/train/masks"
VAL_IMG_DIR   = "data/segmentation/test/images"
VAL_MASK_DIR  = "data/segmentation/test/masks"

MODEL_PATH = "models/segmentation_unet_v2.h5"
os.makedirs("models", exist_ok=True)

# --------------------
# Preprocessing (CLAHE)
# --------------------
def apply_clahe(img):
    """Sharpen boundaries for better segmentation"""
    img_uint8 = (img * 255).astype(np.uint8)
    gray = cv2.cvtColor(img_uint8, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl1 = clahe.apply(gray)
    return cv2.cvtColor(cl1, cv2.COLOR_GRAY2RGB).astype(np.float32) / 255.0

# --------------------
# Data Loader
# --------------------
def load_data(img_dir, mask_dir):
    images, masks = [], []
    img_files = sorted([f for f in os.listdir(img_dir) if not f.startswith('.')])
    mask_files = set(os.listdir(mask_dir))

    skipped = 0
    for img_name in img_files:
        base = os.path.splitext(img_name)[0]
        # Search for mask file with common patterns
        candidates = [img_name, base + "_mask.png", base + "_mask.jpg", base + ".png", base + ".jpg"]
        mask_name = next((c for c in candidates if c in mask_files), None)

        if mask_name is None:
            skipped += 1
            continue

        img_path = os.path.join(img_dir, img_name)
        mask_path = os.path.join(mask_dir, mask_name)

        img = cv2.imread(img_path)
        mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)

        if img is None or mask is None:
            skipped += 1
            continue

        # Basic Preprocessing
        img = cv2.resize(img, (IMG_WIDTH, IMG_HEIGHT))
        img = img / 255.0
        img = apply_clahe(img) # Enhance contrast

        mask = cv2.resize(mask, (IMG_WIDTH, IMG_HEIGHT))
        mask = np.where(mask > 127, 1.0, 0.0).astype(np.float32) 
        mask = np.expand_dims(mask, axis=-1)

        images.append(img)
        masks.append(mask)

    return np.array(images), np.array(masks)

print("📥 Loading medical segmentation data...")
X_train, y_train = load_data(TRAIN_IMG_DIR, TRAIN_MASK_DIR)
X_val, y_val     = load_data(VAL_IMG_DIR, VAL_MASK_DIR)

# --------------------
# Dice Loss & Metrics
# --------------------
def dice_coef(y_true, y_pred):
    smooth = 1e-6
    y_true_f = tf.reshape(y_true, [-1])
    y_pred_f = tf.reshape(y_pred, [-1])
    intersection = tf.reduce_sum(y_true_f * y_pred_f)
    return (2. * intersection + smooth) / (tf.reduce_sum(y_true_f) + tf.reduce_sum(y_pred_f) + smooth)

def dice_loss(y_true, y_pred):
    return 1 - dice_coef(y_true, y_pred)

# --------------------
# Robust U-Net Model (with BN)
# --------------------
def conv_block(inputs, filters):
    x = Conv2D(filters, 3, padding="same")(inputs)
    x = BatchNormalization()(x)
    x = Activation("relu")(x)
    x = Conv2D(filters, 3, padding="same")(x)
    x = BatchNormalization()(x)
    x = Activation("relu")(x)
    return x

def encoder_block(inputs, filters):
    x = conv_block(inputs, filters)
    p = MaxPooling2D((2, 2))(x)
    return x, p

def decoder_block(inputs, skip_features, filters):
    x = Conv2DTranspose(filters, (2, 2), strides=2, padding="same")(inputs)
    x = Concatenate()([x, skip_features])
    x = conv_block(x, filters)
    return x

def build_unet(input_shape=(256, 256, 3)):
    inputs = Input(input_shape)

    s1, p1 = encoder_block(inputs, 64)
    s2, p2 = encoder_block(p1, 128)
    s3, p3 = encoder_block(p2, 256)
    s4, p4 = encoder_block(p3, 512)

    b1 = conv_block(p4, 1024)

    d1 = decoder_block(b1, s4, 512)
    d2 = decoder_block(d1, s3, 256)
    d3 = decoder_block(d2, s2, 128)
    d4 = decoder_block(d3, s1, 64)

    outputs = Conv2D(1, 1, padding="same", activation="sigmoid")(d4)

    return Model(inputs, outputs, name="U-Net_Medical")

model = build_unet()
model.compile(optimizer=tf.keras.optimizers.Adam(1e-4), loss=dice_loss, metrics=[dice_coef, 'accuracy'])

# --------------------
# Training Configuration
# --------------------
callbacks = [
    ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_loss'),
    EarlyStopping(patience=10, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1)
]

print("🚀 Starting Advanced Segmentation Training...")
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=50,
    batch_size=8,
    callbacks=callbacks
)

print(f"✅ Segmentation training complete! Saved at: {MODEL_PATH}")