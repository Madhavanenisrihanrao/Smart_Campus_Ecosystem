# KLH Campus Hub - Backend

Django REST API backend for the KLH University Smart Campus Hub platform.

## Features

- **Authentication**: JWT-based authentication with role-based access control (Student, Faculty, Admin)
- **Lost & Found**: Report and claim lost/found items with real-time notifications
- **Events**: Create, manage, and register for campus events
- **Feedback**: Submit and track feedback/grievances (with anonymous option)
- **Clubs**: Student club management with activities and memberships
- **Real-time Notifications**: WebSocket support via Django Channels
- **Chatbot**: Optional Gemini AI-powered campus assistant

## Tech Stack

- Django 4.2
- Django REST Framework
- Django Channels (WebSockets)
- SQLite (can be upgraded to PostgreSQL)
- JWT Authentication
- Gemini API (optional)

## Setup Instructions

### Prerequisites

- Python 3.9+
- pip

### Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file** (copy from .env.example):
   ```bash
   copy .env.example .env  # On Windows
   # cp .env.example .env  # On Linux/Mac
   ```

5. **Edit .env** and set your configuration:
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   GEMINI_API_KEY=your-gemini-api-key  # Optional for chatbot
   ```

6. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser** (admin account):
   ```bash
   python manage.py createsuperuser
   ```

8. **Run development server**:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT token
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/me/` - Get current user details
- `PUT /api/auth/profile/` - Update profile
- `POST /api/auth/change-password/` - Change password

### Lost & Found
- `GET /api/lost-found/items/` - List all items
- `POST /api/lost-found/items/` - Report new item
- `GET /api/lost-found/items/{id}/` - Get item details
- `POST /api/lost-found/items/{id}/claim/` - Claim an item
- `GET /api/lost-found/claims/` - List claims
- `POST /api/lost-found/claims/{id}/approve/` - Approve claim (admin/faculty)
- `POST /api/lost-found/claims/{id}/reject/` - Reject claim (admin/faculty)

### Events
- `GET /api/events/` - List events
- `POST /api/events/` - Create event (faculty/admin)
- `GET /api/events/{id}/` - Get event details
- `POST /api/events/{id}/register/` - Register for event
- `POST /api/events/{id}/unregister/` - Unregister from event
- `GET /api/events/my_events/` - Get events organized by user
- `GET /api/events/registered_events/` - Get registered events

### Feedback
- `GET /api/feedback/` - List feedback
- `POST /api/feedback/` - Submit feedback
- `GET /api/feedback/{id}/` - Get feedback details
- `POST /api/feedback/{id}/respond/` - Add response (faculty/admin)
- `POST /api/feedback/{id}/assign/` - Assign to user (admin)

### Clubs
- `GET /api/clubs/` - List clubs
- `POST /api/clubs/` - Create club (admin)
- `GET /api/clubs/{id}/` - Get club details
- `POST /api/clubs/{id}/join/` - Join club
- `POST /api/clubs/{id}/leave/` - Leave club
- `GET /api/clubs/{id}/members/` - Get club members
- `GET /api/clubs/{id}/activities/` - Get club activities
- `POST /api/clubs/{id}/post_activity/` - Post activity (coordinators)
- `GET /api/clubs/my_clubs/` - Get joined clubs

### Notifications
- `GET /api/notifications/` - List notifications
- `GET /api/notifications/unread_count/` - Get unread count
- `POST /api/notifications/mark_all_read/` - Mark all as read
- `POST /api/notifications/{id}/mark_read/` - Mark one as read

### Chatbot
- `POST /api/chatbot/chat/` - Send message to chatbot
- `GET /api/chatbot/history/` - Get chat history

### WebSocket
- `ws://localhost:8000/ws/notifications/` - Real-time notifications

## Project Structure

```
backend/
├── campus_hub/          # Main project settings
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── accounts/            # User authentication & management
├── lost_found/          # Lost & Found module
├── events/              # Events management
├── feedback/            # Feedback & grievances
├── clubs/               # Student clubs
├── notifications/       # Real-time notifications
├── chatbot/             # AI chatbot
├── manage.py
└── requirements.txt
```

## Deployment

### For Render.com

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt && python manage.py migrate`
4. Set start command: `daphne -b 0.0.0.0 -p $PORT campus_hub.asgi:application`
5. Add environment variables in Render dashboard
6. Deploy!

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin`

Use the superuser credentials you created earlier.

## Notes

- The chatbot feature requires a Gemini API key. Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)
- For production, replace SQLite with PostgreSQL
- Set `DEBUG=False` in production
- Use proper secret keys in production
- Configure ALLOWED_HOSTS properly

## License

MIT
