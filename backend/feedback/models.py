from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Feedback(models.Model):
    """Model for feedback and grievances"""
    
    CATEGORY_CHOICES = (
        ('academic', 'Academic'),
        ('infrastructure', 'Infrastructure'),
        ('faculty', 'Faculty'),
        ('administration', 'Administration'),
        ('hostel', 'Hostel'),
        ('library', 'Library'),
        ('cafeteria', 'Cafeteria'),
        ('transport', 'Transport'),
        ('other', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_anonymous = models.BooleanField(default=False)
    attachment = models.FileField(upload_to='feedback/', blank=True, null=True)
    
    # Relationships
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='submitted_feedback')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_feedback')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'feedback'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class FeedbackResponse(models.Model):
    """Model for feedback responses"""
    
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name='responses')
    responder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback_responses')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'feedback_responses'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Response to {self.feedback.title}"
