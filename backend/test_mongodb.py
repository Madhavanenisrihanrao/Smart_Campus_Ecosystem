import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Direct connection test
uri = "mongodb+srv://yashwanthpuligila548:5485654@cluster1.p9g3qdo.mongodb.net/?appName=Cluster1"

print("Testing MongoDB connection...")
print(f"URI: {uri[:50]}...") # Print partial URI for security

try:
    client = MongoClient(uri, server_api=ServerApi('1'))
    client.admin.command('ping')
    print("✅ SUCCESS! Connected to MongoDB Atlas!")
    
    # List databases
    db_list = client.list_database_names()
    print(f"📊 Available databases: {db_list}")
    
except Exception as e:
    print(f"❌ CONNECTION FAILED!")
    print(f"Error: {e}")
    print("\n🔧 Possible fixes:")
    print("1. Go to MongoDB Atlas → Database Access")
    print("2. Verify username: yashwanthpuligila548")
    print("3. Reset password or create new user")
    print("4. Go to Network Access → Add your IP (or allow 0.0.0.0/0)")
    print("5. Wait 1-2 minutes after making changes")
