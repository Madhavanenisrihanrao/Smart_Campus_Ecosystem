from pymongo import MongoClient
from pymongo.server_api import ServerApi
from django.conf import settings
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Atlas connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://yashwanthpuligila548:<db_password>@cluster1.p9g3qdo.mongodb.net/?appName=Cluster1')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME', 'klh_campus_hub')

# Create MongoDB client with Server API version
try:
    client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))
    db = client[MONGODB_DB_NAME]
    
    # Test connection
    client.admin.command('ping')
    print("✅ Pinged your deployment. You successfully connected to MongoDB!")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    client = None
    db = None

# Collections
def get_users_collection():
    """Get users collection from MongoDB"""
    if db is not None:
        return db['users']
    return None

def get_events_collection():
    """Get events collection from MongoDB"""
    if db is not None:
        return db['events']
    return None

def get_lost_found_collection():
    """Get lost & found collection from MongoDB"""
    if db is not None:
        return db['lost_found']
    return None

def get_feedback_collection():
    """Get feedback collection from MongoDB"""
    if db is not None:
        return db['feedback']
    return None
