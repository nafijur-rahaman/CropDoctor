import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import os

# Paths to your dataset folders
train_dir = r"E:\SDP-2025\Dataset\plantvillage dataset\color\train"
test_dir = r"E:\SDP-2025\Dataset\plantvillage dataset\color\test"

# Parameters
batch_size = 32
img_height, img_width = 128, 128
num_epochs_initial = 10
num_epochs_finetune = 10

# Data augmentation for training set
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.15,
    zoom_range=0.15,
    horizontal_flip=True,
    fill_mode='nearest'
)

# For validation/test data, only rescaling
val_datagen = ImageDataGenerator(rescale=1./255)

# Load data
train_data = train_datagen.flow_from_directory(
    train_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='categorical'
)

val_data = val_datagen.flow_from_directory(
    test_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='categorical'
)

# Load MobileNetV2 as base model (without top)
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(img_height, img_width, 3),
    include_top=False,
    weights='imagenet'
)

# Freeze the base model initially
base_model.trainable = False

# Build your model on top of base_model
inputs = tf.keras.Input(shape=(img_height, img_width, 3))
x = base_model(inputs, training=False)
x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.Dropout(0.3)(x)
outputs = tf.keras.layers.Dense(len(train_data.class_indices), activation='softmax')(x)

model = tf.keras.Model(inputs, outputs)

# Compile initial model
model.compile(
    optimizer=tf.keras.optimizers.Adam(),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Callbacks
early_stopping = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=2, min_lr=1e-6)

# Train top layers only
history = model.fit(
    train_data,
    validation_data=val_data,
    epochs=num_epochs_initial,
    callbacks=[early_stopping, reduce_lr]
)

# Unfreeze some layers in base_model for fine-tuning
base_model.trainable = True

# Freeze all layers except last 50 (you can tune this number)
for layer in base_model.layers[:-50]:
    layer.trainable = False

# Re-compile with a lower learning rate
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Fine-tune the model
history_finetune = model.fit(
    train_data,
    validation_data=val_data,
    epochs=num_epochs_finetune,
    callbacks=[early_stopping, reduce_lr]
)

# Save the fine-tuned model
model.save("image_classifier_mobilenetv2_finetuned.keras")
