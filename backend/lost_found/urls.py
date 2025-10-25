from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LostFoundItemViewSet, ClaimViewSet

router = DefaultRouter()
router.register(r'items', LostFoundItemViewSet, basename='items')
router.register(r'claims', ClaimViewSet, basename='claims')

urlpatterns = [
    path('', include(router.urls)),
]
