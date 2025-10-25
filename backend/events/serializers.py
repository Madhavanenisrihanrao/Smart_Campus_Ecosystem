from rest_framework import serializers
from .models import Event, EventRegistration
from accounts.serializers import UserSerializer


class EventRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for event registrations"""
    
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = '__all__'
        read_only_fields = ('user', 'registered_at')


class EventSerializer(serializers.ModelSerializer):
    """Serializer for events"""
    
    organizer_details = UserSerializer(source='organizer', read_only=True)
    participant_count = serializers.SerializerMethodField()
    is_registered = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('organizer', 'created_at', 'updated_at')
    
    def get_participant_count(self, obj):
        return obj.registrations.filter(status='registered').count()
    
    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.registrations.filter(user=request.user, status='registered').exists()
        return False
