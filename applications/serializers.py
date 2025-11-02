
from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    applicant = serializers.PrimaryKeyRelatedField(read_only=True)
    applied_at = serializers.DateTimeField(read_only=True)
    status = serializers.CharField(default='pending', required=False)
    resume = serializers.FileField(write_only=True, required=False)  # For file upload
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('resume_data', 'resume_filename', 'resume_content_type')  # These are set in create/update
    
    # Removed SerializerMethodFields - handled directly in to_representation for better performance
    # This avoids method call overhead for each serialized object
    
    def create(self, validated_data):
        """Handle file upload and convert to binary data"""
        resume_file = validated_data.pop('resume', None)
        application = super().create(validated_data)
        
        if resume_file:
            # Read file content and store as binary
            resume_file.seek(0)
            application.resume_data = resume_file.read()
            application.resume_filename = resume_file.name
            application.resume_content_type = resume_file.content_type if hasattr(resume_file, 'content_type') else 'application/pdf'
            application.save()
        
        return application
    
    def update(self, instance, validated_data):
        """Handle file upload update and convert to binary data"""
        resume_file = validated_data.pop('resume', None)
        application = super().update(instance, validated_data)
        
        if resume_file:
            # Read file content and store as binary
            resume_file.seek(0)
            application.resume_data = resume_file.read()
            application.resume_filename = resume_file.name
            application.resume_content_type = resume_file.content_type if hasattr(resume_file, 'content_type') else 'application/pdf'
            application.save()
        
        return application
    
    def to_representation(self, instance):
        """Ultra-optimized: build dict directly, skip heavy fields"""
        # Build dict directly - much faster than super().to_representation()
        # Exclude resume_data completely (only loaded for detail views)
        representation = {
            'id': instance.id,
            'applicant': instance.applicant_id,
            'applied_at': instance.applied_at.isoformat() if instance.applied_at else None,
            'status': instance.status,
            'cover_letter': instance.cover_letter,
            'updated_at': instance.updated_at.isoformat() if instance.updated_at else None,
            'resume_filename': instance.resume_filename,
            'resume_content_type': instance.resume_content_type,
            'has_resume': bool(instance.resume_filename),
        }
        
        # Job details (already fetched via select_related - very fast)
        if instance.job:
            representation['job'] = {
                'id': instance.job.id,
                'title': instance.job.title,
                'location': instance.job.location,
                'salary': str(instance.job.salary),
                'posted_at': instance.job.posted_at.isoformat() if instance.job.posted_at else None,
                'employer': instance.job.employer_id,
            }
        else:
            representation['job'] = None
        
        # Applicant details (already fetched via select_related - very fast)
        if instance.applicant:
            representation['applicant_detail'] = {
                'id': instance.applicant.id,
                'email': instance.applicant.email,
                'full_name': getattr(instance.applicant, 'full_name', None) or '',
            }
        else:
            representation['applicant_detail'] = None
        
        # Resume URL - generate for detail views, skip for list views
        # Check if this is a detail view by checking if resume_data is loaded
        # In list views, resume_data is deferred, so hasattr will be True but value is None
        # In retrieve/update views, resume_data is loaded
        try:
            # Try to access resume_data to see if it's loaded
            # If deferred, this will trigger a query, but only for detail views
            resume_data_value = getattr(instance, 'resume_data', None)
            if resume_data_value is not None:
                # Resume data is loaded - generate URL
                if instance.resume:
                    representation['resume_url'] = instance.resume.url
                else:
                    representation['resume_url'] = None
            else:
                # Resume data not loaded (deferred in list views) or doesn't exist
                representation['resume_url'] = None
        except Exception as e:
            # Error accessing resume_data - return None
            representation['resume_url'] = None
        
        return representation
