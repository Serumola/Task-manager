import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import projectRoutes from './routes/projects.js';
import notificationRoutes from './routes/notifications.js';
import reportRoutes from './routes/reports.js';
import { getPool, initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Allow specific production origins
const allowedOrigins = [
  'https://task-manager-02e.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL // Add custom frontend URL from environment
].filter(Boolean);

// Regex pattern for Netlify preview URLs
const netlifyPreviewPattern = /^https:\/\/[a-f0-9-]+--task-manager-02e\.netlify\.app$/;

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 ||
        allowedOrigins.some(allowed => origin && origin.startsWith(allowed)) ||
        netlifyPreviewPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
console.log('CORS enabled for origins:', allowedOrigins.join(', '));

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle OPTIONS preflight requests explicitly
app.options('*', cors(corsOptions));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database tables
    await initDatabase();
    
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/reports', reportRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Task Manager API is running' });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
