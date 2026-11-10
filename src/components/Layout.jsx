import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function BrandMark() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center w-7 h-7 rounded-md bg-accent">
        <div className="w-3 h-3 rounded-[3px] bg-bg ring-2 ring-bg group-hover:rotate-45 transition-transform duration-300" />
      </div>
      <span className="font-semibold tracking-tight text-fg text-[15px]">taskflow</span>
    </Link>
  )
}

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleCreateAccount = async () => {
    await logout()
    navigate('/register')
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-fg-muted font-mono px-2.5 py-1 rounded-md bg-bg-surface border border-border">
              {user?.isGuest ? 'guest session' : user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-8 h-8 rounded-md text-fg-muted hover:text-fg hover:bg-bg-surface transition-colors"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      {user?.isGuest && (
        <div className="border-b border-border bg-accent-soft/60">
          <div className="max-w-6xl mx-auto px-6 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <Sparkles className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
            <span className="text-fg-muted">
              You're exploring a guest workspace with sample data. It's deleted after 24 hours.
            </span>
            <button
              onClick={handleCreateAccount}
              className="font-medium text-accent hover:text-accent-hover underline underline-offset-4"
            >
              Create a free account
            </button>
          </div>
        </div>
      )}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
