from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    CustomTokenObtainPairView,
    get_current_user, 
    update_profile, 
    change_password, 
    get_users
)
from .mongodb_views import mongodb_users_list, mongodb_status

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', get_current_user, name='current_user'),
    path('profile/', update_profile, name='update_profile'),
    path('change-password/', change_password, name='change_password'),
    path('users/', get_users, name='get_users'),
    # MongoDB endpoints
    path('mongodb/users/', mongodb_users_list, name='mongodb_users'),
    path('mongodb/status/', mongodb_status, name='mongodb_status'),
]
