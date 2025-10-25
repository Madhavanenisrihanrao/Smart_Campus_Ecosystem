from django.contrib import admin
from .models import Feedback, FeedbackResponse

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'priority', 'status', 'is_anonymous', 'submitted_by', 'created_at')
    list_filter = ('category', 'priority', 'status', 'is_anonymous', 'created_at')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'

@admin.register(FeedbackResponse)
class FeedbackResponseAdmin(admin.ModelAdmin):
    list_display = ('feedback', 'responder', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('feedback__title', 'message')
