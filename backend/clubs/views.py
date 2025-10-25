from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from .models import Club, ClubMembership, ClubActivity
from .serializers import ClubSerializer, ClubMembershipSerializer, ClubActivitySerializer
from asgiref.sync import async_to_sync
from accounts.permissions import IsFacultyOrAdmin, IsOwnerOrFacultyOrAdmin
from notifications.utils import send_notification_to_all_users

# Channels temporarily disabled - function stub
def get_channel_layer():
    return None


class ClubViewSet(viewsets.ModelViewSet):
    """ViewSet for clubs - Admins can create, edit, and delete all clubs"""
    
    queryset = Club.objects.filter(is_active=True)
    serializer_class = ClubSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Admin can create, update, delete all clubs
        Faculty can create clubs and manage their own
        Students can only view and join clubs
        """
        if self.action in ['create']:
            return [IsFacultyOrAdmin()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerOrFacultyOrAdmin()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) |
                models.Q(description__icontains=search)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        """Create club - sends notification to all users"""
        club = serializer.save(created_by=self.request.user)
        
        # Send notification to all users about new club
        created_by = f"{self.request.user.first_name} {self.request.user.last_name}" if self.request.user.first_name else self.request.user.email
        role_badge = "🛡️ Admin" if self.request.user.role == 'admin' else "👨‍🏫 Faculty"
        
        send_notification_to_all_users(
            title=f"🎭 New Club: {club.name}",
            message=f"{role_badge} {created_by} created a new club '{club.name}'. Join now and be part of something amazing!",
            notification_type='club',
            link=f'/clubs/{club.id}',
            exclude_user=self.request.user
        )
    
    def perform_update(self, serializer):
        """Update club - sends notification to all users"""
        club = serializer.save()
        
        # Send notification to all users about club update
        updated_by = f"{self.request.user.first_name} {self.request.user.last_name}" if self.request.user.first_name else self.request.user.email
        role_badge = "🛡️ Admin" if self.request.user.role == 'admin' else "👨‍🏫 Faculty"
        
        send_notification_to_all_users(
            title=f"📢 Club Updated: {club.name}",
            message=f"{role_badge} {updated_by} updated the club '{club.name}'. Check out the latest updates!",
            notification_type='club',
            link=f'/clubs/{club.id}',
            exclude_user=self.request.user
        )
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Join a club"""
        club = self.get_object()
        
        # Check if already a member
        if club.memberships.filter(user=request.user).exists():
            return Response(
                {'error': 'Already a member of this club'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        membership = ClubMembership.objects.create(
            club=club,
            user=request.user
        )
        
        # Notify club coordinators
        coordinators = club.memberships.filter(role__in=['president', 'coordinator'])
        channel_layer = get_channel_layer()
        for coord in coordinators:
            async_to_sync(channel_layer.group_send)(
                f'user_{coord.user.id}',
                {
                    'type': 'send_notification',
                    'message': {
                        'type': 'club_membership',
                        'action': 'joined',
                        'data': ClubMembershipSerializer(membership).data
                    }
                }
            )
        
        return Response(
            ClubMembershipSerializer(membership).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Leave a club"""
        club = self.get_object()
        
        try:
            membership = club.memberships.get(user=request.user, status='active')
            membership.status = 'inactive'
            membership.save()
            
            return Response({'message': 'Successfully left the club'})
        except ClubMembership.DoesNotExist:
            return Response(
                {'error': 'Not a member of this club'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get club members"""
        club = self.get_object()
        memberships = club.memberships.filter(status='active')
        serializer = ClubMembershipSerializer(memberships, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        """Get club activities"""
        club = self.get_object()
        activities = club.activities.all()
        serializer = ClubActivitySerializer(activities, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def post_activity(self, request, pk=None):
        """Post a club activity (coordinators and president only)"""
        club = self.get_object()
        
        # Check if user is coordinator or president
        try:
            membership = club.memberships.get(
                user=request.user,
                status='active',
                role__in=['president', 'coordinator']
            )
        except ClubMembership.DoesNotExist:
            return Response(
                {'error': 'Only club coordinators and president can post activities'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        activity = ClubActivity.objects.create(
            club=club,
            posted_by=request.user,
            activity_type=request.data.get('activity_type'),
            title=request.data.get('title'),
            description=request.data.get('description'),
            scheduled_date=request.data.get('scheduled_date')
        )
        
        # Notify all club members
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'club_{club.id}',
            {
                'type': 'send_notification',
                'message': {
                    'type': 'club_activity',
                    'action': 'created',
                    'data': ClubActivitySerializer(activity).data
                }
            }
        )
        
        return Response(
            ClubActivitySerializer(activity).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def my_clubs(self, request):
        """Get clubs joined by current user"""
        memberships = ClubMembership.objects.filter(
            user=request.user,
            status='active'
        ).select_related('club')
        clubs = [m.club for m in memberships]
        serializer = self.get_serializer(clubs, many=True)
        return Response(serializer.data)
