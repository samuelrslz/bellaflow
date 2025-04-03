from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED
from .serializers import CustomUserSerializer, LoginSerializer
from django.http import JsonResponse


def test_view(request):
    return JsonResponse({"message": "Test endpoint works!"})

# Create your views here.
class LoginView(APIView):
    permission_classes = [AllowAny]  # Allows unauthenticated access for login

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': CustomUserSerializer(user).data
            }, status=HTTP_200_OK)
        else:
            return Response({'error': 'Invalid username or password'}, status=HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
   permission_classes = [IsAuthenticated]


   def post(self, request):
       request.auth.delete() 
       return Response({'message': 'Logged out successfully'}, status=200)


class LogoutView(APIView):
   permission_classes = [IsAuthenticated]


   def post(self, request):
       request.auth.delete() 
       return Response({'message': 'Logged out successfully'}, status=HTTP_200_OK)


class CurrentUserView(APIView):
   permission_classes = [IsAuthenticated]


   def get(self, request):
       return Response(CustomUserSerializer(request.user).data, status=HTTP_200_OK)


