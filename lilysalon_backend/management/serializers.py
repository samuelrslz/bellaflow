from rest_framework import serializers
from .models import Customer, Service, Appointment, AppointmentService

# Customer Serializer
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'phone_number', 'email', 'created_at']

# Service Serializer
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'service_name', 'description', 'price', 'duration']

class AppointmentSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)  # Include full customer details in the response
    customer_id = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all(), write_only=True, source='customer')  # Allow writing customer ID
    services = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all(), many=True, write_only=True)  # Allow writing service IDs
    services_details = serializers.SerializerMethodField(read_only=True)  # Include services in the response

    class Meta:
        model = Appointment
        fields = ['id', 'customer', 'customer_id', 'appointment_date', 'appointment_time', 'status', 'total_price', 'employee_assigned', 'services', 'services_details']

    def get_services_details(self, obj):
        # Get all services associated with this appointment
        appointment_services = obj.appointment_services.all()
        services = [appointment_service.service for appointment_service in appointment_services]
        return ServiceSerializer(services, many=True).data

    def create(self, validated_data):
        services_data = validated_data.pop('services', [])
        appointment = Appointment.objects.create(**validated_data)
        for service in services_data:
            AppointmentService.objects.create(appointment=appointment, service=service)
        return appointment

    def update(self, instance, validated_data):
        services_data = validated_data.pop('services', [])
        instance = super().update(instance, validated_data)
        
        # Clear existing services and add new ones
        instance.appointment_services.all().delete()
        for service in services_data:
            AppointmentService.objects.create(appointment=instance, service=service)
        
        return instance
    
# AppointmentService Serializer
class AppointmentServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentService
        fields = ['id', 'appointment', 'service']