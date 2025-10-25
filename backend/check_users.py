import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_hub.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.mongodb import get_users_collection

User = get_user_model()

print("=" * 60)
print("USER STORAGE LOCATIONS")
print("=" * 60)

# Check SQLite (Django's default database)
print("\n1️⃣ SQLite Database (Django's db.sqlite3)")
print("-" * 60)
sqlite_users = User.objects.all()
print(f"Total Users: {sqlite_users.count()}")
if sqlite_users.exists():
    print("\nUsers in SQLite:")
    for user in sqlite_users:
        print(f"  • Username: {user.username}")
        print(f"    Email: {user.email}")
        print(f"    Date Joined: {user.date_joined}")
        print(f"    Is Active: {user.is_active}")
        print()
else:
    print("  No users found in SQLite database.")

# Check MongoDB Atlas
print("\n2️⃣ MongoDB Atlas (Cloud Database)")
print("-" * 60)
users_collection = get_users_collection()
if users_collection is not None:
    mongo_users = list(users_collection.find())
    print(f"Total Users: {len(mongo_users)}")
    if mongo_users:
        print("\nUsers in MongoDB:")
        for user in mongo_users:
            print(f"  • Username: {user.get('username', 'N/A')}")
            print(f"    Email: {user.get('email', 'N/A')}")
            print(f"    Django User ID: {user.get('django_user_id', 'N/A')}")
            print(f"    MongoDB ID: {user.get('_id', 'N/A')}")
            print()
    else:
        print("  No users found in MongoDB Atlas.")
else:
    print("  MongoDB connection not available.")

print("\n" + "=" * 60)
print("📍 Database File Locations:")
print("=" * 60)
print(f"SQLite: C:\\Users\\p. yashwanth\\OneDrive\\Desktop\\veb_ai_thone\\backend\\db.sqlite3")
print(f"MongoDB: cluster1.p9g3qdo.mongodb.net (Cloud)")
print(f"MongoDB Database Name: klh_campus_hub")
print(f"MongoDB Collection: users")
print("=" * 60)
