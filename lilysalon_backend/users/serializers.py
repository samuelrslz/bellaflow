from rest_framework import serializers
from django.contrib.auth import get_user_model


User = get_user_model()


class CustomUserSerializer(serializers.ModelSerializer):
   class Meta:
       model = User
       fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']


class LoginSerializer(serializers.Serializer):
   username = serializers.CharField()
   password = serializers.CharField()