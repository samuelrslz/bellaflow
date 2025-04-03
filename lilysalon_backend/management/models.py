from django.db import models
from django.core.validators import MinLengthValidator

# Create your models here.

# Customers Model
class Customer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15, validators=[MinLengthValidator(10)])
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    

# Services Model
class Service(models.Model):
    service_name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")

    def __str__(self):
        return f"{self.service_name}"
    

# Appointment Model
class Appointment(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='scheduled')
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    employee_assigned = models.CharField(max_length=100) # Could be FK to a User model in the future

    def __str__(self):
        return f"Appointment #{self.id} - {self.customer.first_name} {self.customer.last_name}"
    
# Modelf for Many-to-Many Relationship between Appointments and Services
class AppointmentService(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name="appointment_services")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='appointment_services')

    def __str__(self):
        return f"{self.appointment} - {self.service}"