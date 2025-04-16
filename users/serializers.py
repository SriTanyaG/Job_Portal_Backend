
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
from rest_framework import serializers
from .models import User
from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']  # Don't expose role fields here

    def create(self, validated_data):
        request = self.context.get('request')
        user = User(
            email=validated_data['email'],
            is_employer=True,  # Automatically mark as employer
            is_applicant=False
        )
        user.set_password(validated_data['password'])

        # If the request is made by admin/superuser (staff user)
        if request and request.user and request.user.is_staff:
            # Let admin decide roles via validated_data if needed
            user.is_employer = validated_data.get('is_employer', False)
            user.is_applicant = validated_data.get('is_applicant', False)

        user.save()
        return user

