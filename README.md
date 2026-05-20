# Taskflow Client

> React + Vite frontend for [Taskflow API](https://github.com/Tojohtml98/taskflow-api) — JWT auth flow with silent refresh, project & task CRUD, fully responsive.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deployed](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)](https://taskflow-client-nu.vercel.app)

### 🚀 Live

| | Link |
|---|---|
| **App** | https://taskflow-client-nu.vercel.app |
| **API** | https://taskflow-api-mti1.onrender.com |
| **Repo (API)** | [taskflow-api](https://github.com/Tojohtml98/taskflow-api) |

> ⚠️ The backend runs on Render free tier — the first request after idle may take ~30s while the service wakes up.

### Highlights

- 🔐 **Silent token refresh** — Axios interceptor queues concurrent requests during refresh, no race conditions
- 🧭 **Protected routing** — React Router v6 + `ProtectedRoute` wrapper, unauthenticated users redirected
- 🎯 **Optimistic UX** — one-click task status cycling (`todo → in progress → done`)
- 📱 **Responsive** — Tailwind utility classes, works on mobile/tablet/desktop
- ♻️ **Centralized state** — Context API for auth, plain hooks for everything else (no Redux overhead)

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
- [taskflow-api](https://github.com/Tojohtml98/taskflow-api) running on port 3000

### Local setup

```bash
# 1. Clone the repo
git clone https://github.com/Tojohtml98/taskflow-client
cd taskflow-client

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open `http://localhost:5173`. API requests are proxied to `http://localhost:3000` by Vite.

## Environment Variables

Only needed for production builds:

```env
VITE_API_URL=https://taskflow-api-mti1.onrender.com/api
```

In development, the Vite proxy handles API routing automatically — no env file needed.

## Scripts

```bash
npm run dev      # Start dev server at localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Backend

The REST API for this app lives at [taskflow-api](https://github.com/Tojohtml98/taskflow-api).
