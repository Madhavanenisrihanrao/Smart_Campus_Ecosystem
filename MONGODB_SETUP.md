# MongoDB Atlas Integration for KLH Campus Hub

## 🎯 Setup Complete!

Your Django backend is now configured to sync all users to MongoDB Atlas automatically.

## 📝 Configuration Steps

### 1. Update MongoDB Password

Edit `backend/.env` file and replace `<db_password>` with your actual MongoDB Atlas password:

```env
MONGODB_URI=mongodb+srv://ayushmyhissa:YOUR_ACTUAL_PASSWORD@cluster0.t9eptqe.mongodb.net/?appName=Cluster0
```

### 2. Start the Backend Server

```bash
cd backend
python manage.py runserver
```

## ✅ Features Implemented

### Automatic User Synchronization
- **Every time a user is created** → Automatically saved to MongoDB Atlas
- **Every time a user is updated** → Automatically synced to MongoDB Atlas  
- **Every time a user is deleted** → Automatically removed from MongoDB Atlas

### MongoDB Collections Structure

#### Users Collection (`users`)
```json
{
  "_id": "user_id_string",
  "user_id": 123,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "phone": "1234567890",
  "roll_number": "241008018",
  "department": "AI&DS",
  "is_active": true,
  "is_staff": false,
  "date_joined": "2025-10-25T10:30:00",
  "last_updated": "2025-10-25T10:30:00"
}
```

## 🔌 API Endpoints

### Check MongoDB Connection Status
```
GET /api/accounts/mongodb/status/
```

Response:
```json
{
  "status": "connected",
  "database": "klh_campus_hub",
  "collections": ["users", "events", "lost_found"],
  "stats": {
    "collections": 3,
    "objects": 25,
    "dataSize": 12345
  }
}
```

### View All MongoDB Users (Admin Only)
```
GET /api/accounts/mongodb/users/
```

Response:
```json
{
  "status": "success",
  "count": 10,
  "users": [...]
}
```

## 🧪 Testing the Integration

### 1. Check Connection
```bash
curl http://localhost:8000/api/accounts/mongodb/status/
```

### 2. Register a New User
Go to: `http://localhost:5173/register`

Fill in the form and click "Create Account"

### 3. Verify in MongoDB Atlas
1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. Select `klh_campus_hub` database
4. Click on `users` collection
5. You should see your registered user!

## 📊 What Gets Synced

✅ User Registration → MongoDB  
✅ User Profile Updates → MongoDB  
✅ User Deletion → MongoDB  
✅ Real-time synchronization via Django signals

## 🔒 Security Notes

- Never commit `.env` file to Git
- Keep your MongoDB password secure
- Use environment variables for production
- The MongoDB URI in `.env.example` has `<db_password>` placeholder

## 🎨 Future Enhancements

You can extend this to sync:
- Events to MongoDB
- Lost & Found items
- Feedback submissions
- Club memberships

Just create similar signal handlers in `core/signals.py`!

## ❓ Troubleshooting

### Connection Failed
- Check if MongoDB password is correct in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify internet connection

### Users Not Syncing
- Check Django signals are imported in `accounts/apps.py`
- Look for error messages in backend console
- Verify MongoDB collection permissions

## 🚀 Ready to Test!

1. **Update password** in `backend/.env`
2. **Start backend**: `python manage.py runserver`
3. **Register a new user** on the website
4. **Check MongoDB Atlas** to see the user!

---

**MongoDB Atlas Dashboard**: https://cloud.mongodb.com/
**Database**: `klh_campus_hub`
**Collection**: `users`
