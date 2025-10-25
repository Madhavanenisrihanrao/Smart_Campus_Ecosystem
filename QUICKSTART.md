# Quick Start Guide - KLH Campus Hub

Follow these steps to get the KLH Campus Hub running locally on your machine.

## Prerequisites

Make sure you have these installed:

- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

## Step 1: Clone the Repository

```powershell
cd "C:\Users\p. yashwanth\OneDrive\Desktop"
cd veb_ai_thone
```

## Step 2: Backend Setup (5 minutes)

Open PowerShell in the project directory:

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create admin account (follow prompts)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

**Backend is now running at:** `http://localhost:8000`

Keep this terminal open!

## Step 3: Frontend Setup (3 minutes)

Open a **NEW** PowerShell window in the project directory:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies (this may take a few minutes)
npm install

# Create .env file
copy .env.example .env

# Start the frontend server
npm run dev
```

**Frontend is now running at:** `http://localhost:5173`

## Step 4: Access the Application

1. **Open your browser** and go to: `http://localhost:5173`

2. **Create a new account**:
   - Click "Register here"
   - Fill in your details
   - Choose role (Student/Faculty)
   - Click "Create Account"

3. **Start exploring**:
   - Dashboard: Overview of campus activities
   - Lost & Found: Report or search for items
   - Events: Browse and register for events
   - Feedback: Submit feedback or grievances
   - Clubs: Join student clubs

## Step 5: Access Admin Panel (Optional)

To manage the platform as an admin:

1. Go to: `http://localhost:8000/admin`
2. Login with the superuser credentials you created
3. You can now manage users, approve claims, etc.

## Common Commands

### Backend Commands

```powershell
# Activate virtual environment
cd backend
venv\Scripts\activate

# Start server
python manage.py runserver

# Create new migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Frontend Commands

```powershell
# Start development server
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Backend Issues

**Error: "ModuleNotFoundError"**
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

**Error: "Port 8000 already in use"**
- Close other Django servers
- Or use: `python manage.py runserver 8001`

**Error: Database locked**
- Make sure only one Django server is running
- Delete `db.sqlite3` and run migrations again

### Frontend Issues

**Error: "EADDRINUSE: port 5173 already in use"**
- Close other Vite servers
- Or change port in `vite.config.js`

**Error: "npm ERR! code ENOENT"**
- Delete `node_modules` folder
- Run `npm install` again

**Error: API calls failing**
- Make sure backend is running at `http://localhost:8000`
- Check `.env` file has correct API URL

## What's Next?

### For Development

1. **Explore the Code**:
   - Backend: `backend/` directory
   - Frontend: `frontend/src/` directory

2. **Make Changes**:
   - Both frontend and backend have hot reload
   - Changes will appear automatically

3. **Add Features**:
   - Check `README.md` files for architecture
   - Follow Django and React best practices

### For Production

1. **Follow Deployment Guide**: See `DEPLOYMENT.md`
2. **Choose a hosting service**: Render, Vercel, Netlify
3. **Configure environment variables**
4. **Deploy and test**

## Features to Try

### Lost & Found
1. Click "Lost & Found" in sidebar
2. Click "Report Item"
3. Fill in details and submit
4. Search for items using filters

### Events
1. Click "Events" in sidebar
2. Browse upcoming events
3. Click "Register" to sign up
4. Check notifications for updates

### Feedback
1. Click "Feedback" in sidebar
2. Click "Submit Feedback"
3. Choose anonymous option if needed
4. Track status of your feedback

### Clubs
1. Click "Clubs" in sidebar
2. Browse available clubs
3. Click "Join Club" to become a member
4. View club activities

### Chatbot (Bonus Feature)
1. Click the chat icon in bottom-right
2. Ask questions about campus
3. Get instant AI-powered responses
4. **Note**: Requires Gemini API key in backend `.env`

## Getting Help

- **Backend Issues**: Check `backend/README.md`
- **Frontend Issues**: Check `frontend/README.md`
- **Deployment**: Check `DEPLOYMENT.md`
- **Main Docs**: Check `README.md`

## Optional: Enable Chatbot

To enable the AI chatbot feature:

1. Get a Gemini API key from: https://makersuite.google.com/app/apikey

2. Add to `backend/.env`:
   ```env
   GEMINI_API_KEY=your-api-key-here
   ```

3. Restart the backend server

4. The chatbot icon will appear in the frontend

---

**That's it! You're all set up. Happy coding! 🎉**
