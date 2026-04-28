import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DarkModeToggle from "./components/DarkModeToggle";
import KeyboardShortcutsModal from "./components/KeyboardShortcutsModal";
import './App.css';

// Auth pages
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

// Dashboard and sidebar pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Notifications from "./pages/Notifications/Notifications";
import MyTasks from "./pages/MyTasks/MyTasks";
import Calendar from "./pages/Calendar/Calendar";
import Reports from "./pages/Reports/Reports";
import Help from "./pages/Help/Help";
import Settings from "./pages/Settings/Settings";

function App() {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  
  return (
    <AuthProvider>
      <DarkModeProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/my-tasks" element={
              <ProtectedRoute>
                <MyTasks />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <DarkModeToggle />
          <KeyboardShortcutsModal isOpen={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} />
        </ToastProvider>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
