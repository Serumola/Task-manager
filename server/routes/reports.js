import express from 'express';
import { getPool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();

    // Total tasks
    const totalResult = await pool.query(
      'SELECT COUNT(*) as count FROM tasks WHERE user_id = $1',
      [req.userId]
    );

    // Completed tasks
    const completedResult = await pool.query(
      "SELECT COUNT(*) as count FROM tasks WHERE user_id = $1 AND status = 'completed'",
      [req.userId]
    );

    // Pending tasks
    const pendingResult = await pool.query(
      "SELECT COUNT(*) as count FROM tasks WHERE user_id = $1 AND status != 'completed'",
      [req.userId]
    );

    // Tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueTodayResult = await pool.query(
      `SELECT COUNT(*) as count FROM tasks 
       WHERE user_id = $1 AND due_date >= $2 AND due_date < $3`,
      [req.userId, today.toISOString(), tomorrow.toISOString()]
    );

    // Overdue tasks
    const overdueResult = await pool.query(
      `SELECT COUNT(*) as count FROM tasks 
       WHERE user_id = $1 AND due_date < $2 AND status != 'completed'`,
      [req.userId, today.toISOString()]
    );

    // Projects count
    const projectsResult = await pool.query(
      'SELECT COUNT(*) as count FROM projects WHERE user_id = $1',
      [req.userId]
    );

    const total = parseInt(totalResult.rows[0].count);
    const completed = parseInt(completedResult.rows[0].count);
    const pending = parseInt(pendingResult.rows[0].count);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      stats: {
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending,
        completionRate,
        tasksDueToday: parseInt(dueTodayResult.rows[0].count),
        overdueTasks: parseInt(overdueResult.rows[0].count),
        totalProjects: parseInt(projectsResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// Get activity history
router.get('/activity', verifyToken, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const pool = await getPool();

    const result = await pool.query(
      `SELECT * FROM task_history 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [req.userId, parseInt(limit)]
    );

    res.json({ activity: result.rows });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to get activity' });
  }
});

// Get calendar data
router.get('/calendar', verifyToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    const pool = await getPool();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const result = await pool.query(
      `SELECT id, title, due_date, status, priority 
       FROM tasks 
       WHERE user_id = $1 AND due_date >= $2 AND due_date <= $3
       ORDER BY due_date`,
      [req.userId, startDate.toISOString(), endDate.toISOString()]
    );

    res.json({ tasks: result.rows });
  } catch (error) {
    console.error('Get calendar error:', error);
    res.status(500).json({ error: 'Failed to get calendar data' });
  }
});

export default router;
