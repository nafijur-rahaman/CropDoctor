from django.contrib import admin
from .models import Plant, Disease, Solution, DetectionHistoryModel

admin.site.register(Plant)
admin.site.register(Disease)
admin.site.register(Solution)
admin.site.register(DetectionHistoryModel)
