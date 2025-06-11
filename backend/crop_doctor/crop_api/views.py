from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import json
import os
from django.conf import settings
from rest_framework import status
from rest_framework import generics
from .models import Plant, Disease, Solution,DetectionHistoryModel
from .serializers import PlantSerializer, DiseaseSerializer, SolutionSerializer,DetectionHistorySerializer



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

    model = None
    index_to_label = None

    def load_model_and_labels(self):
        if self.model is None:


            MODEL_PATH = os.path.join(settings.BASE_DIR, 'models', 'image_classifier_mobilenetv2_finetuned.keras')
            JSON_PATH = os.path.join(settings.BASE_DIR, 'models', 'class_indices.json')

            self.model = load_model(MODEL_PATH)
            with open(JSON_PATH) as f:
                class_indices = json.load(f)
            self.index_to_label = {v: k for k, v in class_indices.items()}

    def post(self, request):
        self.load_model_and_labels()  # Load model at first request

        file_obj = request.FILES.get('image')
        if not file_obj:
            return Response({"error": "No image provided"}, status=400)

        try:
            image = Image.open(file_obj).resize((128, 128)).convert("RGB")
        except Exception as e:
            return Response({"error": f"Invalid image file: {str(e)}"}, status=400)

        img_array = np.array(image) / 255.0
        img_array = img_array.reshape(1, 128, 128, 3)

        prediction = self.model.predict(img_array)
        predicted_class = int(np.argmax(prediction))
        confidence = float(np.max(prediction)) * 100
        label = self.index_to_label.get(predicted_class, "Unknown")

        plant_name, disease_name = parse_label(label)

        disease_data = {
            "label": label,
            "confidence": round(confidence, 2),
            "plant_name": plant_name,
            "disease_name": disease_name,
            "solutions": []
        }

        # If disease is healthy, skip DB query and return custom message
        if disease_name.strip().lower() == "healthy":
            disease_data["solutions"].append({
                "solution_text": f"The {plant_name} plant appears to be healthy. Keep monitoring and maintain good care!",
                "treatment_type": "none",
                "product_name": None,
                "application_instructions": None,
                "video_url": None,
            })
            return Response(disease_data)

        # For non-healthy diseases, query DB for treatment info
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
            disease_data["solutions"].append({
                "solution_text": "No treatment found in database.",
                "treatment_type": None,
                "product_name": None,
                "application_instructions": None,
                "video_url": None,
            })

        return Response(disease_data)



class SaveDetectionHistoryView(APIView):

    def post(self, request):
        user = request.user
        label = request.data.get('label')
        confidence = request.data.get('confidence')
        image = request.FILES.get('image')
        plant_name = request.data.get('plant_name')
        disease_name = request.data.get('disease_name')

        if not all([label, confidence, image, plant_name, disease_name]):
            return Response({
                "success": False,
                "message": "All fields are required",
                }, status=status.HTTP_400_BAD_REQUEST)

        detection_history = DetectionHistoryModel.objects.create(
            user=user,
            label=label,
            confidence=confidence,
            image=image,
            plant_name=plant_name,
            disease_name=disease_name
        )

        serializer = DetectionHistorySerializer(detection_history)
        return Response(
            {
                "success": True,
                "message": "Detection history saved successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED
        )




class GetDetectionHistoryView(APIView):
    
    def get(self, request):
        user = request.user
        history = DetectionHistoryModel.objects.filter(user=user).order_by('-detected_at')
        serializer = DetectionHistorySerializer(history, many=True)
        return Response({
            "success": True,
            "data": serializer.data
            
        }, status=status.HTTP_200_OK)

    def delete(self, request):
        id= request.query_params.get('id')
        if id:
            try:
                detection_history = DetectionHistoryModel.objects.get(id=id, user=request.user)
                detection_history.delete()
                return Response({
                    "success": True,
                    "message": "Detection history deleted successfully"
                }, status=status.HTTP_204_NO_CONTENT)
            except DetectionHistoryModel.DoesNotExist:
                return Response({
                    "success": False,
                    "message": "Detection history not found"
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({
                "success": False,
                "message": "ID parameter is required"
            }, status=status.HTTP_400_BAD_REQUEST)
            
            
            
class GetDetectionHistoryByIdView(APIView):
    def get(self, request, id):
        try:
            detection_history = DetectionHistoryModel.objects.get(id=id, user=request.user)
            serializer = DetectionHistorySerializer(detection_history)
            return Response({
                "success": True,
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except DetectionHistoryModel.DoesNotExist:
            return Response({
                "success": False,
                "message": "Detection history not found"
            }, status=status.HTTP_404_NOT_FOUND)
            