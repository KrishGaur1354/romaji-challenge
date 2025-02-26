import os
import struct
import numpy as np
import cv2
from tqdm import tqdm
import json
import tensorflow as tf
from sklearn.model_selection import train_test_split

# Path to ETL9G dataset and output path
ETL9G_PATH = './etl9g'
OUTPUT_PATH = './processed_data'

# Create output directories
os.makedirs(OUTPUT_PATH, exist_ok=True)
os.makedirs(os.path.join(OUTPUT_PATH, 'images'), exist_ok=True)

# Define target JIS X 0208 ranges for hiragana and katakana
HIRAGANA_RANGE = [(0x2421, 0x2473)]  # Hiragana: starts at 0x2421
KATAKANA_RANGE = [(0x2521, 0x2576)]   # Katakana: starts at 0x2521

def is_target_char(jis_code):
    """Check if the adjusted JIS code is within our target ranges."""
    for start, end in HIRAGANA_RANGE + KATAKANA_RANGE:
        if start <= jis_code <= end:
            return True
    return False

def jis_to_unicode(jis_code):
    """
    Convert a JIS X 0208 code (adjusted) to its corresponding Unicode character.
    For hiragana: subtract 0x2421 and add 0x3041.
    For katakana: subtract 0x2521 and add 0x30A1.
    """
    if 0x2421 <= jis_code <= 0x2473:  # Hiragana
        return chr(jis_code - 0x2421 + 0x3041)
    elif 0x2521 <= jis_code <= 0x2576:  # Katakana
        return chr(jis_code - 0x2521 + 0x30A1)
    return None

# Global mappings between indices and characters
character_map = {}
reverse_character_map = {}
current_index = 0

def process_etl9g():
    global current_index

    dataset_images = []
    dataset_labels = []

    # Files expected to contain hiragana/katakana (e.g. ETL9G_33 to ETL9G_50)
    expected_files = [f'ETL9G_{i:02d}' for i in range(33, 51)]
    available_files = [f for f in os.listdir(ETL9G_PATH) if f.startswith('ETL9G_')]

    print(f"Expected files: {expected_files}")
    print(f"Available files: {available_files}")

    files = sorted(available_files)
    total_records = 0
    matched_records = 0

    for file_name in files:
        file_path = os.path.join(ETL9G_PATH, file_name)
        print(f"Processing {file_path}...")

        with open(file_path, 'rb') as f:
            record_count = 0
            while True:
                # Each record is 8199 bytes
                record_data = f.read(8199)
                if not record_data or len(record_data) < 8199:
                    break

                record_count += 1
                total_records += 1

                # The first 2 bytes store a raw code (big-endian unsigned short)
                raw_jis_code = struct.unpack('>H', record_data[0:2])[0]
                # Adjust the raw code by adding offset 0x2420 so that 0x0001 becomes 0x2421.
                adjusted_jis_code = raw_jis_code + 0x2420

                # Debug: print a few records
                if record_count <= 5 or record_count % 1000 == 0:
                    print(f"Record {record_count}: raw code: 0x{raw_jis_code:04x}, adjusted: 0x{adjusted_jis_code:04x}")

                # Skip record if adjusted code isn't in the target range
                if not is_target_char(adjusted_jis_code):
                    continue

                matched_records += 1

                # Convert the adjusted code to a Unicode character
                unicode_char = jis_to_unicode(adjusted_jis_code)
                if unicode_char is None:
                    continue

                # Create mapping if this is a new character
                if unicode_char not in reverse_character_map:
                    character_map[current_index] = unicode_char
                    reverse_character_map[unicode_char] = current_index
                    current_index += 1
                    print(f"Found new character: {unicode_char} (JIS: 0x{adjusted_jis_code:04x})")

                # Extract image data (128x127 pixels, 1 byte per pixel)
                img_data = record_data[2:2 + 128 * 127]
                img = np.frombuffer(img_data, dtype=np.uint8).reshape(127, 128)

                # Resize image to 64x64
                img = cv2.resize(img, (64, 64))
                # Invert colors and normalize to [0, 1]
                img = 255 - img
                img = img / 255.0

                # Save image to corresponding directory
                character_dir = os.path.join(OUTPUT_PATH, 'images', unicode_char)
                os.makedirs(character_dir, exist_ok=True)
                img_filename = f"{character_dir}/{len(os.listdir(character_dir))}.png"
                cv2.imwrite(img_filename, img * 255)

                # Append image and label to dataset
                dataset_images.append(img)
                dataset_labels.append(reverse_character_map[unicode_char])

            print(f"Processed {record_count} records from {file_name}")

    print(f"Total records processed: {total_records}")
    print(f"Matched hiragana/katakana records: {matched_records}")

    return np.array(dataset_images), np.array(dataset_labels)

def check_etl9g_directory():
    if not os.path.exists(ETL9G_PATH):
        print(f"ERROR: Directory {ETL9G_PATH} does not exist!")
        return False

    files = os.listdir(ETL9G_PATH)
    if not files:
        print(f"ERROR: Directory {ETL9G_PATH} is empty!")
        return False

    etl9g_files = [f for f in files if f.startswith('ETL9G_')]
    print(f"Found {len(etl9g_files)} ETL9G files: {etl9g_files}")
    return len(etl9g_files) > 0

def save_character_map():
    with open(os.path.join(OUTPUT_PATH, 'character_map.json'), 'w', encoding='utf-8') as f:
        json.dump(character_map, f, ensure_ascii=False, indent=2)
    with open(os.path.join(OUTPUT_PATH, 'reverse_character_map.json'), 'w', encoding='utf-8') as f:
        json.dump(reverse_character_map, f, ensure_ascii=False, indent=2)

def main():
    print("Checking ETL9G dataset directory...")
    if not check_etl9g_directory():
        print("ERROR: Cannot proceed without valid ETL9G dataset.")
        return 0

    print("Processing ETL9G dataset...")
    images, labels = process_etl9g()

    num_characters = len(character_map)
    print(f"Processed {len(images)} images across {num_characters} characters")

    if len(images) == 0:
        print("ERROR: No images were processed. Cannot create TFRecord files.")
        if num_characters > 0:
            save_character_map()
        return num_characters

    save_character_map()

    # Split data into training and validation sets
    X_train, X_val, y_train, y_val = train_test_split(
        images, labels, test_size=0.2, random_state=42, stratify=labels
    )

    # Define helper functions to create TFRecord features
    def _int64_feature(value):
        return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))

    def _bytes_feature(value):
        return tf.train.Feature(bytes_list=tf.train.BytesList(value=[value]))

    # Write training TFRecord file
    with tf.io.TFRecordWriter(os.path.join(OUTPUT_PATH, 'train.tfrecord')) as writer:
        for i in range(len(X_train)):
            image_raw = X_train[i].tobytes()
            feature = {
                'label': _int64_feature(y_train[i]),
                'image_raw': _bytes_feature(image_raw)
            }
            example = tf.train.Example(features=tf.train.Features(feature=feature))
            writer.write(example.SerializeToString())

    # Write validation TFRecord file
    with tf.io.TFRecordWriter(os.path.join(OUTPUT_PATH, 'val.tfrecord')) as writer:
        for i in range(len(X_val)):
            image_raw = X_val[i].tobytes()
            feature = {
                'label': _int64_feature(y_val[i]),
                'image_raw': _bytes_feature(image_raw)
            }
            example = tf.train.Example(features=tf.train.Features(feature=feature))
            writer.write(example.SerializeToString())

    print("Saved TFRecord files")
    print(f"Training set: {len(X_train)} images")
    print(f"Validation set: {len(X_val)} images")
    print(f"Character map saved to {os.path.join(OUTPUT_PATH, 'character_map.json')}")

    return num_characters

if __name__ == "__main__":
    num_classes = main()
    print(f"Total classes: {num_classes}")
