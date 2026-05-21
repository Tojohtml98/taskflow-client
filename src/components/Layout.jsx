import { Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-fg-muted font-mono px-2.5 py-1 rounded-md bg-bg-surface border border-border">
              {user?.email}
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
      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
