from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Club(models.Model):
    """Model for student clubs"""
    
    CATEGORY_CHOICES = (
        ('technical', 'Technical'),
        ('cultural', 'Cultural'),
        ('sports', 'Sports'),
        ('social', 'Social Service'),
        ('academic', 'Academic'),
        ('entrepreneurship', 'Entrepreneurship'),
        ('other', 'Other'),
    )
    
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    logo = models.ImageField(upload_to='clubs/', blank=True, null=True)
    faculty_advisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='advised_clubs', limit_choices_to={'role': 'faculty'})
    president = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='led_clubs', limit_choices_to={'role': 'student'})
    members = models.ManyToManyField(User, through='ClubMembership', related_name='joined_clubs')
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'clubs'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ClubMembership(models.Model):
    """Model for club memberships"""
    
    ROLE_CHOICES = (
        ('member', 'Member'),
        ('coordinator', 'Coordinator'),
        ('president', 'President'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )
    
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='club_memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'club_memberships'
        unique_together = ('club', 'user')
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.club.name}"


class ClubActivity(models.Model):
    """Model for club activities and announcements"""
    
    ACTIVITY_TYPE_CHOICES = (
        ('announcement', 'Announcement'),
        ('event', 'Event'),
        ('achievement', 'Achievement'),
        ('meeting', 'Meeting'),
        ('workshop', 'Workshop'),
        ('other', 'Other'),
    )
    
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    scheduled_date = models.DateTimeField(null=True, blank=True)
    image = models.ImageField(upload_to='club_activities/', blank=True, null=True)
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_activities')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'club_activities'
        ordering = ['-created_at']
        verbose_name_plural = 'Club activities'
    
    def __str__(self):
        return f"{self.club.name}: {self.title}"
