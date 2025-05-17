from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import json
import os
from django.conf import settings
from rest_framework import generics
from .models import Plant, Disease, Solution
from .serializers import PlantSerializer, DiseaseSerializer, SolutionSerializer


# List all plants and their diseases
class PlantListView(generics.ListAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer


# List all diseases (flat list)
class DiseaseListView(generics.ListAPIView):
    queryset = Disease.objects.select_related('plant').prefetch_related('solutions').all()
    serializer_class = DiseaseSerializer


# Detail view for a disease (includes solutions)
class DiseaseDetailView(generics.RetrieveAPIView):
    queryset = Disease.objects.prefetch_related('solutions').all()
    serializer_class = DiseaseSerializer
    lookup_field = 'id'


# List all solutions (optional)
class SolutionListView(generics.ListAPIView):
    queryset = Solution.objects.select_related('disease').all()
    serializer_class = SolutionSerializer



MODEL_PATH = os.path.join(settings.BASE_DIR, 'models', 'image_classifier_mobilenetv2_finetuned.keras')
JSON_PATH = os.path.join(settings.BASE_DIR, 'models', 'class_indices.json')

model = load_model(MODEL_PATH)
with open(JSON_PATH) as f:
    class_indices = json.load(f)
index_to_label = {v: k for k, v in class_indices.items()}

MULTI_WORD_PLANTS = {
    "Pepper bell",
    "Tomato",
    "Apple",
    "Corn",
    "Grape",
    "Blueberry",
    "Cherry",
    "Orange",
    "Peach",
    "Potato",
    "Raspberry",
    "Soybean",
    "Squash",
    "Strawberry"
}

def parse_label(label):
    words = label.split()
    if len(words) >= 2 and " ".join(words[:2]) in MULTI_WORD_PLANTS:
        plant_name = " ".join(words[:2])
        disease_name = " ".join(words[2:])
    else:
        plant_name = words[0]
        disease_name = " ".join(words[1:])
    return plant_name, disease_name

class PredictDiseaseView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        file_obj = request.FILES.get('image')
        if not file_obj:
            return Response({"error": "No image provided"}, status=400)

        try:
            image = Image.open(file_obj).resize((128, 128)).convert("RGB")
        except Exception as e:
            return Response({"error": f"Invalid image file: {str(e)}"}, status=400)

        img_array = np.array(image) / 255.0
        img_array = img_array.reshape(1, 128, 128, 3)

        prediction = model.predict(img_array)
        predicted_class = int(np.argmax(prediction))
        confidence = float(np.max(prediction)) * 100
        label = index_to_label.get(predicted_class, "Unknown")

        plant_name, disease_name = parse_label(label)

        disease_data = {
            "label": label,
            "confidence": round(confidence, 2),
            "plant_name": plant_name,
            "disease_name": disease_name,
            "solutions": []
        }

        try:
            disease_obj = Disease.objects.select_related('plant').prefetch_related('solutions').get(
                plant__name__iexact=plant_name,
                name__iexact=disease_name
            )
            for sol in disease_obj.solutions.all():
                disease_data["solutions"].append({
                    "treatment_type": sol.treatment_type,
                    "solution_text": sol.solution_text,
                    "product_name": sol.product_name,
                    "application_instructions": sol.application_instructions,
                    "video_url": sol.video_url,
                })
        except Disease.DoesNotExist:
            disease_data["solutions"].append({"solution_text": "No treatment found in database."})

        return Response(disease_data)