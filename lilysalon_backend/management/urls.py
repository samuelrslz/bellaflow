from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, ServiceViewSet, AppointmentViewSet, AppointmentServiceViewSet

# Create a router and register the viewsets
router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'appointment-services', AppointmentServiceViewSet)

# Define the URL patterns
urlpatterns = [
    path('', include(router.urls)),
]