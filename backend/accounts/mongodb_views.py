from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from core.mongodb import get_users_collection, db, client
from bson import json_util
import json

@api_view(['GET'])
@permission_classes([IsAdminUser])
def mongodb_users_list(request):
    """Get all users from MongoDB Atlas"""
    try:
        users_collection = get_users_collection()
        if users_collection is None:
            return Response({
                'status': 'error',
                'message': 'MongoDB not connected'
            }, status=500)
        
        users = list(users_collection.find({}).limit(100))
        
        # Convert MongoDB documents to JSON-serializable format
        users_json = json.loads(json_util.dumps(users))
        
        return Response({
            'status': 'success',
            'count': len(users),
            'users': users_json
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)

@api_view(['GET'])
def mongodb_status(request):
    """Check MongoDB connection status"""
    try:
        if client is None:
            return Response({
                'status': 'disconnected',
                'message': 'MongoDB client not initialized'
            })
        
        # Ping the database
        client.admin.command('ping')
        
        # Get database stats
        stats = db.command('dbstats')
        
        return Response({
            'status': 'connected',
            'database': db.name,
            'collections': db.list_collection_names(),
            'stats': {
                'collections': stats.get('collections', 0),
                'objects': stats.get('objects', 0),
                'dataSize': stats.get('dataSize', 0),
            }
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)
