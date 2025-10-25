from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from accounts.models import User
from .mongodb import get_users_collection
from datetime import datetime

@receiver(post_save, sender=User)
def sync_user_to_mongodb(sender, instance, created, **kwargs):
    """Sync user to MongoDB whenever a user is created or updated"""
    try:
        users_collection = get_users_collection()
        if users_collection is None:
            print("⚠️  MongoDB not connected, skipping sync")
            return
        
        user_data = {
            '_id': str(instance.id),
            'user_id': instance.id,
            'email': instance.email,
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'role': instance.role,
            'phone': instance.phone or '',
            'roll_number': instance.roll_number or '',
            'department': instance.department or '',
            'is_active': instance.is_active,
            'is_staff': instance.is_staff,
            'date_joined': instance.date_joined.isoformat() if instance.date_joined else datetime.now().isoformat(),
            'last_updated': datetime.now().isoformat(),
        }
        
        # Upsert (update if exists, insert if not)
        users_collection.update_one(
            {'_id': str(instance.id)},
            {'$set': user_data},
            upsert=True
        )
        
        action = "created" if created else "updated"
        print(f"✅ User {instance.email} {action} and synced to MongoDB")
        
    except Exception as e:
        print(f"❌ Error syncing user to MongoDB: {e}")

@receiver(post_delete, sender=User)
def delete_user_from_mongodb(sender, instance, **kwargs):
    """Delete user from MongoDB when deleted from Django"""
    try:
        users_collection = get_users_collection()
        if users_collection is None:
            return
            
        users_collection.delete_one({'_id': str(instance.id)})
        print(f"✅ User {instance.email} deleted from MongoDB")
        
    except Exception as e:
        print(f"❌ Error deleting user from MongoDB: {e}")
