import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import { tasksAPI, reportsAPI, projectsAPI } from "../../services/api";
import { Plus, Trash2, CheckCircle, Circle, Calendar, Flag, Clock, AlertCircle, BarChart3, PieChart } from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const [taskInput, setTaskInput] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    project_id: ""
  });
  const [projects, setProjects] = useState([]);

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const year = today.getFullYear();
  const dateToShow = month + "/" + day + "/" + year;

  useEffect(() => {
    fetchDashboardData();
    fetchProjects();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const [tasksData, reportsData] = await Promise.all([
        tasksAPI.getAll(),
        reportsAPI.getDashboard()
      ]);
      setTaskList(tasksData.tasks);
      setStats(reportsData.stats);
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProjects() {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Failed to fetch projects");
      setProjects([]);
    }
  }

  async function addNewTask(e) {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await tasksAPI.create({
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        priority: newTask.priority,
        due_date: newTask.due_date || null,
        project_ids: newTask.project_id ? [parseInt(newTask.project_id)] : []
      });
      setNewTask({ title: "", description: "", priority: "medium", due_date: "", project_id: "" });
      setShowAddModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to add task");
    }
  }

  async function markDone(id, currentStatus) {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await tasksAPI.update(id, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update task");
    }
  }

  async function deleteTask(id) {
    try {
      await tasksAPI.delete(id);
      setTaskList(taskList.filter(task => task.id !== id));
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to delete task");
    }
  }

  if (loading) {
    return (
      <div className="dashboard-main-wrapper">
        <Sidebar />
        <div className="dashboard-main-content">
          <div className="loading-state">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const doneCount = stats?.completedTasks || 0;
  const pendingCount = stats?.pendingTasks || 0;
  const totalCount = stats?.totalTasks || taskList.length;
  const completionRate = stats?.completionRate || 0;
  const priorityData = stats?.priorityBreakdown || { high: 0, medium: 0, low: 0 };
  const statusData = stats?.statusBreakdown || { pending: 0, in_progress: 0, completed: 0 };

  // Calculate pie chart segments
  const totalForPie = priorityData.high + priorityData.medium + priorityData.low;
  const highPercent = totalForPie > 0 ? (priorityData.high / totalForPie) * 100 : 0;
  const mediumPercent = totalForPie > 0 ? (priorityData.medium / totalForPie) * 100 : 0;
  const lowPercent = totalForPie > 0 ? (priorityData.low / totalForPie) * 100 : 0;

  // Calculate cumulative percentages for gradient
  const highEnd = highPercent;
  const mediumEnd = highPercent + mediumPercent;

  // Calculate bar chart max value for scaling
  const maxBarValue = Math.max(statusData.pending, statusData.in_progress, statusData.completed, 1);

  return (
    <div className="dashboard-main-wrapper">
      <Sidebar />

      <div className="dashboard-main-content">
        <div className="top-header">
          <h1 className="page-title">Dashboard</h1>
          <div className="date-box">
            <Calendar size={18} />
            <span>{dateToShow}</span>
          </div>
        </div>

        {stats && (
          <>
            <div className="stats-row">
              <div className="stat-card total-tasks">
                <div className="stat-header">
                  <h3>Total Tasks</h3>
                  <BarChart3 size={20} className="stat-icon" />
                </div>
                <p className="stat-number">{totalCount}</p>
              </div>
              <div className="stat-card done-tasks">
                <div className="stat-header">
                  <h3>Completed</h3>
                  <CheckCircle size={20} className="stat-icon" />
                </div>
                <p className="stat-number">{doneCount}</p>
              </div>
              <div className="stat-card pending-tasks">
                <div className="stat-header">
                  <h3>Pending</h3>
                  <Clock size={20} className="stat-icon" />
                </div>
                <p className="stat-number">{pendingCount}</p>
              </div>
              <div className="stat-card completion-rate">
                <div className="stat-header">
                  <h3>Completion Rate</h3>
                  <PieChart size={20} className="stat-icon" />
                </div>
                <p className="stat-number">{completionRate}%</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
              {/* Priority Distribution - Pie Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Tasks by Priority</h3>
                  <Flag size={18} className="chart-icon" />
                </div>
                <div className="chart-content">
                  <div className="pie-chart-container">
                    <svg viewBox="0 0 100 100" className="pie-chart">
                      {totalForPie === 0 ? (
                        <circle cx="50" cy="50" r="40" fill="#e5e7eb" />
                      ) : (
                        <>
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="20"
                            strokeDasharray={`${highPercent * 2.51} ${251 - highPercent * 2.51}`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="20"
                            strokeDasharray={`${mediumPercent * 2.51} ${251 - mediumPercent * 2.51}`}
                            strokeDashoffset={-highPercent * 2.51}
                            transform="rotate(-90 50 50)"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="20"
                            strokeDasharray={`${lowPercent * 2.51} ${251 - lowPercent * 2.51}`}
                            strokeDashoffset={-(highPercent + mediumPercent) * 2.51}
                            transform="rotate(-90 50 50)"
                          />
                        </>
                      )}
                      <circle cx="50" cy="50" r="25" fill="white" />
                    </svg>
                    <div className="pie-chart-center">
                      <span className="pie-total">{totalForPie}</span>
                      <span className="pie-label">Tasks</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: "#ef4444" }}></span>
                      <span className="legend-label">High</span>
                      <span className="legend-value">{priorityData.high}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: "#f59e0b" }}></span>
                      <span className="legend-label">Medium</span>
                      <span className="legend-value">{priorityData.medium}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: "#22c55e" }}></span>
                      <span className="legend-label">Low</span>
                      <span className="legend-value">{priorityData.low}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Distribution - Bar Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Tasks by Status</h3>
                  <BarChart3 size={18} className="chart-icon" />
                </div>
                <div className="chart-content">
                  <div className="bar-chart-container">
                    <div className="bar-chart">
                      <div className="bar-item">
                        <div className="bar-wrapper">
                          <div
                            className="bar-fill bar-pending"
                            style={{ height: `${(statusData.pending / maxBarValue) * 100}%` }}
                          ></div>
                        </div>
                        <span className="bar-label">Pending</span>
                        <span className="bar-value">{statusData.pending}</span>
                      </div>
                      <div className="bar-item">
                        <div className="bar-wrapper">
                          <div
                            className="bar-fill bar-in-progress"
                            style={{ height: `${(statusData.in_progress / maxBarValue) * 100}%` }}
                          ></div>
                        </div>
                        <span className="bar-label">In Progress</span>
                        <span className="bar-value">{statusData.in_progress}</span>
                      </div>
                      <div className="bar-item">
                        <div className="bar-wrapper">
                          <div
                            className="bar-fill bar-completed"
                            style={{ height: `${(statusData.completed / maxBarValue) * 100}%` }}
                          ></div>
                        </div>
                        <span className="bar-label">Completed</span>
                        <span className="bar-value">{statusData.completed}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Quick Stats</h3>
                  <AlertCircle size={18} className="chart-icon" />
                </div>
                <div className="chart-content quick-stats">
                  <div className="quick-stat-item">
                    <div className="quick-stat-icon due-today">
                      <Calendar size={20} />
                    </div>
                    <div className="quick-stat-info">
                      <span className="quick-stat-label">Due Today</span>
                      <span className="quick-stat-value">{stats.tasksDueToday || 0}</span>
                    </div>
                  </div>
                  <div className="quick-stat-item">
                    <div className="quick-stat-icon overdue">
                      <AlertCircle size={20} />
                    </div>
                    <div className="quick-stat-info">
                      <span className="quick-stat-label">Overdue</span>
                      <span className="quick-stat-value">{stats.overdueTasks || 0}</span>
                    </div>
                  </div>
                  <div className="quick-stat-item">
                    <div className="quick-stat-icon projects">
                      <PieChart size={20} />
                    </div>
                    <div className="quick-stat-info">
                      <span className="quick-stat-label">Projects</span>
                      <span className="quick-stat-value">{stats.totalProjects || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="add-task-section">
          <div className="section-header">
            <h2>Quick Add Task</h2>
            <button className="add-btn" onClick={() => setShowAddModal(true)}>
              <Plus size={18} />
              New Task
            </button>
          </div>
          <form className="input-row" onSubmit={addNewTask}>
            <input
              type="text"
              className="task-input-box"
              placeholder="Type your task here..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button type="submit" className="add-btn primary">
              Add Task
            </button>
          </form>
        </div>

        <div className="task-list-section">
          <h2>Recent Tasks</h2>
          {taskList.length === 0 && (
            <p className="no-tasks-text">No tasks yet. Add one above!</p>
          )}
          {taskList.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.status === "completed" ? "task-done" : ""}`}
            >
              <div className="task-left">
                <button
                  className="checkbox-btn"
                  onClick={() => markDone(task.id, task.status)}
                >
                  {task.status === "completed" ? (
                    <CheckCircle size={20} className="checked" />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>
                <span className="task-name-text">{task.title}</span>
              </div>
              <button
                className="delete-task-btn"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Improved Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <Plus size={24} className="modal-icon" />
                <h2>Create New Task</h2>
              </div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <Trash2 size={20} style={{ transform: "rotate(45deg)" }} />
              </button>
            </div>

            <form onSubmit={addNewTask} className="task-form">
              <div className="form-section">
                <div className="form-section-title">Task Details</div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📝</span>
                    Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g., Complete project documentation"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📄</span>
                    Description
                  </label>
                  <textarea
                    className="form-textarea"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Add more details about your task..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Task Properties</div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">🚩</span>
                      Priority
                    </label>
                    <div className="priority-selector">
                      <button
                        type="button"
                        className={`priority-option ${newTask.priority === "high" ? "selected" : ""}`}
                        onClick={() => setNewTask({ ...newTask, priority: "high" })}
                      >
                        <span className="priority-dot high"></span>
                        High
                      </button>
                      <button
                        type="button"
                        className={`priority-option ${newTask.priority === "medium" ? "selected" : ""}`}
                        onClick={() => setNewTask({ ...newTask, priority: "medium" })}
                      >
                        <span className="priority-dot medium"></span>
                        Medium
                      </button>
                      <button
                        type="button"
                        className={`priority-option ${newTask.priority === "low" ? "selected" : ""}`}
                        onClick={() => setNewTask({ ...newTask, priority: "low" })}
                      >
                        <span className="priority-dot low"></span>
                        Low
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">📅</span>
                      Due Date
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">📁</span>
                      Project
                    </label>
                    <select
                      className="form-select"
                      value={newTask.project_id}
                      onChange={(e) => setNewTask({ ...newTask, project_id: e.target.value })}
                    >
                      <option value="">No Project</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-preview">
                <div className="preview-title">Task Preview</div>
                <div className="preview-card">
                  <div className="preview-title-text">{newTask.title || "Task title will appear here"}</div>
                  {newTask.description && (
                    <div className="preview-description">{newTask.description}</div>
                  )}
                  <div className="preview-meta">
                    <span className={`preview-badge priority-${newTask.priority}`}>
                      {newTask.priority}
                    </span>
                    {newTask.due_date && (
                      <span className="preview-due-date">
                        <Calendar size={12} />
                        {new Date(newTask.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <Plus size={18} />
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
