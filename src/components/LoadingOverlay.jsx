import { motion } from 'motion/react';
import './LoadingOverlay.css';

export default function LoadingOverlay({ show, text = 'Loading...' }) {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <motion.div
        className="loading-overlay-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="loading-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 100 100" className="logo-svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="35" height="35" rx="8" fill="url(#logoGradient)" />
              <rect x="55" y="10" width="35" height="35" rx="8" fill="url(#logoGradient)" opacity="0.7" />
              <rect x="10" y="55" width="35" height="35" rx="8" fill="url(#logoGradient)" opacity="0.7" />
              <rect x="55" y="55" width="35" height="35" rx="8" fill="url(#logoGradient)" />
            </svg>
          </div>
        </div>
        <h1 className="loading-title">Task Manager</h1>
        <p className="loading-text">{text}</p>
        <div className="loading-progress">
          <div className="loading-progress-bar"></div>
        </div>
      </motion.div>
    </div>
  );
}
