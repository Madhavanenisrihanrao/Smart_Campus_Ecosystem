from rest_framework import serializers
from .models import LostFoundItem, Claim
from accounts.serializers import UserSerializer


class LostFoundItemSerializer(serializers.ModelSerializer):
    """Serializer for lost/found items"""
    
    reported_by_details = UserSerializer(source='reported_by', read_only=True)
    claimed_by_details = UserSerializer(source='claimed_by', read_only=True)
    
    class Meta:
        model = LostFoundItem
        fields = '__all__'
        read_only_fields = ('reported_by', 'claimed_by', 'created_at', 'updated_at')


class ClaimSerializer(serializers.ModelSerializer):
    """Serializer for claims"""
    
    claimer_details = UserSerializer(source='claimer', read_only=True)
    item_details = LostFoundItemSerializer(source='item', read_only=True)
    
    class Meta:
        model = Claim
        fields = '__all__'
        read_only_fields = ('claimer', 'status', 'created_at', 'updated_at')
