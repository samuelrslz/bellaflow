from django.urls import path
from .views import LoginView, LogoutView, CurrentUserView, test_view

urlpatterns = [
    path('management/login/', LoginView.as_view(), name='login'),  
    path('management/logout/', LogoutView.as_view(), name='logout'),
    path('management/user/', CurrentUserView.as_view(), name='current_user'),
    path('management/test/', test_view, name='test'),
]