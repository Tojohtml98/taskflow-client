import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, ArrowUpRight, AlertCircle, Inbox } from 'lucide-react'
import Layout from '../components/Layout'
import SlideOver from '../components/SlideOver'
import * as projectsApi from '../api/projects'

function StatusDot({ status }) {
  const color = status === 'active' ? 'bg-success' : 'bg-fg-dim'
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-fg-muted uppercase tracking-wider">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      {status}
    </span>
  )
}

function ProjectForm({ project, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'active'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (project) {
        await projectsApi.updateProject(project._id, form)
      } else {
        await projectsApi.createProject(form)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Name</label>
        <input
          required
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="What are you working on?"
          autoFocus
          className="field"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Optional context"
          rows={4}
          className="field-textarea"
        />
      </div>
      {project && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Status</label>
          <select
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            className="field"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving' : project ? 'Save changes' : 'Create project'}
        </button>
      </div>
    </form>
  )
}

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [panel, setPanel] = useState(null)
  const navigate = useNavigate()

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await projectsApi.getProjects()
      setProjects(data)
    } catch {
      // handled by interceptor on 401
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!confirm('Delete this project? This cannot be undone.')) return
    await projectsApi.deleteProject(id)
    setProjects(prev => prev.filter(p => p._id !== id))
  }

  const activeCount = projects.filter(p => p.status === 'active').length

  return (
    <Layout>
      <section className="mb-10 animate-slide-up">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-fg-dim mb-2.5">
          Workspace
        </p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-serif italic font-normal text-[40px] leading-none tracking-tight text-fg">
              Projects
            </h1>
            <p className="text-sm text-fg-muted mt-3">
              {loading
                ? 'Loading'
                : projects.length === 0
                ? 'Nothing here yet'
                : `${activeCount} active · ${projects.length} total`}
            </p>
          </div>
          <button onClick={() => setPanel('create')} className="btn-primary">
            <Plus className="w-4 h-4" />
            New project
          </button>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[148px] rounded-xl bg-bg-surface border border-border animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-border rounded-xl bg-bg-subtle">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-bg-surface border border-border mb-5">
            <Inbox className="w-5 h-5 text-fg-muted" />
          </div>
          <p className="font-serif italic font-normal text-2xl text-fg leading-none">Quiet here.</p>
          <p className="text-sm text-fg-muted mt-3 max-w-sm">Your first project is where focus begins. Name it, scope it, start.</p>
          <button onClick={() => setPanel('create')} className="btn-primary mt-7">
            <Plus className="w-4 h-4" />
            New project
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <article
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="group relative bg-bg-subtle border border-border rounded-xl p-5 cursor-pointer hover:border-border-strong hover:bg-bg-surface transition-colors"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-bg-surface border border-border group-hover:border-accent/40 group-hover:text-accent transition-colors">
                  <FolderOpen className="w-4 h-4 text-fg-muted group-hover:text-accent transition-colors" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-fg-dim group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-semibold text-fg leading-snug line-clamp-1 mb-1">
                {project.name}
              </h3>
              {project.description ? (
                <p className="text-sm text-fg-muted line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              ) : (
                <p className="text-sm text-fg-dim italic">No description</p>
              )}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                <StatusDot status={project.status} />
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => { e.stopPropagation(); setPanel(project) }}
                    className="text-xs text-fg-muted hover:text-fg transition-colors"
                  >
                    Edit
                  </button>
                  <span className="text-fg-dim text-xs">·</span>
                  <button
                    onClick={e => handleDelete(e, project._id)}
                    className="text-xs text-fg-muted hover:text-danger transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <SlideOver
        open={!!panel}
        onClose={() => setPanel(null)}
        title={panel === 'create' ? 'New project' : 'Edit project'}
        subtitle={panel === 'create' ? 'Define the scope of your work' : panel?.name}
      >
        {panel && (
          <ProjectForm
            project={panel === 'create' ? null : panel}
            onClose={() => setPanel(null)}
            onSaved={() => { setPanel(null); fetchProjects() }}
          />
        )}
      </SlideOver>
    </Layout>
  )
}
