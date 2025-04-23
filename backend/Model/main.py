import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping

# Define paths
train_dir = r"A:\Others\SDP-SPRING 2025\Project Notes\plantvillage dataset\color\train"
test_dir = r"A:\Others\SDP-SPRING 2025\Project Notes\plantvillage dataset\color\test"

# Image Preprocessing
batch_size = 16  # Adjusted batch size
target_size = (128, 128)  # Adjust image size as needed
datagen = ImageDataGenerator(rescale=1.0/255)

# Load training data
train_data = datagen.flow_from_directory(
    train_dir,
    target_size=target_size,
    batch_size=batch_size,
    class_mode='categorical'
)

# Load test data
test_data = datagen.flow_from_directory(
    test_dir,
    target_size=target_size,
    batch_size=batch_size,
    class_mode='categorical'
)

# Model Architecture
model = tf.keras.models.Sequential([
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(target_size[0], target_size[1], 3)),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(len(train_data.class_indices), activation='softmax')  # Output layer
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Calculate steps per epoch
steps_per_epoch = len(train_data) // batch_size
validation_steps = len(test_data) // batch_size

# Implement Early Stopping
early_stopping = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)

# Train the model
model.fit(
    train_data,
    validation_data=test_data,
    epochs=10,
    steps_per_epoch=steps_per_epoch,
    validation_steps=validation_steps,
    callbacks=[early_stopping]
)

# Save the model in the native Keras format
model.save("image_classifier.keras")  # Use the .keras extension
