from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.utils import timezone
from .models import Event, EventRegistration
from .serializers import EventSerializer, EventRegistrationSerializer
from asgiref.sync import async_to_sync
from accounts.permissions import IsFacultyOrAdmin, IsOwnerOrFacultyOrAdmin
from notifications.utils import send_notification_to_all_users, send_notification_to_user

# Channels temporarily disabled - function stub
def get_channel_layer():
    return None


class EventViewSet(viewsets.ModelViewSet):
    """ViewSet for events - Admins can create, edit, and delete all events"""
    
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Admin can create, update, delete all events
        Faculty can create events and update their own
        Students can only view events
        """
        if self.action in ['create']:
            # Only faculty and admin can create events
            return [IsFacultyOrAdmin()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Admin can edit/delete all, faculty can edit their own
            return [IsOwnerOrFacultyOrAdmin()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search) |
                models.Q(venue__icontains=search)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        """Create event - Faculty and Admin only, sends notification to all users"""
        event = serializer.save(organizer=self.request.user)
        
        # Send notification to all users about new event
        created_by = f"{self.request.user.first_name} {self.request.user.last_name}" if self.request.user.first_name else self.request.user.email
        role_badge = "🛡️ Admin" if self.request.user.role == 'admin' else "👨‍🏫 Faculty"
        
        send_notification_to_all_users(
            title=f"🎉 New Event: {event.title}",
            message=f"{role_badge} {created_by} created a new event '{event.title}' on {event.start_date.strftime('%B %d, %Y')}",
            notification_type='event',
            link=f'/events/{event.id}',
            exclude_user=self.request.user
        )
    
    def perform_update(self, serializer):
        """Update event - sends notification to all users"""
        event = serializer.save()
        
        # Send notification to all users about event update
        updated_by = f"{self.request.user.first_name} {self.request.user.last_name}" if self.request.user.first_name else self.request.user.email
        role_badge = "🛡️ Admin" if self.request.user.role == 'admin' else "👨‍🏫 Faculty"
        
        send_notification_to_all_users(
            title=f"📢 Event Updated: {event.title}",
            message=f"{role_badge} {updated_by} updated the event '{event.title}'. Check out the latest details!",
            notification_type='event',
            link=f'/events/{event.id}',
            exclude_user=self.request.user
        )
    
    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        """Register for an event"""
        event = self.get_object()
        
        # Check if event is full
        if event.max_participants:
            current_count = event.registrations.filter(status='registered').count()
            if current_count >= event.max_participants:
                return Response(
                    {'error': 'Event is full'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Check registration deadline
        if event.registration_deadline and timezone.now() > event.registration_deadline:
            return Response(
                {'error': 'Registration deadline has passed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already registered
        if event.registrations.filter(user=request.user, status='registered').exists():
            return Response(
                {'error': 'Already registered for this event'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        registration = EventRegistration.objects.create(
            event=event,
            user=request.user
        )
        
        # Notify organizer
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{event.organizer.id}',
            {
                'type': 'send_notification',
                'message': {
                    'type': 'event_registration',
                    'action': 'created',
                    'data': EventRegistrationSerializer(registration).data
                }
            }
        )
        
        return Response(
            EventRegistrationSerializer(registration).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def unregister(self, request, pk=None):
        """Unregister from an event"""
        event = self.get_object()
        
        try:
            registration = event.registrations.get(user=request.user, status='registered')
            registration.status = 'cancelled'
            registration.save()
            
            return Response({'message': 'Successfully unregistered'})
        except EventRegistration.DoesNotExist:
            return Response(
                {'error': 'Not registered for this event'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def my_events(self, request):
        """Get events organized by current user"""
        events = self.queryset.filter(organizer=request.user)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def registered_events(self, request):
        """Get events registered by current user"""
        registrations = EventRegistration.objects.filter(
            user=request.user,
            status='registered'
        ).select_related('event')
        events = [reg.event for reg in registrations]
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
