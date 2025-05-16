from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import json
import os
from django.conf import settings
from .models import DiseaseSolution


# Path to the model and class indices
MODEL_PATH = os.path.join(settings.BASE_DIR, 'models', 'image_classifier.keras')
JSON_PATH = os.path.join(settings.BASE_DIR, 'models', 'class_indices.json')

# Load the model and label map
model = load_model(MODEL_PATH)
with open(JSON_PATH) as f:
    class_indices = json.load(f)

# Reverse the dictionary to map index to label
index_to_label = {v: k for k, v in class_indices.items()}

# Example solutions
disease_solutions = {
    "Apple___Black_rot": "Remove affected leaves. Use fungicides like Captan or Mancozeb.",
    "Apple___healthy": "No treatment needed. The plant is healthy.",
    # Add more disease names and solutions...
}

class PredictDiseaseView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        file_obj = request.FILES['image']
        image = Image.open(file_obj).resize((128, 128)).convert("RGB")
        img_array = np.array(image) / 255.0
        img_array = img_array.reshape(1, 128, 128, 3)

        prediction = model.predict(img_array)
        predicted_class = int(np.argmax(prediction))
        label = index_to_label[predicted_class]
        confidence = float(np.max(prediction)) * 100

        # Fetch solution from DB
        try:
            solution_obj = DiseaseSolution.objects.get(label=label)
            solution = solution_obj.solution
        except DiseaseSolution.DoesNotExist:
            solution = "Solution not found."

        return Response({
            "label": label,
            "confidence": round(confidence, 2),
            "solution": solution
        })