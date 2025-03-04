import os
import numpy as np
import cv2
import json
import tensorflow as tf
from pathlib import Path
from tqdm import tqdm

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / 'data'
PROCESSED_DIR = DATA_DIR / 'processed_data'
IMAGES_DIR = PROCESSED_DIR / 'images'
INPUT_SIZE = (64, 64)

def ensure_directories():
    """Create necessary directories if they don't exist."""
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

def process_image(image):
    """Process a single image."""
    # Convert to grayscale if needed
    if len(image.shape) > 2:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Resize to target size
    image = cv2.resize(image, INPUT_SIZE)
    
    # Normalize to [0, 1]
    image = image.astype(np.float32) / 255.0
    
    return image

def create_synthetic_data():
    """Create synthetic data for testing when ETL9G dataset is not available."""
    print("Creating synthetic dataset for testing...")
    
    # Load character data from our existing characters.ts file
    characters_file = PROJECT_ROOT / 'src' / 'data' / 'characters.ts'
    with open(characters_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Extract arrays using string manipulation
        hiragana_start = content.find('export const hiraganaData = [')
        hiragana_end = content.find('];', hiragana_start) + 1
        hiragana_str = content[hiragana_start:hiragana_end]
        
        katakana_start = content.find('export const katakanaData = [')
        katakana_end = content.find('];', katakana_start) + 1
        katakana_str = content[katakana_start:katakana_end]
        
        # Convert TypeScript objects to Python dicts
        def convert_to_python(ts_str):
            # Remove TypeScript-specific syntax
            py_str = ts_str.replace('export const hiraganaData =', '')
            py_str = py_str.replace('export const katakanaData =', '')
            
            # Remove comments
            py_str = '\n'.join(line for line in py_str.split('\n') 
                             if not line.strip().startswith('//'))
            
            # Convert TypeScript object syntax to Python dict syntax
            py_str = py_str.replace('character:', '"character":')
            py_str = py_str.replace('romaji:', '"romaji":')
            py_str = py_str.replace('tip:', '"tip":')
            
            # Evaluate the string as Python code
            try:
                return eval(py_str, {'__builtins__': {}})  # Restricted eval for safety
            except:
                print(f"Failed to parse: {py_str}")
                return []
        
        hiragana_data = convert_to_python(hiragana_str)
        katakana_data = convert_to_python(katakana_str)
    
    # Combine all characters
    all_chars = []
    for item in hiragana_data + katakana_data:
        if isinstance(item, dict) and len(item.get('character', '')) == 1:  # Only single characters
            all_chars.append(item['character'])
    
    # Remove duplicates and sort
    all_chars = sorted(list(set(all_chars)))
    
    print(f"Found {len(all_chars)} unique characters")
    
    # Create character mapping
    char_map = {i: char for i, char in enumerate(all_chars)}
    reverse_char_map = {char: i for i, char in enumerate(all_chars)}
    
    # Save character mappings
    with open(PROCESSED_DIR / 'character_map.json', 'w', encoding='utf-8') as f:
        json.dump(char_map, f, ensure_ascii=False, indent=2)
    with open(PROCESSED_DIR / 'reverse_character_map.json', 'w', encoding='utf-8') as f:
        json.dump(reverse_char_map, f, ensure_ascii=False, indent=2)
    
    # Create synthetic images for each character
    images = []
    labels = []
    
    for idx, char in enumerate(tqdm(all_chars, desc="Generating synthetic images")):
        # Create multiple variations for each character
        for i in range(100):  # 100 variations per character
            # Create a blank image
            img = np.zeros(INPUT_SIZE, dtype=np.uint8)
            
            # Add the character
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 1.0
            thickness = 2
            text_size = cv2.getTextSize(char, font, font_scale, thickness)[0]
            
            # Center the character
            x = (INPUT_SIZE[0] - text_size[0]) // 2
            y = (INPUT_SIZE[1] + text_size[1]) // 2
            
            # Add some random variation
            x += np.random.randint(-5, 6)
            y += np.random.randint(-5, 6)
            angle = np.random.randint(-15, 16)
            scale = font_scale * (0.8 + np.random.random() * 0.4)
            
            # Create transformation matrix
            M = cv2.getRotationMatrix2D((INPUT_SIZE[0]/2, INPUT_SIZE[1]/2), angle, scale)
            
            # Put text and apply transformation
            cv2.putText(img, char, (x, y), font, font_scale, 255, thickness)
            img = cv2.warpAffine(img, M, INPUT_SIZE)
            
            # Add noise and blur
            noise = np.random.normal(0, 10, INPUT_SIZE).astype(np.uint8)
            img = cv2.add(img, noise)
            if np.random.random() > 0.5:
                img = cv2.GaussianBlur(img, (3, 3), 0)
            
            # Process image
            processed_img = process_image(img)
            
            # Save example image
            if i == 0:
                cv2.imwrite(str(IMAGES_DIR / f"{char}_{i}.png"), img)
            
            images.append(processed_img)
            labels.append(idx)
    
    # Convert to numpy arrays
    images = np.array(images)
    labels = np.array(labels)
    
    # Split into train and validation sets
    indices = np.random.permutation(len(images))
    split = int(len(images) * 0.8)
    train_indices = indices[:split]
    val_indices = indices[split:]
    
    train_images = images[train_indices]
    train_labels = labels[train_indices]
    val_images = images[val_indices]
    val_labels = labels[val_indices]
    
    # Create TFRecord files
    def _bytes_feature(value):
        return tf.train.Feature(bytes_list=tf.train.BytesList(value=[value]))
    
    def _int64_feature(value):
        return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))
    
    def create_tf_example(image, label):
        feature = {
            'image_raw': _bytes_feature(tf.io.serialize_tensor(image).numpy()),
            'label': _int64_feature(label)
        }
        return tf.train.Example(features=tf.train.Features(feature=feature))
    
    # Write training data
    with tf.io.TFRecordWriter(str(PROCESSED_DIR / 'train.tfrecord')) as writer:
        for image, label in tqdm(zip(train_images, train_labels), desc="Writing training data"):
            tf_example = create_tf_example(image, label)
            writer.write(tf_example.SerializeToString())
    
    # Write validation data
    with tf.io.TFRecordWriter(str(PROCESSED_DIR / 'val.tfrecord')) as writer:
        for image, label in tqdm(zip(val_images, val_labels), desc="Writing validation data"):
            tf_example = create_tf_example(image, label)
            writer.write(tf_example.SerializeToString())
    
    print(f"Created dataset with {len(all_chars)} characters:")
    print(f"Training samples: {len(train_images)}")
    print(f"Validation samples: {len(val_images)}")
    return True

def main():
    """Main processing function."""
    ensure_directories()
    
    # For now, we'll use synthetic data since we don't have the ETL9G dataset
    success = create_synthetic_data()
    
    if success:
        print("Data processing completed successfully!")
    else:
        print("Data processing failed!")

if __name__ == '__main__':
    main() 