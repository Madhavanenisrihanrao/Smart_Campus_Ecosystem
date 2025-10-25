# Deployment Guide for KLH Campus Hub

This guide covers deploying the KLH Campus Hub platform to free hosting services.

## Deployment Options

### Option 1: Render.com (Recommended)

Render offers free tier for both backend and frontend.

#### Backend Deployment (Render Web Service)

1. **Prepare the project**:
   - Ensure `requirements.txt` is up to date
   - Add a `build.sh` script (optional)

2. **Create Web Service on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the backend directory or use root path filter

3. **Configure the service**:
   ```
   Name: campus-hub-backend
   Environment: Python 3
   Build Command: pip install -r backend/requirements.txt && cd backend && python manage.py migrate
   Start Command: cd backend && daphne -b 0.0.0.0 -p $PORT campus_hub.asgi:application
   ```

4. **Environment Variables** (add in Render dashboard):
   ```
   SECRET_KEY=<generate-a-secure-random-key>
   DEBUG=False
   ALLOWED_HOSTS=.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
   GEMINI_API_KEY=<your-gemini-api-key>
   ```

5. **Deploy**: Click "Create Web Service"

6. **Post-deployment**:
   - Note the backend URL (e.g., `https://campus-hub-backend.onrender.com`)
   - Create superuser via Render shell

#### Frontend Deployment (Render Static Site)

1. **Create Static Site on Render**:
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the frontend directory

2. **Configure the service**:
   ```
   Name: campus-hub-frontend
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```

3. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_WS_BASE_URL=wss://your-backend-url.onrender.com
   ```

4. **Add Redirects** for SPA routing:
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

5. **Deploy**: Click "Create Static Site"

---

### Option 2: Railway.app

Railway offers free tier with PostgreSQL database.

#### Backend on Railway

1. **Create new project** on [Railway](https://railway.app/)
2. **Add PostgreSQL** (optional, for production database)
3. **Deploy from GitHub**
4. **Set environment variables**
5. **Configure start command**: `daphne -b 0.0.0.0 -p $PORT campus_hub.asgi:application`

#### Frontend on Vercel/Netlify

Deploy the frontend separately on Vercel or Netlify (see below).

---

### Option 3: Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel

1. **Import project** from GitHub
2. **Configure**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
3. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_WS_BASE_URL=wss://your-backend-url.onrender.com
   ```
4. **Deploy**

#### Backend on Render

Follow steps from Option 1 above.

---

### Option 4: Netlify (Frontend) + Render (Backend)

#### Frontend on Netlify

1. **Connect repository** on [Netlify](https://www.netlify.com/)
2. **Build settings**:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
3. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_WS_BASE_URL=wss://your-backend-url.onrender.com
   ```
4. **Add Redirects**:
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```
5. **Deploy**

---

## Production Checklist

### Backend

- [ ] Set `DEBUG=False`
- [ ] Generate secure `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up `CORS_ALLOWED_ORIGINS`
- [ ] Use PostgreSQL instead of SQLite (recommended)
- [ ] Set up static files hosting
- [ ] Configure media files storage
- [ ] Set up SSL/HTTPS
- [ ] Create superuser account
- [ ] Set `GEMINI_API_KEY` (for chatbot)

### Frontend

- [ ] Update API URLs in `.env`
- [ ] Test WebSocket connection
- [ ] Configure redirects for SPA
- [ ] Optimize build size
- [ ] Test on different devices
- [ ] Set up error tracking (optional)

---

## Database Migration to PostgreSQL (Production)

For production, replace SQLite with PostgreSQL:

1. **Add to requirements.txt**:
   ```
   psycopg2-binary==2.9.9
   ```

2. **Update settings.py**:
   ```python
   import dj_database_url
   
   DATABASES = {
       'default': dj_database_url.config(
           default='sqlite:///db.sqlite3',
           conn_max_age=600
       )
   }
   ```

3. **Set DATABASE_URL** environment variable in Render:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

---

## Custom Domain Setup

### Render

1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

### Vercel/Netlify

1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

---

## Monitoring & Logs

### Render

- Access logs in the "Logs" tab
- Set up log drains for external monitoring

### Vercel

- Check deployment logs in dashboard
- Use Analytics (free tier available)

### Netlify

- View deploy logs
- Use Analytics (paid feature)

---

## Environment Variables Reference

### Backend (Render)

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=.onrender.com,your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.onrender.com,https://your-domain.com
DATABASE_URL=postgresql://user:password@host:port/database
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (Vercel/Netlify)

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_WS_BASE_URL=wss://your-backend.onrender.com
```

---

## Troubleshooting

### Backend Issues

**Static files not loading**:
- Run `python manage.py collectstatic` during build
- Configure static files hosting

**WebSocket not connecting**:
- Check CORS settings
- Verify WSS protocol for HTTPS
- Check Render WebSocket support

**Database errors**:
- Run migrations: `python manage.py migrate`
- Check DATABASE_URL environment variable

### Frontend Issues

**API calls failing**:
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings on backend
- Verify API endpoints are accessible

**WebSocket not working**:
- Use `wss://` for HTTPS sites
- Check WebSocket URL configuration
- Verify backend WebSocket support

**Routing not working**:
- Add `_redirects` file for Netlify
- Configure rewrites for Vercel
- Check SPA routing setup

---

## Post-Deployment Testing

1. **Authentication**:
   - Register new user
   - Login/logout
   - Test role-based access

2. **Lost & Found**:
   - Report item
   - Search items
   - Claim item

3. **Events**:
   - Create event (faculty/admin)
   - Register for event
   - Check notifications

4. **Feedback**:
   - Submit feedback
   - Submit anonymous feedback
   - Respond (faculty/admin)

5. **Clubs**:
   - Join club
   - View activities
   - Leave club

6. **Real-time**:
   - Test WebSocket notifications
   - Check notification counter

7. **Chatbot**:
   - Send messages
   - Verify responses

---

## Support

For deployment issues:
- Check Render/Vercel/Netlify documentation
- Review application logs
- Check environment variables
- Verify build commands

---

**Good luck with your deployment! 🚀**
