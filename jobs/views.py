
from rest_framework import viewsets
from .models import Job
from .serializers import JobSerializer
from .permissions import IsJobOwnerOrReadOnly

class JobViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing job postings.
    
    Permissions:
    - Anyone (authenticated or not) can view/list jobs (GET, HEAD, OPTIONS)
    - Only authenticated employers can create jobs (POST)
    - Only job owners (employers who created the job) can update/delete their jobs (PUT, PATCH, DELETE)
    """
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsJobOwnerOrReadOnly]

    def get_queryset(self):
        """Optimize queryset with select_related and support server-side filtering"""
        queryset = Job.objects.select_related('employer').all()
        
        # Server-side filter: ?employer=<id> — so Dashboard doesn't fetch ALL jobs
        employer_id = self.request.query_params.get('employer')
        if employer_id:
            queryset = queryset.filter(employer_id=employer_id)
        
        return queryset

    def perform_create(self, serializer):
        """
        Automatically assign the current user as the employer when creating a job.
        Only employers can reach this point due to permission checks.
        """
        serializer.save(employer=self.request.user)
