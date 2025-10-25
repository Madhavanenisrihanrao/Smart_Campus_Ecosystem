from rest_framework import serializers
from .models import Feedback, FeedbackResponse
from accounts.serializers import UserSerializer


class FeedbackResponseSerializer(serializers.ModelSerializer):
    """Serializer for feedback responses"""
    
    responder_details = UserSerializer(source='responder', read_only=True)
    
    class Meta:
        model = FeedbackResponse
        fields = '__all__'
        read_only_fields = ('responder', 'created_at')


class FeedbackSerializer(serializers.ModelSerializer):
    """Serializer for feedback"""
    
    submitted_by_details = UserSerializer(source='submitted_by', read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)
    responses = FeedbackResponseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ('submitted_by', 'created_at', 'updated_at')
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Hide submitter details if anonymous
        if instance.is_anonymous:
            representation['submitted_by'] = None
            representation['submitted_by_details'] = None
        
        return representation
