import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  CheckSquare,
  Calendar,
  Folder,
  BarChart,
  HelpCircle,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: CheckSquare, label: "My Tasks", path: "/my-tasks" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Folder, label: "Projects", path: "/projects" },
    { icon: BarChart, label: "Reports", path: "/reports" },
  ];

  const otherItems = [
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      {/* HEADER */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="sidebar-logo">🟨</span>
          {!collapsed && <h2 className="sidebar-title">Task Manager</h2>}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* SEARCH */}
      {!collapsed && (
        <div className="sidebar-search">
          <Search size={18} />
          <input placeholder="Quick search..." />
        </div>
      )}

      {/* MENU CONTENT */}
      <div className="sidebar-content">
        <div className="sidebar-section">
          {!collapsed && <p className="section-label">GENERAL</p>}
          <nav className="sidebar-menu">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${isActive(item.path) ? "active" : ""}`}
              >
                <item.icon />
                {!collapsed && item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sidebar-section">
          {!collapsed && <p className="section-label">OTHERS</p>}
          <nav className="sidebar-menu">
            {otherItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${isActive(item.path) ? "active" : ""}`}
              >
                <item.icon />
                {!collapsed && item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* USER PROFILE FOOTER */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
          </div>
          {!collapsed && (
            <>
              <div className="user-info">
                <p className="user-name">{user?.name || 'User'}</p>
                <p className="user-email">{user?.email || ''}</p>
              </div>
              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
