import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import { reportsAPI, tasksAPI } from "../../services/api";
import { TrendingUp, CheckCircle, Clock, AlertCircle, Folder, BarChart3 } from "lucide-react";
import "./Reports.css";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [tasksByPriority, setTasksByPriority] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      setLoading(true);
      const data = await reportsAPI.getDashboard();
      setStats(data.stats);
      setRecentTasks(data.recentTasks);
      setTasksByPriority(data.tasksByPriority);
    } catch (err) {
      console.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }

  function getPriorityLabel(priority) {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
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

        {stats && (
          <>
            <div className="stats-overview">
              <div className="overview-card">
                <div className="overview-icon total">
                  <BarChart3 size={24} />
                </div>
                <div className="overview-info">
                  <span className="overview-label">Total Tasks</span>
                  <span className="overview-value">{stats.totalTasks}</span>
                </div>
              </div>
              <div className="overview-card">
                <div className="overview-icon completed">
                  <CheckCircle size={24} />
                </div>
                <div className="overview-info">
                  <span className="overview-label">Completed</span>
                  <span className="overview-value">{stats.completedTasks}</span>
                </div>
              </div>
              <div className="overview-card">
                <div className="overview-icon pending">
                  <Clock size={24} />
                </div>
                <div className="overview-info">
                  <span className="overview-label">Pending</span>
                  <span className="overview-value">{stats.pendingTasks}</span>
                </div>
              </div>
              <div className="overview-card">
                <div className="overview-icon rate">
                  <TrendingUp size={24} />
                </div>
                <div className="overview-info">
                  <span className="overview-label">Completion Rate</span>
                  <span className="overview-value">{stats.completionRate}%</span>
                </div>
              </div>
            </div>

            <div className="alerts-row">
              <div className="alert-card due-today">
                <AlertCircle size={24} />
                <div>
                  <span className="alert-value">{stats.dueToday}</span>
                  <span className="alert-label">Due Today</span>
                </div>
              </div>
              <div className="alert-card overdue">
                <AlertCircle size={24} />
                <div>
                  <span className="alert-value">{stats.overdue}</span>
                  <span className="alert-label">Overdue Tasks</span>
                </div>
              </div>
              <div className="alert-card projects">
                <Folder size={24} />
                <div>
                  <span className="alert-value">{stats.projects}</span>
                  <span className="alert-label">Active Projects</span>
                </div>
              </div>
            </div>

            <div className="reports-grid">
              <div className="report-card">
                <h3 className="report-title">Tasks by Priority</h3>
                <div className="priority-chart">
                  {tasksByPriority.map(item => {
                    const percentage = stats.totalTasks > 0 
                      ? Math.round((item.count / stats.totalTasks) * 100) 
                      : 0;
                    return (
                      <div key={item.priority} className="priority-item">
                        <div className="priority-header">
                          <span 
                            className="priority-name"
                            style={{ color: getPriorityColor(item.priority) }}
                          >
                            {getPriorityLabel(item.priority)}
                          </span>
                          <span className="priority-count">{item.count} tasks</span>
                        </div>
                        <div className="priority-bar">
                          <div 
                            className="priority-fill"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: getPriorityColor(item.priority)
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
          </>
        )}
      </div>
    </div>
  );
}
