from django.db import models

class DiseaseSolution(models.Model):
    label = models.CharField(max_length=100, unique=True)  # e.g., "Apple___Black_rot"
    solution = models.TextField()

    def __str__(self):
        return self.label
