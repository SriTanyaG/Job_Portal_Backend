from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'is_employer', 'is_applicant')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            is_employer=validated_data.get('is_employer', False),
            is_applicant=validated_data.get('is_applicant', False)
        )
        return user


class RegisterRequestSerializer(serializers.Serializer):
    """Serializer for user registration request"""
    email = serializers.EmailField(required=True, help_text="User's email address")
    password = serializers.CharField(required=True, write_only=True, help_text="User's password")
    is_employer = serializers.BooleanField(required=False, default=False, help_text="Register as employer")
    is_applicant = serializers.BooleanField(required=False, help_text="Register as applicant (defaults to True if not employer)")


class RegisterResponseSerializer(serializers.Serializer):
    """Serializer for user registration response"""
    message = serializers.CharField()
    user_id = serializers.IntegerField()
    email = serializers.EmailField()
    role = serializers.ListField(child=serializers.CharField())


class LoginRequestSerializer(serializers.Serializer):
    """Serializer for user login request"""
    email = serializers.EmailField(required=True, help_text="User's email address")
    password = serializers.CharField(required=True, write_only=True, help_text="User's password")


class LoginResponseSerializer(serializers.Serializer):
    """Serializer for user login response"""
    message = serializers.CharField()
    user_id = serializers.IntegerField()
    email = serializers.EmailField()
    role = serializers.ListField(child=serializers.CharField())
