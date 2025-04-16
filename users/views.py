from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'User already exists'}, status=400)
        User.objects.create_user(email=email, password=password)
        return Response({'message': 'User created successfully'}, status=201)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user:
            return Response({'message': 'Login successful'}, status=200)
        return Response({'error': 'Invalid credentials'}, status=401)
from rest_framework import generics
from .serializers import RegisterSerializer
from .models import User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
