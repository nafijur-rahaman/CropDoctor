from django.db import models
from django.utils import timezone


class Plant(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Plant"
        verbose_name_plural = "Plants"

    def __str__(self):
        return self.name


class Disease(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name='diseases')
    name = models.CharField(max_length=150)
    symptoms = models.TextField(help_text="Describe common symptoms of the disease.")
    image = models.ImageField(upload_to='disease_images/', blank=True, null=True)

    class Meta:
        unique_together = ('plant', 'name')
        verbose_name = "Disease"
        verbose_name_plural = "Diseases"

    def __str__(self):
        return f"{self.plant.name} - {self.name}"


class Solution(models.Model):
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name='solutions')
    solution_text = models.TextField(help_text="Practical treatment or preventive advice.")
    treatment_type = models.CharField(max_length=100, choices=[
        ('organic', 'Organic'),
        ('chemical', 'Chemical'),
        ('preventive', 'Preventive'),
    ])
    product_name = models.CharField(max_length=100, blank=True, null=True, help_text="Optional product name, e.g., 'Mancozeb'")
    application_instructions = models.TextField(blank=True, null=True, help_text="How to use the product or solution.")
    video_url = models.URLField(blank=True, null=True, help_text="Link to video explanation or tutorial.")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Solution"
        verbose_name_plural = "Solutions"

    def __str__(self):
        return f"Solution for {self.disease.name} ({self.treatment_type})"
