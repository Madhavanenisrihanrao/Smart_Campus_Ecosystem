from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from .models import Feedback, FeedbackResponse
from .serializers import FeedbackSerializer, FeedbackResponseSerializer
from asgiref.sync import async_to_sync
from accounts.permissions import IsFacultyOrAdmin, IsOwnerOrAdmin

# Channels temporarily disabled - function stub
def get_channel_layer():
    return None


class FeedbackViewSet(viewsets.ModelViewSet):
    """ViewSet for feedback - Admins can view, edit, and respond to all feedback"""
    
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Admin can view, edit, and respond to all feedback
        Faculty can view and respond to feedback
        Students can create and view their own feedback
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerOrAdmin()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        
        # Admin and faculty can see all feedback
        if user.role in ['admin', 'faculty']:
            pass
        else:
            # Students can only see their own feedback
            queryset = queryset.filter(submitted_by=user)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by priority
        priority = self.request.query_params.get('priority', None)
        if priority:
            queryset = queryset.filter(priority=priority)
        
        return queryset
    
    def perform_create(self, serializer):
        # Set submitted_by to current user if not anonymous
        if not serializer.validated_data.get('is_anonymous', False):
            feedback = serializer.save(submitted_by=self.request.user)
        else:
            feedback = serializer.save()
        
        # Notify admins
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'admin_notifications',
            {
                'type': 'send_notification',
                'message': {
                    'type': 'feedback',
                    'action': 'created',
                    'data': FeedbackSerializer(feedback).data
                }
            }
        )
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """Add a response to feedback (faculty/admin only)"""
        if request.user.role not in ['admin', 'faculty']:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        feedback = self.get_object()
        
        response = FeedbackResponse.objects.create(
            feedback=feedback,
            responder=request.user,
            message=request.data.get('message', '')
        )
        
        # Update feedback status if provided
        new_status = request.data.get('status')
        if new_status:
            feedback.status = new_status
            feedback.save()
        
        # Notify submitter if not anonymous
        if feedback.submitted_by:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'user_{feedback.submitted_by.id}',
                {
                    'type': 'send_notification',
                    'message': {
                        'type': 'feedback_response',
                        'action': 'created',
                        'data': FeedbackResponseSerializer(response).data
                    }
                }
            )
        
        return Response(
            FeedbackResponseSerializer(response).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign feedback to a user (admin only)"""
        if request.user.role != 'admin':
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        feedback = self.get_object()
        assigned_to_id = request.data.get('assigned_to')
        
        if assigned_to_id:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                assigned_user = User.objects.get(id=assigned_to_id)
                feedback.assigned_to = assigned_user
                feedback.status = 'under_review'
                feedback.save()
                
                # Notify assigned user
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    f'user_{assigned_user.id}',
                    {
                        'type': 'send_notification',
                        'message': {
                            'type': 'feedback',
                            'action': 'assigned',
                            'data': FeedbackSerializer(feedback).data
                        }
                    }
                )
                
                return Response(FeedbackSerializer(feedback).data)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(
            {'error': 'assigned_to field is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
