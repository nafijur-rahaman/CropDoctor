# Generated by Django 5.2.1 on 2025-05-17 15:53

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crop_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Disease',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('symptoms', models.TextField(help_text='Describe common symptoms of the disease.')),
                ('image', models.ImageField(blank=True, null=True, upload_to='disease_images/')),
            ],
            options={
                'verbose_name': 'Disease',
                'verbose_name_plural': 'Diseases',
            },
        ),
        migrations.CreateModel(
            name='Plant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
            options={
                'verbose_name': 'Plant',
                'verbose_name_plural': 'Plants',
            },
        ),
        migrations.CreateModel(
            name='Solution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('solution_text', models.TextField(help_text='Practical treatment or preventive advice.')),
                ('treatment_type', models.CharField(choices=[('organic', 'Organic'), ('chemical', 'Chemical'), ('preventive', 'Preventive')], max_length=100)),
                ('product_name', models.CharField(blank=True, help_text="Optional product name, e.g., 'Mancozeb'", max_length=100, null=True)),
                ('application_instructions', models.TextField(blank=True, help_text='How to use the product or solution.', null=True)),
                ('video_url', models.URLField(blank=True, help_text='Link to video explanation or tutorial.', null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Solution',
                'verbose_name_plural': 'Solutions',
            },
        ),
        migrations.DeleteModel(
            name='DiseaseSolution',
        ),
        migrations.AddField(
            model_name='disease',
            name='plant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='diseases', to='crop_api.plant'),
        ),
        migrations.AddField(
            model_name='solution',
            name='disease',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='solutions', to='crop_api.disease'),
        ),
        migrations.AlterUniqueTogether(
            name='disease',
            unique_together={('plant', 'name')},
        ),
    ]
