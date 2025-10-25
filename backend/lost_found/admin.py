from django.contrib import admin
from .models import LostFoundItem, Claim

@admin.register(LostFoundItem)
class LostFoundItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'item_type', 'category', 'status', 'reported_by', 'created_at')
    list_filter = ('item_type', 'category', 'status', 'created_at')
    search_fields = ('title', 'description', 'location')
    date_hierarchy = 'created_at'

@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = ('item', 'claimer', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('item__title', 'claimer__email', 'description')
