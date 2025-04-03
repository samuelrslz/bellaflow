from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Count
from .models import Customer, Service, Appointment, AppointmentService
from .serializers import CustomerSerializer, ServiceSerializer, AppointmentSerializer, AppointmentServiceSerializer

# Create your views here.
# Customer ViewSet
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.AllowAny]  # Allow any for now for testing

# Service ViewSet
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]   # Allow any for now for testing

# Appointment ViewSet
class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.AllowAny]  # Allow any for now for testing

    @action(detail=False, methods=['get'], url_path='customer/(?P<customer_id>[^/.]+)')
    def get_appointments_by_customer(self, request, customer_id=None):
        """Fetch appointments for a specific customer."""
        appointments = self.queryset.filter(customer_id=customer_id)
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

# AppointmentService ViewSet
class AppointmentServiceViewSet(viewsets.ModelViewSet):
    queryset = AppointmentService.objects.all()
    serializer_class = AppointmentServiceSerializer
    permission_classes = [permissions.AllowAny]   # Allow any for now for testing
