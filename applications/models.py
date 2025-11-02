
from django.db import models
from users.models import User
from jobs.models import Job

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('shortlisted', 'Shortlisted'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    resume_data = models.BinaryField(null=True, blank=True)  # Store file as binary data in database
    resume_filename = models.CharField(max_length=255, null=True, blank=True)  # Store original filename
    resume_content_type = models.CharField(max_length=100, null=True, blank=True)  # Store MIME type (e.g., 'application/pdf')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    cover_letter = models.TextField(blank=True, null=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-applied_at']
        unique_together = [['applicant', 'job']]
    
    @property
    def resume(self):
        """Property to maintain compatibility with existing code"""
        if self.resume_data:
            return ResumeFileWrapper(self)
        return None


class ResumeFileWrapper:
    """Wrapper to make resume_data behave like a FileField"""
    def __init__(self, application):
        self.application = application
        self.name = application.resume_filename
        self.content_type = application.resume_content_type
    
    def read(self):
        return self.application.resume_data
    
    @property
    def url(self):
        """Generate data URL for inline display"""
        if self.application.resume_data:
            import base64
            base64_data = base64.b64encode(self.application.resume_data).decode('utf-8')
            return f"data:{self.content_type or 'application/pdf'};base64,{base64_data}"
        return None
    
    @property
    def size(self):
        if self.application.resume_data:
            return len(self.application.resume_data)
        return 0
