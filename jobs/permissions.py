from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsEmployer(BasePermission):
    """
    Allows access only to authenticated users who are employers or superusers.
    Employers can create jobs and manage their own job postings.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_superuser or request.user.is_employer


class IsApplicant(BasePermission):
    """
    Allows access only to authenticated users who are applicants or superusers.
    Applicants can create applications and manage their own applications.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_superuser or request.user.is_applicant


class IsJobOwnerOrReadOnly(BasePermission):
    """
    Allows read access to anyone (authenticated or not) for job listings.
    Allows write access (create, update, delete) only to:
    - Employers for creating jobs
    - Job owners for updating/deleting their own jobs
    - Superusers for all operations
    """
    
    def has_permission(self, request, view):
        # Allow read operations (GET, HEAD, OPTIONS) to anyone
        if request.method in SAFE_METHODS:
            return True
        
        # Write operations require authentication
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Only employers can create jobs
        if request.method == 'POST':
            return request.user.is_employer
        
        # For update/delete, check object ownership
        return True  # Will be checked in has_object_permission
    
    def has_object_permission(self, request, view, obj):
        # Allow read access to anyone
        if request.method in SAFE_METHODS:
            return True
        
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # Only the job owner (employer) can update/delete their own jobs
        return obj.employer == request.user


class IsApplicationOwnerOrJobOwner(BasePermission):
    """
    Application permissions:
    - CREATE: Only applicants can create applications
    - READ: Applicants can see their own applications, employers can see applications for their jobs
    - UPDATE/DELETE: Only applicants can update/delete their own applications (within time limits)
    """
    
    def has_permission(self, request, view):
        # Read operations require authentication
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Create operations require applicant authentication
        if request.method == 'POST':
            if not request.user or not request.user.is_authenticated:
                return False
            return request.user.is_superuser or request.user.is_applicant
        
        # Update/delete operations require authentication
        if not request.user or not request.user.is_authenticated:
            return False
        
        return True  # Will be checked in has_object_permission
    
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
        
        # For read operations
        if request.method in SAFE_METHODS:
            # Applicants can see their own applications
            if obj.applicant == request.user:
                return True
            # Employers can see applications for their jobs
            if request.user.is_employer and obj.job.employer == request.user:
                return True
            return False
        
        # For update operations
        if request.method in ['PUT', 'PATCH']:
            # Applicants can update their own applications
            if obj.applicant == request.user and request.user.is_applicant:
                return True
            # Employers can update status of applications for their jobs
            if request.user.is_employer and obj.job.employer == request.user:
                return True
            return False
        
        # For delete operations, only applicants can delete their own applications
        if request.method == 'DELETE':
            return obj.applicant == request.user and request.user.is_applicant
        
        return False
