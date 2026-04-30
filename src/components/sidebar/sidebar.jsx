import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  CheckSquare,
  Calendar,
  BarChart,
  HelpCircle,
  Settings,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./sidebar.css";

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: CheckSquare, label: "My Tasks", path: "/my-tasks" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: BarChart, label: "Reports", path: "/reports" },
  ];

  const otherItems = [
    { icon: HelpCircle, label: "Help", path: "/help" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <nav className="mobile-navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">TaskMaster</h1>
        </div>
        <div className="navbar-right">
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Desktop Sidebar */}
      <aside className="sidebar-container">
        {/* HEADER */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">TaskMaster</h2>
        </div>

        {/* SEARCH */}

        {/* MENU CONTENT */}
        <div className="sidebar-content">
          <div className="sidebar-section">
            <p className="section-label">GENERAL</p>
            <nav className="sidebar-menu">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="sidebar-section">
            <p className="section-label">OTHERS</p>
            <nav className="sidebar-menu">
              {otherItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
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
          </div>
        </div>
      </aside>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'User'}</p>
              <p className="user-email">{user?.email || ''}</p>
            </div>
          </div>
          <button className="mobile-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div className="mobile-menu-items">
          <div className="mobile-section">
            <p className="mobile-section-label">Menu</p>
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`mobile-menu-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => handleNavClick(item.path)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mobile-section">
            <p className="mobile-section-label">Others</p>
            {otherItems.map((item) => (
              <button
                key={item.path}
                className={`mobile-menu-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => handleNavClick(item.path)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
