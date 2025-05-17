from django.urls import path
from .views import PredictDiseaseView,PlantListView, DiseaseListView, DiseaseDetailView, SolutionListView


urlpatterns = [
    path("predict/", PredictDiseaseView.as_view(), name="predict-disease"),
    path('plants/', PlantListView.as_view(), name='plant-list'),
    path('diseases/', DiseaseListView.as_view(), name='disease-list'),
    path('diseases/<int:id>/', DiseaseDetailView.as_view(), name='disease-detail'),
    path('solutions/', SolutionListView.as_view(), name='solution-list'),
]
