from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class LostFoundItem(models.Model):
    """Model for lost and found items"""
    
    ITEM_TYPE_CHOICES = (
        ('lost', 'Lost'),
        ('found', 'Found'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('claimed', 'Claimed'),
        ('returned', 'Returned'),
        ('closed', 'Closed'),
    )
    
    CATEGORY_CHOICES = (
        ('electronics', 'Electronics'),
        ('documents', 'Documents'),
        ('clothing', 'Clothing'),
        ('accessories', 'Accessories'),
        ('books', 'Books'),
        ('other', 'Other'),
    )
    
    item_type = models.CharField(max_length=10, choices=ITEM_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=200)
    date_lost_found = models.DateField()
    image = models.ImageField(upload_to='lost_found/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Relationships
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_items')
    claimed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='claimed_items')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lost_found_items'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_item_type_display()}: {self.title}"


class Claim(models.Model):
    """Model for item claims"""
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    item = models.ForeignKey(LostFoundItem, on_delete=models.CASCADE, related_name='claims')
    claimer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_claims')
    description = models.TextField(help_text='Describe the item to verify ownership')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'claims'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Claim for {self.item.title} by {self.claimer.email}"
