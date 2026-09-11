import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function SlideOver({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-fg/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <aside className="absolute top-0 right-0 h-full w-full max-w-md bg-bg-subtle border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
        <header className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
            {subtitle && (
              <p className="text-xs text-fg-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md text-fg-muted hover:text-fg hover:bg-bg-surface transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </aside>
    </div>
  )
}
