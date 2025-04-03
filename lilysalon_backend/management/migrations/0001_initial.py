# Generated by Django 5.1.5 on 2025-02-01 00:54

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('phone_number', models.CharField(max_length=15, validators=[django.core.validators.MinLengthValidator(10)])),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('service_name', models.CharField(max_length=100, unique=True)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=8)),
                ('duration', models.PositiveIntegerField(help_text='Duration in minutes')),
            ],
        ),
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('appointment_date', models.DateField()),
                ('appointment_time', models.TimeField()),
                ('status', models.CharField(choices=[('scheduled', 'Scheduled'), ('completed', 'Completed'), ('canceled', 'Canceled')], default='scheduled', max_length=10)),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=8)),
                ('employee_assigned', models.CharField(max_length=100)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointments', to='management.customer')),
            ],
        ),
        migrations.CreateModel(
            name='AppointmentService',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('appointment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointment_services', to='management.appointment')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointment_services', to='management.service')),
            ],
        ),
    ]
