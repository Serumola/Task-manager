import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import { reportsAPI, tasksAPI } from "../../services/api";
import { TrendingUp, CheckCircle, Clock, AlertCircle, Folder, BarChart3 } from "lucide-react";
import "./Reports.css";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      setLoading(true);
      const [reportsData, tasksData] = await Promise.all([
        reportsAPI.getDashboard(),
        tasksAPI.getAll()
      ]);
      setStats(reportsData.stats);
      setRecentTasks(tasksData.tasks?.slice(0, 5) || []);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  function getPriorityLabel(priority) {
    return priority?.charAt(0).toUpperCase() + priority?.slice(1);
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
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  if (loading) {
    return (
      <div className="reports-page">
        <Sidebar />
        <div className="reports-content">
          <div className="loading-state">Loading reports...</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="reports-page">
        <Sidebar />
        <div className="reports-content">
          <div className="loading-state">
            <AlertCircle size={48} style={{ color: 'var(--gray-400)', marginBottom: '16px' }} />
            <p>Failed to load reports. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate priority breakdown from tasks
  const priorityCounts = recentTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, { high: 0, medium: 0, low: 0 });

  const totalTasks = stats.totalTasks || 0;

  return (
    <div className="reports-page">
      <Sidebar />
      <div className="reports-content">
        <div className="reports-header">
          <div>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">Track your productivity and task completion</p>
          </div>
        </div>

        <div className="stats-overview">
          <div className="overview-card">
            <div className="overview-icon total">
              <BarChart3 size={24} />
            </div>
            <div className="overview-info">
              <span className="overview-label">Total Tasks</span>
              <span className="overview-value">{stats.totalTasks || 0}</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon completed">
              <CheckCircle size={24} />
            </div>
            <div className="overview-info">
              <span className="overview-label">Completed</span>
              <span className="overview-value">{stats.completedTasks || 0}</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon pending">
              <Clock size={24} />
            </div>
            <div className="overview-info">
              <span className="overview-label">Pending</span>
              <span className="overview-value">{stats.pendingTasks || 0}</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon rate">
              <TrendingUp size={24} />
            </div>
            <div className="overview-info">
              <span className="overview-label">Completion Rate</span>
              <span className="overview-value">{stats.completionRate || 0}%</span>
            </div>
          </div>
        </div>

        <div className="alerts-row">
          <div className="alert-card due-today">
            <AlertCircle size={24} />
            <div>
              <span className="alert-value">{stats.tasksDueToday || 0}</span>
              <span className="alert-label">Due Today</span>
            </div>
          </div>
          <div className="alert-card overdue">
            <AlertCircle size={24} />
            <div>
              <span className="alert-value">{stats.overdueTasks || 0}</span>
              <span className="alert-label">Overdue Tasks</span>
            </div>
          </div>
          <div className="alert-card projects">
            <Folder size={24} />
            <div>
              <span className="alert-value">{stats.totalProjects || 0}</span>
              <span className="alert-label">Active Projects</span>
            </div>
          </div>
        </div>

        <div className="reports-grid">
          <div className="report-card">
            <h3 className="report-title">Tasks by Priority</h3>
            <div className="priority-chart">
              {['high', 'medium', 'low'].map(priority => {
                const count = priorityCounts[priority] || 0;
                const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                return (
                  <div key={priority} className="priority-item">
                    <div className="priority-header">
                      <span
                        className="priority-name"
                        style={{ color: getPriorityColor(priority) }}
                      >
                        {getPriorityLabel(priority)}
                      </span>
                      <span className="priority-count">{count} tasks</span>
                    </div>
                    <div className="priority-bar">
                      <div
                        className="priority-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getPriorityColor(priority)
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="report-card">
            <h3 className="report-title">Recent Tasks</h3>
            <div className="recent-tasks-list">
              {recentTasks.length === 0 ? (
                <p className="no-tasks">No tasks yet</p>
              ) : (
                recentTasks.map(task => (
                  <div key={task.id} className="recent-task-item">
                    <div className="recent-task-info">
                      <h4 className="recent-task-title">{task.title}</h4>
                      <span className={`task-status ${task.status}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                    <span className="recent-task-date">{formatDate(task.created_at)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
