from django.contrib import admin
from .models import Club, ClubMembership, ClubActivity

@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'president', 'faculty_advisor', 'is_active')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'description')

@admin.register(ClubMembership)
class ClubMembershipAdmin(admin.ModelAdmin):
    list_display = ('club', 'user', 'role', 'status', 'joined_at')
    list_filter = ('role', 'status', 'joined_at')
    search_fields = ('club__name', 'user__email')

@admin.register(ClubActivity)
class ClubActivityAdmin(admin.ModelAdmin):
    list_display = ('club', 'title', 'activity_type', 'posted_by', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('club__name', 'title', 'description')
