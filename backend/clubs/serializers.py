from rest_framework import serializers
from .models import Club, ClubMembership, ClubActivity
from accounts.serializers import UserSerializer


class ClubMembershipSerializer(serializers.ModelSerializer):
    """Serializer for club memberships"""
    
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = ClubMembership
        fields = '__all__'
        read_only_fields = ('user', 'joined_at')


class ClubActivitySerializer(serializers.ModelSerializer):
    """Serializer for club activities"""
    
    posted_by_details = UserSerializer(source='posted_by', read_only=True)
    
    class Meta:
        model = ClubActivity
        fields = '__all__'
        read_only_fields = ('posted_by', 'created_at', 'updated_at')


class ClubSerializer(serializers.ModelSerializer):
    """Serializer for clubs"""
    
    president_details = UserSerializer(source='president', read_only=True)
    faculty_advisor_details = UserSerializer(source='faculty_advisor', read_only=True)
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    recent_activities = serializers.SerializerMethodField()
    
    class Meta:
        model = Club
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
    
    def get_member_count(self, obj):
        return obj.memberships.filter(status='active').count()
    
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.memberships.filter(user=request.user, status='active').exists()
        return False
    
    def get_recent_activities(self, obj):
        activities = obj.activities.all()[:5]
        return ClubActivitySerializer(activities, many=True).data
