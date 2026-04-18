import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import { notificationsAPI } from "../../services/api";
import { Bell, Trash2, Check, CheckCheck, Clock, AlertCircle, Info, CheckCircle } from "lucide-react";
import "./Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const data = await notificationsAPI.getAll(filter === "unread");
      setNotifications(data.notifications);
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id) {
    try {
      await notificationsAPI.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read");
    }
  }

  async function markAllAsRead() {
    try {
      await notificationsAPI.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  }

  async function deleteNotification(id) {
    try {
      await notificationsAPI.delete(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification");
    }
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "warning":
        return <AlertCircle size={20} />;
      case "info":
      default:
        return <Info size={20} />;
    }
  }

  function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <div className="notifications-page">
      <Sidebar />
      <div className="notifications-content">
        <div className="notifications-header">
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">Stay updated with your tasks and projects</p>
          </div>
          <div className="notifications-actions">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
            </select>
            {filter === "unread" && notifications.length > 0 && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                <CheckCheck size={18} />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading notifications...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? "read" : "unread"}`}
              >
                <div className={`notification-icon ${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-body">
                  <h4 className="notification-title">{notification.title}</h4>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{getTimeAgo(notification.created_at)}</span>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="action-btn read-btn"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
