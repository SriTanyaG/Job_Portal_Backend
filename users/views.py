from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import (
    RegisterRequestSerializer, 
    RegisterResponseSerializer,
    LoginRequestSerializer,
    LoginResponseSerializer
)

User = get_user_model()

class RegisterView(APIView):
    """
    Register a new user with role selection (employer or applicant).
    
    Register a new user account. Users can specify whether they want to register
    as an employer, applicant, or both roles.
    """
    
    @swagger_auto_schema(
        request_body=RegisterRequestSerializer,
        responses={
            201: RegisterResponseSerializer,
            400: openapi.Response('Bad Request - Validation Error')
        },
        operation_description="Register a new user with role selection (employer or applicant)",
        operation_summary="Register new user"
    )
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        is_employer = request.data.get('is_employer', False)
        is_applicant = request.data.get('is_applicant', None)
        
        # Validation
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'}, 
                status=400
            )
        
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'User with this email already exists'}, 
                status=400
            )
        
        # If is_applicant is not specified, set it based on is_employer
        # Default behavior: if not an employer, then they're an applicant
        if is_applicant is None:
            is_applicant = not is_employer
        
        # Create user with specified role
        user = User.objects.create_user(
            email=email,
            password=password,
            is_employer=bool(is_employer),
            is_applicant=bool(is_applicant)
        )
        
        role = []
        if user.is_employer:
            role.append('employer')
        if user.is_applicant:
            role.append('applicant')
        
        return Response({
            'message': 'User created successfully',
            'user_id': user.id,
            'email': user.email,
            'role': role
        }, status=201)


class LoginView(APIView):
    """
    Authenticate a user and return login status.
    
    Authenticate a user with their email and password. Returns user information
    including their role(s) upon successful authentication.
    """
    
    @swagger_auto_schema(
        request_body=LoginRequestSerializer,
        responses={
            200: LoginResponseSerializer,
            400: openapi.Response('Bad Request - Missing email or password'),
            401: openapi.Response('Unauthorized - Invalid credentials')
        },
        operation_description="Authenticate a user and return login status with user information",
        operation_summary="User login"
    )
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'}, 
                status=400
            )
        
        user = authenticate(request, email=email, password=password)
        
        if user:
            role = []
            if user.is_employer:
                role.append('employer')
            if user.is_applicant:
                role.append('applicant')
            
            return Response({
                'message': 'Login successful',
                'user_id': user.id,
                'email': user.email,
                'role': role
            }, status=200)
        
        return Response(
            {'error': 'Invalid email or password'}, 
            status=401
        )
