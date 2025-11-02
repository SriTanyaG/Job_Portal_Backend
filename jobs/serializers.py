
from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    employer = serializers.PrimaryKeyRelatedField(read_only=True)
    posted_at = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Job
        fields = '__all__'
