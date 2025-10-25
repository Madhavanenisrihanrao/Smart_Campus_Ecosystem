from django.contrib import admin
from .models import Event, EventRegistration

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'start_date', 'venue', 'status', 'organizer')
    list_filter = ('category', 'status', 'start_date')
    search_fields = ('title', 'description', 'venue')
    date_hierarchy = 'start_date'

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('event', 'user', 'status', 'registered_at')
    list_filter = ('status', 'registered_at')
    search_fields = ('event__title', 'user__email')
