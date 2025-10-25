from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
import json


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    """WebSocket consumer for real-time notifications"""
    
    async def connect(self):
        self.user = self.scope['user']
        
        if self.user.is_anonymous:
            await self.close()
            return
        
        # Join user-specific group
        self.user_group_name = f'user_{self.user.id}'
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        # Join campus-wide notifications group
        await self.channel_layer.group_add(
            'campus_notifications',
            self.channel_name
        )
        
        # Join admin notifications if admin/faculty
        if self.user.role in ['admin', 'faculty']:
            await self.channel_layer.group_add(
                'admin_notifications',
                self.channel_name
            )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave groups
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )
        
        await self.channel_layer.group_discard(
            'campus_notifications',
            self.channel_name
        )
        
        if self.user.role in ['admin', 'faculty']:
            await self.channel_layer.group_discard(
                'admin_notifications',
                self.channel_name
            )
    
    async def receive_json(self, content):
        """Receive message from WebSocket"""
        message_type = content.get('type')
        
        if message_type == 'ping':
            await self.send_json({'type': 'pong'})
    
    async def send_notification(self, event):
        """Send notification to WebSocket"""
        await self.send_json(event['message'])
