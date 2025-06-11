from django.urls import path
from .views import PredictDiseaseView,PlantListView, DiseaseListView, DiseaseDetailView, SolutionListView,GetDetectionHistoryByIdView,GetDetectionHistoryView, SaveDetectionHistoryView


urlpatterns = [
    path("predict/", PredictDiseaseView.as_view(), name="predict-disease"),
    path('plants/', PlantListView.as_view(), name='plant-list'),
    path('diseases/', DiseaseListView.as_view(), name='disease-list'),
    path('diseases/<int:id>/', DiseaseDetailView.as_view(), name='disease-detail'),
    path('solutions/', SolutionListView.as_view(), name='solution-list'),
    
    path('detection-history/', GetDetectionHistoryView.as_view(), name='detection-history'),
    path('detection-history/<int:id>/', GetDetectionHistoryByIdView.as_view(), name='detection-history-by-id'),
    path('save-detection-history/', SaveDetectionHistoryView.as_view(), name='save-detection-history'),
    
]
