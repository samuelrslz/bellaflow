from django.contrib import admin
from .models import Customer, Service, Appointment, AppointmentService

# Register your models here.
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone_number', 'created_at')
    search_fields = ('first_name', 'last_name', 'email')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('service_name', 'price', 'duration')
    search_fields = ('service_name',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'appointment_date', 'appointment_time', 'status', 'total_price')
    list_filter = ('status', 'appointment_date')
    search_fields = ('customer__first_name', 'customer__last_name')

@admin.register(AppointmentService)
class AppointmentServiceAdmin(admin.ModelAdmin):
    list_display = ('appointment', 'service')
    search_fields = ('appointment__id', 'service__service_name')