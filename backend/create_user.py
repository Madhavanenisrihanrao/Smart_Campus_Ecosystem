import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_hub.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("CREATE NEW USER")
print("=" * 60)

# Get user input
email = input("\nEnter email: ")
password = input("Enter password: ")
first_name = input("Enter first name (optional): ")
last_name = input("Enter last name (optional): ")

try:
    # Create user
    user = User.objects.create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    
    print("\n✅ User created successfully!")
    print(f"   Email: {user.email}")
    print(f"   Name: {user.first_name} {user.last_name}")
    print(f"   User ID: {user.id}")
    print(f"   Active: {user.is_active}")
    
    print("\n📝 User has been saved to:")
    print("   • SQLite database (db.sqlite3)")
    print("   • MongoDB Atlas (klh_campus_hub)")
    
except Exception as e:
    print(f"\n❌ Error creating user: {e}")

print("\n" + "=" * 60)
