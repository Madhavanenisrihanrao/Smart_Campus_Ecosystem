from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from .models import LostFoundItem, Claim
from .serializers import LostFoundItemSerializer, ClaimSerializer
from asgiref.sync import async_to_sync
from accounts.permissions import IsOwnerOrAdmin
from notifications.utils import send_notification_to_all_users

# Channels temporarily disabled - function stub
def get_channel_layer():
    return None


class LostFoundItemViewSet(viewsets.ModelViewSet):
    """ViewSet for lost/found items - Admins can edit and delete all items"""
    
    queryset = LostFoundItem.objects.all()
    serializer_class = LostFoundItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Admin can edit/delete all items
        Users can edit/delete their own items
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerOrAdmin()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by item type
        item_type = self.request.query_params.get('type', None)
        if item_type:
            queryset = queryset.filter(item_type=item_type)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search) |
                models.Q(location__icontains=search)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        """Create lost/found item - sends notification to all users"""
        item = serializer.save(reported_by=self.request.user)
        
        # Send notification to all users about new lost/found item
        created_by = f"{self.request.user.first_name} {self.request.user.last_name}" if self.request.user.first_name else self.request.user.email
        item_type_emoji = "🔍" if item.item_type == 'lost' else "✅"
        
        send_notification_to_all_users(
            title=f"{item_type_emoji} {item.item_type.title()}: {item.title}",
            message=f"{created_by} reported a {item.item_type} item: {item.title} at {item.location}",
            notification_type='lost_found',
            link=f'/lost-found/{item.id}',
            exclude_user=self.request.user
        )
    
    @action(detail=True, methods=['post'])
    def claim(self, request, pk=None):
        """Create a claim for an item"""
        item = self.get_object()
        
        if item.status != 'active':
            return Response(
                {'error': 'This item is not available for claiming'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        claim = Claim.objects.create(
            item=item,
            claimer=request.user,
            description=request.data.get('description', '')
        )
        
        # Notify item reporter
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{item.reported_by.id}',
            {
                'type': 'send_notification',
                'message': {
                    'type': 'claim',
                    'action': 'created',
                    'data': ClaimSerializer(claim).data
                }
            }
        )
        
        return Response(ClaimSerializer(claim).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def my_items(self, request):
        """Get items reported by current user"""
        items = self.queryset.filter(reported_by=request.user)
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)


class ClaimViewSet(viewsets.ModelViewSet):
    """ViewSet for claims"""
    
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'admin':
            return super().get_queryset()
        
        # Show claims made by user or claims for user's items
        return self.queryset.filter(
            models.Q(claimer=user) | 
            models.Q(item__reported_by=user)
        )
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a claim (admin/faculty only)"""
        if request.user.role not in ['admin', 'faculty']:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        claim = self.get_object()
        claim.status = 'approved'
        claim.admin_notes = request.data.get('admin_notes', '')
        claim.save()
        
        # Update item status
        claim.item.status = 'claimed'
        claim.item.claimed_by = claim.claimer
        claim.item.save()
        
        # Notify claimer
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{claim.claimer.id}',
            {
                'type': 'send_notification',
                'message': {
                    'type': 'claim',
                    'action': 'approved',
                    'data': ClaimSerializer(claim).data
                }
            }
        )
        
        return Response(ClaimSerializer(claim).data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a claim (admin/faculty only)"""
        if request.user.role not in ['admin', 'faculty']:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        claim = self.get_object()
        claim.status = 'rejected'
        claim.admin_notes = request.data.get('admin_notes', '')
        claim.save()
        
        # Notify claimer
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{claim.claimer.id}',
            {
                'type': 'send_notification',
                'message': {
                    'type': 'claim',
                    'action': 'rejected',
                    'data': ClaimSerializer(claim).data
                }
            }
        )
        
        return Response(ClaimSerializer(claim).data)
