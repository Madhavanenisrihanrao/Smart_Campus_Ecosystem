try:
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync
    CHANNELS_AVAILABLE = True
except ImportError:
    CHANNELS_AVAILABLE = False
    def get_channel_layer():
        return None
    def async_to_sync(func):
        return func

from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()


def send_notification_to_all_users(title, message, notification_type='general', link=None, exclude_user=None):
    """
    Send notification to all active users
    Used when admin creates/updates events, clubs, etc.
    """
    users = User.objects.filter(is_active=True)
    if exclude_user:
        users = users.exclude(id=exclude_user.id)
    
    # Create notifications in database
    notifications = []
    for user in users:
        notifications.append(
            Notification(
                user=user,
                title=title,
                message=message,
                notification_type=notification_type,
                link=link
            )
        )
    
    Notification.objects.bulk_create(notifications)
    
    # Send real-time WebSocket notifications
    channel_layer = get_channel_layer()
    if channel_layer and CHANNELS_AVAILABLE:
        try:
            async_to_sync(channel_layer.group_send)(
                'campus_notifications',
                {
                    'type': 'send_notification',
                    'message': {
                        'type': notification_type,
                        'title': title,
                        'message': message,
                        'link': link,
                    }
                }
            )
        except Exception as e:
            print(f"Error sending WebSocket notification: {e}")


def send_notification_to_user(user, title, message, notification_type='general', link=None):
    """
    Send notification to a specific user
    """
    # Create notification in database
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        link=link
    )
    
    # Send real-time WebSocket notification
    channel_layer = get_channel_layer()
    if channel_layer and CHANNELS_AVAILABLE:
        try:
            async_to_sync(channel_layer.group_send)(
                f'user_{user.id}',
                {
                    'type': 'send_notification',
                    'message': {
                        'type': notification_type,
                        'title': title,
                        'message': message,
                        'link': link,
                    }
                }
            )
        except Exception as e:
            print(f"Error sending WebSocket notification: {e}")
    
    return notification


def send_notification_to_role(role, title, message, notification_type='general', link=None, exclude_user=None):
    """
    Send notification to all users with a specific role
    """
    users = User.objects.filter(is_active=True, role=role)
    if exclude_user:
        users = users.exclude(id=exclude_user.id)
    
    # Create notifications in database
    notifications = []
    for user in users:
        notifications.append(
            Notification(
                user=user,
                title=title,
                message=message,
                notification_type=notification_type,
                link=link
            )
        )
    
    Notification.objects.bulk_create(notifications)
    
    # Send real-time WebSocket notifications
    channel_layer = get_channel_layer()
    if channel_layer and CHANNELS_AVAILABLE:
        try:
            # Send to role-specific group or campus-wide
            group_name = 'campus_notifications'
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    'type': 'send_notification',
                    'message': {
                        'type': notification_type,
                        'title': title,
                        'message': message,
                        'link': link,
                    }
                }
            )
        except Exception as e:
            print(f"Error sending WebSocket notification: {e}")
