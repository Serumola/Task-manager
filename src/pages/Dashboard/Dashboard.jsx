import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import { tasksAPI, reportsAPI } from "../../services/api";
import { Plus, Trash2, CheckCircle, Circle, Calendar } from "lucide-react";
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
    due_date: ""
  });

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const year = today.getFullYear();
  const dateToShow = month + "/" + day + "/" + year;

  useEffect(() => {
    fetchDashboardData();
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

  async function addNewTask(e) {
    e.preventDefault();
    if (taskInput === "") return;

    try {
      await tasksAPI.create({
        title: taskInput,
        description: "",
        priority: "medium",
        due_date: ""
      });
      setTaskInput("");
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
          <div className="stats-row">
            <div className="stat-card total-tasks">
              <h3>Total Tasks</h3>
              <p className="stat-number">{totalCount}</p>
            </div>
            <div className="stat-card done-tasks">
              <h3>Completed</h3>
              <p className="stat-number">{doneCount}</p>
            </div>
            <div className="stat-card pending-tasks">
              <h3>Pending</h3>
              <p className="stat-number">{pendingCount}</p>
            </div>
            <div className="stat-card completion-rate">
              <h3>Completion Rate</h3>
              <p className="stat-number">{stats.completionRate}%</p>
            </div>
          </div>
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

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Task</h2>
            <form onSubmit={addNewTask}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                  autoFocus
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
