import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Plus, ArrowLeft, CheckCircle2, Circle, Clock, AlertCircle, Inbox, Calendar } from 'lucide-react'
import Layout from '../components/Layout'
import SlideOver from '../components/SlideOver'
import * as projectsApi from '../api/projects'
import * as tasksApi from '../api/tasks'

const PRIORITY = {
  low: { label: 'Low', cls: 'text-info bg-info-soft' },
  medium: { label: 'Medium', cls: 'text-accent bg-accent-soft' },
  high: { label: 'High', cls: 'text-danger bg-danger-soft' }
}

const STATUS_META = {
  'todo':        { label: 'Todo',     icon: <Circle className="w-4 h-4 text-fg-dim" />,    next: 'in-progress' },
  'in-progress': { label: 'Doing',    icon: <Clock className="w-4 h-4 text-accent" />,      next: 'done' },
  'done':        { label: 'Done',     icon: <CheckCircle2 className="w-4 h-4 text-success" />, next: 'todo' }
}

const FILTERS = ['all', 'todo', 'in-progress', 'done']

function TaskForm({ projectId, task, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'todo',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = { ...form, dueDate: form.dueDate || undefined }
    try {
      if (task) {
        await tasksApi.updateTask(projectId, task._id, payload)
      } else {
        await tasksApi.createTask(projectId, payload)
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
        <label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Title</label>
        <input
          required
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="What needs doing?"
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
          rows={3}
          className="field-textarea"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Priority</label>
          <select
            value={form.priority}
            onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
            className="field"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Status</label>
          <select
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            className="field"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Due date</label>
        <input
          type="date"
          value={form.dueDate}
          onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
          className="field"
        />
      </div>
      {error && (
        <div className="flex items-start gap-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving' : task ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  )
}

export default function Project() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [panel, setPanel] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const [{ data: proj }, { data: taskList }] = await Promise.all([
        projectsApi.getProject(id),
        tasksApi.getTasks(id)
      ])
      setProject(proj)
      setTasks(taskList)
    } catch (err) {
      if (err.response?.status === 404) navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return
    await tasksApi.deleteTask(id, taskId)
    setTasks(prev => prev.filter(t => t._id !== taskId))
  }

  const handleCycleStatus = async (task) => {
    const next = STATUS_META[task.status].next
    await tasksApi.updateTask(id, task._id, { status: next })
    setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: next } : t))
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)
  const completed = tasks.filter(t => t.status === 'done').length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6 animate-pulse">
          <div className="h-4 w-32 bg-bg-surface rounded" />
          <div className="h-10 w-2/3 bg-bg-surface rounded-lg" />
          <div className="h-2 w-full bg-bg-surface rounded-full" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All projects
      </Link>

      <section className="mb-10 animate-slide-up">
        <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
          <div className="min-w-0">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-fg-dim mb-2.5">
              {project.status === 'active' ? 'Active project' : 'Archived'}
            </p>
            <h1 className="text-[32px] leading-tight font-semibold tracking-tight text-fg">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-fg-muted mt-3 max-w-2xl leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
          <button onClick={() => setPanel('create')} className="btn-primary shrink-0">
            <Plus className="w-4 h-4" />
            New task
          </button>
        </div>

        {tasks.length > 0 && (
          <div className="flex items-center gap-4 max-w-md">
            <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-mono text-fg-muted tabular-nums">
              {completed}/{tasks.length} · {progress}%
            </span>
          </div>
        )}
      </section>

      <div className="flex items-center gap-1 mb-4 p-1 bg-bg-subtle border border-border rounded-lg w-fit">
        {FILTERS.map(f => {
          const count = f === 'all' ? tasks.length : tasks.filter(t => t.status === f).length
          const label = f === 'all' ? 'All' : f === 'in-progress' ? 'Doing' : f === 'todo' ? 'Todo' : 'Done'
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 h-7 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                filter === f
                  ? 'bg-bg-elevated text-fg shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              {label}
              <span className={`text-[10px] font-mono ${filter === f ? 'text-fg-muted' : 'text-fg-dim'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border rounded-xl bg-bg-subtle">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-bg-surface border border-border mb-3">
            <Inbox className="w-4 h-4 text-fg-muted" />
          </div>
          <p className="text-sm font-medium text-fg">
            {filter === 'all' ? 'No tasks yet' : `Nothing ${filter === 'in-progress' ? 'in progress' : filter}`}
          </p>
          {filter === 'all' && (
            <p className="text-xs text-fg-muted mt-1">Add your first task to break this project down.</p>
          )}
        </div>
      ) : (
        <ul className="border border-border rounded-xl bg-bg-subtle overflow-hidden divide-y divide-border">
          {filtered.map(task => {
            const meta = STATUS_META[task.status]
            const isDone = task.status === 'done'
            return (
              <li
                key={task._id}
                className="group flex items-center gap-4 px-4 py-3 hover:bg-bg-surface transition-colors"
              >
                <button
                  onClick={() => handleCycleStatus(task)}
                  className="shrink-0 flex items-center justify-center w-6 h-6 rounded-md hover:bg-bg-elevated transition-colors"
                  title={`Mark as ${meta.next}`}
                >
                  {meta.icon}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-snug ${isDone ? 'line-through text-fg-dim' : 'text-fg'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-fg-muted mt-0.5 line-clamp-1">{task.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {task.dueDate && (
                    <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-fg-muted">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${PRIORITY[task.priority].cls}`}>
                    {PRIORITY[task.priority].label}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPanel(task)}
                      className="text-xs text-fg-muted hover:text-fg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-xs text-fg-muted hover:text-danger transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <SlideOver
        open={!!panel}
        onClose={() => setPanel(null)}
        title={panel === 'create' ? 'New task' : 'Edit task'}
        subtitle={panel === 'create' ? `Add to ${project.name}` : panel?.title}
      >
        {panel && (
          <TaskForm
            projectId={id}
            task={panel === 'create' ? null : panel}
            onClose={() => setPanel(null)}
            onSaved={() => { setPanel(null); fetchData() }}
          />
        )}
      </SlideOver>
    </Layout>
  )
}
