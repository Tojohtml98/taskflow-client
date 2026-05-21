import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col px-6">
      <header className="pt-8">
        <Link to="/login" className="inline-flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-accent">
            <div className="w-3 h-3 rounded-[3px] bg-bg" />
          </div>
          <span className="font-semibold tracking-tight text-fg text-[15px]">taskflow</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center -mt-12">
        <div className="w-full max-w-[380px] animate-fade-in">
          <div className="mb-8">
            <h1 className="text-[28px] font-semibold tracking-tight text-fg leading-tight">
              Start something focused.
            </h1>
            <p className="text-sm text-fg-muted mt-1.5">
              Create your account in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-fg-muted uppercase tracking-wider">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="field"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-fg-muted uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="field"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-fg-muted uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="At least 6 characters"
                className="field"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-10 inline-flex items-center justify-center gap-2 text-sm font-medium rounded-lg bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              <span>{loading ? 'Creating account' : 'Create account'}</span>
              {!loading && (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <p className="text-sm text-fg-muted mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-fg font-medium underline underline-offset-4 decoration-border-strong hover:decoration-accent transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
