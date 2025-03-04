import tensorflow as tf
import numpy as np
import os
import json
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from pathlib import Path

# Configuration
INPUT_SHAPE = (64, 64, 1)  # 64x64 grayscale images
BATCH_SIZE = 32
EPOCHS = 5

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / 'data'
PROCESSED_DIR = DATA_DIR / 'processed_data'
MODEL_DIR = PROJECT_ROOT / 'public/models/japanese_character_model'

def create_model(num_classes):
    """Create a CNN model for Japanese character recognition."""
    model = models.Sequential([
        # Input layer
        layers.Input(shape=INPUT_SHAPE),
        
        # First convolutional block
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Second convolutional block
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Third convolutional block
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Dense layers
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    return model

def load_data():
    """Load and preprocess the dataset."""
    # Load TFRecord files
    train_dataset = tf.data.TFRecordDataset(str(PROCESSED_DIR / 'train.tfrecord'))
    val_dataset = tf.data.TFRecordDataset(str(PROCESSED_DIR / 'val.tfrecord'))
    
    # Feature description for parsing
    feature_description = {
        'label': tf.io.FixedLenFeature([], tf.int64),
        'image_raw': tf.io.FixedLenFeature([], tf.string)
    }
    
    def _parse_function(example_proto):
        parsed_features = tf.io.parse_single_example(example_proto, feature_description)
        image = tf.io.parse_tensor(parsed_features['image_raw'], out_type=tf.float32)
        image = tf.reshape(image, INPUT_SHAPE)
        label = parsed_features['label']
        return image, label
    
    # Parse and batch datasets
    train_dataset = train_dataset.map(_parse_function).shuffle(1000).batch(BATCH_SIZE)
    val_dataset = val_dataset.map(_parse_function).batch(BATCH_SIZE)
    
    return train_dataset, val_dataset

def train_model():
    """Train the Japanese character recognition model."""
    # Load character mapping
    with open(PROCESSED_DIR / 'character_map.json', 'r', encoding='utf-8') as f:
        character_map = json.load(f)
    
    num_classes = len(character_map)
    print(f"Training model for {num_classes} character classes")
    
    # Create and compile model
    model = create_model(num_classes)
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Load datasets
    train_dataset, val_dataset = load_data()
    
    # Create callbacks
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(MODEL_DIR / 'best_model.h5'),
            save_best_only=True,
            monitor='val_accuracy'
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=10,
            restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_accuracy',
            factor=0.5,
            patience=5,
            min_lr=1e-6
        )
    ]
    
    # Train model
    history = model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    
    # Save model for TensorFlow.js
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    
    # Save character mapping
    with open(MODEL_DIR / 'character_map.json', 'w', encoding='utf-8') as f:
        json.dump(character_map, f, ensure_ascii=False, indent=2)
    
    # Convert and save model for TensorFlow.js
    tfjs_target = str(MODEL_DIR / 'model.json')
    best_model_path = str(MODEL_DIR / 'best_model.h5')
    tfjs_command = f"tensorflowjs_converter --input_format=keras {best_model_path} {tfjs_target}"
    os.system(tfjs_command)
    
    print("Model training completed and saved for TensorFlow.js")
    return history

if __name__ == '__main__':
    train_model() 