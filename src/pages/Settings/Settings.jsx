import { useState } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import { User, Lock, Bell, Palette, Save } from "lucide-react";
import "./Settings.css";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskReminders: true,
    projectUpdates: false
  });

  async function handleProfileUpdate(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await authAPI.updateProfile(profileData.name);
      updateUser({ name: profileData.name });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }
    try {
      setLoading(true);
      await authAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: "Password changed successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to change password" });
    } finally {
      setLoading(false);
    }
  }

  function showMessage(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  }

  return (
    <div className="settings-page">
      <Sidebar />
      <div className="settings-content">
        <div className="settings-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your account settings and preferences</p>
          </div>
        </div>

        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} />
            Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            <Lock size={18} />
            Password
          </button>
          <button 
            className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={18} />
            Notifications
          </button>
          <button 
            className={`tab-btn ${activeTab === "appearance" ? "active" : ""}`}
            onClick={() => setActiveTab("appearance")}
          >
            <Palette size={18} />
            Appearance
          </button>
        </div>

        <div className="settings-panel">
          {activeTab === "profile" && (
            <div className="panel-content">
              <h2 className="panel-title">Profile Information</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="disabled-input"
                  />
                  <span className="form-hint">Email cannot be changed</span>
                </div>
                <button type="submit" className="save-btn" disabled={loading}>
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="panel-content">
              <h2 className="panel-title">Change Password</h2>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>
                <button type="submit" className="save-btn" disabled={loading}>
                  <Save size={18} />
                  {loading ? "Saving..." : "Change Password"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="panel-content">
              <h2 className="panel-title">Notification Preferences</h2>
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Email Notifications</h4>
                    <p>Receive email updates about your tasks</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Task Reminders</h4>
                    <p>Get reminded about upcoming due dates</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={notifications.taskReminders}
                      onChange={(e) => setNotifications({ ...notifications, taskReminders: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Project Updates</h4>
                    <p>Receive notifications about project changes</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={notifications.projectUpdates}
                      onChange={(e) => setNotifications({ ...notifications, projectUpdates: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <button className="save-btn" onClick={() => showMessage("success", "Preferences saved!")}>
                <Save size={18} />
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="panel-content">
              <h2 className="panel-title">Appearance Settings</h2>
              <div className="form-group">
                <label>Theme</label>
                <div className="theme-options">
                  <button className="theme-option selected">
                    <div className="theme-preview light"></div>
                    <span>Light</span>
                  </button>
                  <button className="theme-option">
                    <div className="theme-preview dark"></div>
                    <span>Dark</span>
                  </button>
                  <button className="theme-option">
                    <div className="theme-preview system"></div>
                    <span>System</span>
                  </button>
                </div>
              </div>
              <button className="save-btn" onClick={() => showMessage("success", "Appearance settings saved!")}>
                <Save size={18} />
                Save Appearance
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
