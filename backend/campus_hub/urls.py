"""
URL configuration for campus_hub project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Project-level template routes (server-rendered pages)
    path('', include('core.urls')),
    path('api/auth/', include('accounts.urls')),
    path('api/lost-found/', include('lost_found.urls')),
    path('api/events/', include('events.urls')),
    path('api/feedback/', include('feedback.urls')),
    path('api/clubs/', include('clubs.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/chatbot/', include('chatbot.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
