from rest_framework import serializers
from .models import Plant, Disease, Solution, DetectionHistoryModel


class SolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solution
        fields = [
            'id',
            'solution_text',
            'treatment_type',
            'product_name',
            'application_instructions',
            'video_url',
            'created_at',
            'updated_at'
        ]


class DiseaseSerializer(serializers.ModelSerializer):
    plant_name = serializers.CharField(source='plant.name', read_only=True)
    solutions = SolutionSerializer(many=True, read_only=True)

    class Meta:
        model = Disease
        fields = [
            'id',
            'plant',
            'plant_name',
            'name',
            'symptoms',
            'image',
            'solutions'
        ]


class PlantSerializer(serializers.ModelSerializer):
    diseases = DiseaseSerializer(many=True, read_only=True)

    class Meta:
        model = Plant
        fields = [
            'id',
            'name',
            'diseases'
        ]


class DetectionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectionHistoryModel
        fields = [
            'id',
            'user',
            'label',
            'confidence',
            'image',
            'plant_name',
            'disease_name',
            'detected_at'
        ]
        read_only_fields = ['user', 'detected_at']