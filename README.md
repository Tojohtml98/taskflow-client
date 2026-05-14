# Task Manager Client

React frontend for the Task Manager application. Manage projects and tasks with a clean, responsive dashboard.

**Live demo:** [task-manager.vercel.app](https://task-manager.vercel.app) <!-- update after deploy -->

## Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP:** Axios with JWT interceptors and refresh token queue
- **Icons:** Lucide React

## Features

- Register / Login with JWT authentication
- Automatic token refresh — users stay logged in without interruption
- Create, edit and delete projects with status tracking
- Create, edit and delete tasks with priority, status and due date
- One-click status cycling on tasks (todo → in progress → done)
- Filter tasks by status
- Fully protected routes — unauthenticated users redirected to login
- Responsive layout

## Project Structure

```
src/
├── api/
│   ├── client.js       # Axios instance — JWT headers + refresh token interceptor
│   ├── auth.js
│   ├── projects.js
│   └── tasks.js
├── context/
│   └── AuthContext.jsx # Global auth state (login, register, logout)
├── components/
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
└── pages/
    ├── Login.jsx
    ├── Register.jsx
    ├── Dashboard.jsx   # Project list + CRUD
    └── Project.jsx     # Task list + CRUD + filters
```

## Getting Started

### Prerequisites
- Node.js 18+
- [task-manager-api](https://github.com/YOUR_USERNAME/task-manager-api) running on port 3000

### Local setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/task-manager-client
cd task-manager-client

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open `http://localhost:5173`. API requests are proxied to `http://localhost:3000` by Vite.

## Environment Variables

Only needed for production builds:

```env
VITE_API_URL=https://your-api-url.railway.app/api
```

In development, the Vite proxy handles API routing automatically — no env file needed.

## Scripts

```bash
npm run dev      # Start dev server at localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Backend

The REST API for this app lives at [task-manager-api](https://github.com/YOUR_USERNAME/task-manager-api).
