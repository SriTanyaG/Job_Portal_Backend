from rest_framework.permissions import BasePermission

class IsEmployer(BasePermission):
    """
    Allows access to users who are employers or superusers.
    """

    def has_permission(self, request, view):
        user = request.user
        return user and user.is_authenticated and (user.is_superuser or user.is_employer)
