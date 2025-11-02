
from rest_framework import viewsets
from .models import Application
from .serializers import ApplicationSerializer
from jobs.permissions import IsApplicationOwnerOrJobOwner

class ApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing job applications.
    
    Permissions:
    - Only authenticated applicants can create applications (POST)
    - Applicants can view/update/delete only their own applications (GET, PUT, PATCH, DELETE)
    - Employers can view applications submitted to their job postings (GET only)
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsApplicationOwnerOrJobOwner]

    def get_serializer_context(self):
        """Add request to serializer context"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_object(self):
        """
        Override to ensure resume_data is loaded for detail views.
        """
        # Get object from queryset (which may have deferred resume_data for list views)
        obj = super().get_object()
        # For retrieve/update/partial_update, reload without defer to get resume_data
        if self.action in ['retrieve', 'update', 'partial_update']:
            # Get fresh object with all fields loaded (not deferred)
            obj = Application.objects.select_related('job', 'applicant', 'job__employer').get(pk=obj.pk)
        return obj

    def get_queryset(self):
        """
        Filter queryset based on user role:
        - Applicants see only their own applications
        - Employers see applications for their jobs
        - Superusers see all applications
        """
        user = self.request.user
        
        if not user.is_authenticated:
            return Application.objects.none()
        
        # Use select_related to optimize queries and prevent N+1 problem
        queryset = Application.objects.select_related('job', 'applicant', 'job__employer')
        
        # For list views, defer resume_data to avoid loading huge binary data
        # For retrieve (detail) views, include resume_data so resume can be viewed
        if self.action == 'list':
            queryset = queryset.defer('resume_data')
        # For retrieve/update/partial_update actions, ensure resume_data is loaded
        
        # Superusers can see all applications
        if user.is_superuser:
            return queryset.all()
        
        # Applicants see only their own applications
        if user.is_applicant:
            return queryset.filter(applicant=user)
        
        # Employers see applications for their jobs
        if user.is_employer:
            return queryset.filter(job__employer=user)
        
        return Application.objects.none()

    def perform_create(self, serializer):
        """
        Automatically assign the current user as the applicant when creating an application.
        Only applicants can reach this point due to permission checks.
        """
        applicant = self.request.user
        job = serializer.validated_data['job']
        
        # Check if user has already applied to this job
        if Application.objects.filter(applicant=applicant, job=job).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'job': 'You have already applied to this job.'})
        
        serializer.save(applicant=applicant, status='pending')
    
    def perform_update(self, serializer):
        """
        Handle update operations - allow employers to update status only.
        """
        user = self.request.user
        application = serializer.instance
        
        # If employer is updating, only allow status field updates
        if user.is_employer and application.job.employer == user:
            # Employers can only update status field
            validated_data = serializer.validated_data
            
            # Get only the status field from validated_data
            # Filter out other fields that might be in the request
            if 'status' in validated_data:
                application.status = validated_data['status']
                application.save()
            else:
                # No status in request, don't update
                from rest_framework.exceptions import ValidationError
                raise ValidationError({
                    'status': 'Status field is required for updates.'
                })
        else:
            # Applicants can update their own applications (all fields except applicant)
            serializer.save()
