import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import { tasksAPI, projectsAPI } from "../../services/api";
import { Plus, Trash2, Edit, CheckCircle, Circle, Calendar, Flag, Folder } from "lucide-react";
import "./MyTasks.css";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    project_ids: []
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [filter]);

  async function fetchTasks() {
    try {
      setLoading(true);
      const statusFilter = filter === "all" ? {} : { status: filter };
      const data = await tasksAPI.getAll(statusFilter);
      setTasks(data.tasks);
    } catch (err) {
      console.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProjects() {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data.projects);
    } catch (err) {
      console.error("Failed to fetch projects");
    }
  }

  async function toggleTaskStatus(id, currentStatus) {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await tasksAPI.update(id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task");
    }
  }

  async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await tasksAPI.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete task");
    }
  }

  async function createTask(e) {
    e.preventDefault();
    try {
      await tasksAPI.create(newTask);
      setNewTask({ title: "", description: "", priority: "medium", due_date: "", project_ids: [] });
      setShowAddModal(false);
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task");
    }
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#22c55e";
      default: return "#6b7280";
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length
  };

  return (
    <div className="mytasks-page">
      <Sidebar />
      <div className="mytasks-content">
        <div className="tasks-header">
          <div>
            <h1 className="page-title">My Tasks</h1>
            <p className="page-subtitle">Manage and track your tasks</p>
          </div>
          <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Add Task
          </button>
        </div>

        <div className="tasks-stats">
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card completed">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
          <div className="stat-card in-progress">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats.inProgress}</span>
          </div>
        </div>

        <div className="tasks-filters">
          <button 
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Tasks
          </button>
          <button 
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === "in_progress" ? "active" : ""}`}
            onClick={() => setFilter("in_progress")}
          >
            In Progress
          </button>
          <button 
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <Circle size={48} />
            <h3>No tasks found</h3>
            <p>Create your first task to get started</p>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task.id} className={`task-card ${task.status === "completed" ? "completed" : ""}`}>
                <div className="task-checkbox">
                  <button 
                    className="checkbox-btn"
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                  >
                    {task.status === "completed" ? (
                      <CheckCircle size={22} className="checked" />
                    ) : (
                      <Circle size={22} />
                    )}
                  </button>
                </div>
                <div className="task-info">
                  <h3 className="task-title">{task.title}</h3>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-meta">
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) + "20", color: getPriorityColor(task.priority) }}
                    >
                      <Flag size={12} />
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="due-date">
                        <Calendar size={12} />
                        {formatDate(task.due_date)}
                      </span>
                    )}
                    {task.project_name && (
                      <span className="project-badge">
                        <Folder size={12} />
                        {task.project_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="task-actions">
                  <button className="action-btn edit" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button className="action-btn delete" onClick={() => deleteTask(task.id)} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Task</h2>
            <form onSubmit={createTask}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Project</label>
                <select
                  value={newTask.project_ids[0] || ""}
                  onChange={(e) => setNewTask({ ...newTask, project_ids: e.target.value ? [parseInt(e.target.value)] : [] })}
                >
                  <option value="">No Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
