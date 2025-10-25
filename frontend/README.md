# KLH Campus Hub - Frontend

React + Vite frontend for the KLH University Smart Campus Hub platform.

## Features

- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons
- **Authentication**: Login/Register with JWT
- **Dashboard**: Overview of campus activities
- **Lost & Found**: Browse and report lost/found items
- **Events**: View and register for campus events
- **Feedback**: Submit and track feedback
- **Clubs**: Join clubs and view activities
- **Real-time Updates**: WebSocket notifications
- **AI Chatbot**: Campus assistant (optional)
- **Dark Mode**: Light/dark theme support
- **Responsive**: Mobile-friendly design

## Tech Stack

- React 18
- Vite
- React Router
- TanStack Query (React Query)
- Zustand (State Management)
- Axios
- Tailwind CSS
- React Hot Toast
- Lucide React (Icons)
- date-fns

## Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example):
   ```bash
   copy .env.example .env  # On Windows
   # cp .env.example .env  # On Linux/Mac
   ```

4. **Edit .env** if needed (default values work with local backend):
   ```
   VITE_API_BASE_URL=http://localhost:8000
   VITE_WS_BASE_URL=ws://localhost:8000
   ```

5. **Run development server**:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ChatBot.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LostFound.jsx
│   │   ├── Events.jsx
│   │   ├── Feedback.jsx
│   │   ├── Clubs.jsx
│   │   └── Profile.jsx
│   ├── store/            # Zustand stores
│   │   ├── authStore.js
│   │   └── notificationStore.js
│   ├── lib/              # Utilities
│   │   ├── api.js        # Axios instance
│   │   └── websocket.js  # WebSocket service
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Features Guide

### Authentication

- **Register**: Create a new account (Student/Faculty)
- **Login**: Sign in with email and password
- **Profile**: View and edit your profile

### Lost & Found

- Report lost or found items
- Search and filter items by category
- Claim items with verification
- Admin approval workflow

### Events

- Browse upcoming campus events
- Register for events
- Faculty can create and manage events
- Real-time registration updates

### Feedback

- Submit feedback/grievances
- Anonymous submission option
- Track feedback status
- Faculty/Admin can respond

### Clubs

- Browse student clubs by category
- Join/leave clubs
- View club activities
- Coordinators can post updates

### Notifications

- Real-time WebSocket notifications
- Unread count indicator
- Mark as read functionality

### Chatbot

- AI-powered campus assistant
- Context-aware responses
- Chat history

## Deployment

### For Render.com (Static Site)

1. Build the project: `npm run build`
2. Create a new Static Site on Render
3. Connect your GitHub repository
4. Set build command: `npm install && npm run build`
5. Set publish directory: `dist`
6. Add environment variables
7. Deploy!

### For Netlify

1. Build: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up redirects for SPA routing

### For Vercel

1. Import project from GitHub
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables
6. Deploy!

## Environment Variables

- `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:8000)
- `VITE_WS_BASE_URL`: WebSocket URL (default: ws://localhost:8000)

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Logo

Replace the logo in `Navbar.jsx` component.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT
