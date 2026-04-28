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

// CORS Configuration - Allow specific origins
const allowedOrigins = [
  'https://task-manager-kh55.onrender.com',
  'https://task-manager-gamma-seven-55.vercel.app',
  'https://task-manager-5go8fntdi-serumolas-projects.vercel.app',
  //'http://localhost:5173',
  //'http://localhost:3000'
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

console.log('CORS enabled for origins:', allowedOrigins.join(', '));
console.log('Server starting on port:', process.env.PORT || 5000);

// Apply CORS middleware FIRST
app.use(cors(corsOptions));

// Custom middleware to ensure CORS headers are always present
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, X-Content-Range');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// Explicit OPTIONS handler
app.options('*', (req, res) => {
  res.status(204).end();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
