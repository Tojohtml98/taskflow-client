import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Plus, ArrowLeft, Loader2, CheckCircle2, Circle, Clock } from 'lucide-react'
import Layout from '../components/Layout'
import * as projectsApi from '../api/projects'
import * as tasksApi from '../api/tasks'

const PRIORITY_STYLES = {
  low: 'bg-blue-50 text-blue-600',
  medium: 'bg-yellow-50 text-yellow-700',
  high: 'bg-red-50 text-red-600'
}

const STATUS_ICON = {
  'todo': <Circle className="w-4 h-4 text-muted-foreground" />,
  'in-progress': <Clock className="w-4 h-4 text-yellow-500" />,
  'done': <CheckCircle2 className="w-4 h-4 text-green-500" />
}

const FILTERS = ['all', 'todo', 'in-progress', 'done']

function TaskModal({ projectId, task, onClose, onSaved }) {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">{task ? 'Edit task' : 'New task'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <input
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Task title"
              className="w-full h-9 px-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              className="w-full h-9 px-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={onClose} className="h-9 px-4 text-sm border border-border rounded-lg hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="h-9 px-4 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Project() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState(null)

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

  const handleStatusChange = async (task, status) => {
    await tasksApi.updateTask(id, task._id, { status })
    setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status } : t))
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        All projects
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {project.status}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}
        </div>
        <button
          onClick={() => setModal('create')}
          className="flex items-center gap-1.5 h-9 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          New task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-muted p-1 rounded-lg w-fit">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 h-7 text-xs font-medium rounded-md capitalize transition ${
              filter === f
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? `All (${tasks.length})` : `${f} (${tasks.filter(t => t.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-36 text-center border border-dashed border-border rounded-xl">
          <p className="text-sm font-medium text-muted-foreground">No tasks here</p>
          {filter === 'all' && (
            <p className="text-xs text-muted-foreground mt-1">Create your first task</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => (
            <div key={task._id} className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 group hover:border-primary/30 transition">
              <button
                onClick={() => handleStatusChange(task, task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'done')}
                className="shrink-0"
                title="Cycle status"
              >
                {STATUS_ICON[task.status]}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}>
                  {task.priority}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => setModal(task)}
                    className="text-xs text-muted-foreground hover:text-foreground transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-xs text-muted-foreground hover:text-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <TaskModal
          projectId={id}
          task={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchData() }}
        />
      )}
    </Layout>
  )
}
