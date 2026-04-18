import express from 'express';
import { getPool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';
import sql from 'mssql';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();

    // Task statistics
    const taskStatsResult = await pool.request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress
        FROM tasks
        WHERE user_id = @userId
      `);

    const taskStats = taskStatsResult.recordset[0];

    // Tasks due today
    const today = new Date().toISOString().split('T')[0];
    const dueTodayResult = await pool.request()
      .input('userId', sql.Int, req.userId)
      .input('today', sql.Date, today)
      .query(`
        SELECT COUNT(*) as count FROM tasks 
        WHERE user_id = @userId AND CAST(due_date AS DATE) = @today AND status != 'completed'
      `);

    // Overdue tasks
    const overdueResult = await pool.request()
      .input('userId', sql.Int, req.userId)
      .input('today', sql.Date, today)
      .query(`
        SELECT COUNT(*) as count FROM tasks 
        WHERE user_id = @userId AND CAST(due_date AS DATE) < @today AND status != 'completed'
      `);

    // Project count
    const projectCountResult = await pool.request()
      .input('userId', sql.Int, req.userId)
      .query('SELECT COUNT(*) as count FROM projects WHERE user_id = @userId');

    // Recent tasks
    const recentTasksResult = await pool.request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT TOP 5 * FROM tasks 
        WHERE user_id = @userId 
        ORDER BY created_at DESC
      `);

    // Tasks by priority
    const tasksByPriorityResult = await pool.request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT priority, COUNT(*) as count 
        FROM tasks 
        WHERE user_id = @userId 
        GROUP BY priority
      `);

    // Completion rate (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const completionDataResult = await pool.request()
      .input('userId', sql.Int, req.userId)
      .input('lastWeek', sql.DateTime2, lastWeek)
      .query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
        FROM tasks
        WHERE user_id = @userId AND created_at >= @lastWeek
      `);

    const completionData = completionDataResult.recordset[0];
    const completionRate = completionData.total > 0 
      ? Math.round((completionData.completed / completionData.total) * 100) 
      : 0;

    res.json({
      stats: {
        totalTasks: taskStats.total,
        completedTasks: taskStats.completed,
        pendingTasks: taskStats.pending,
        inProgressTasks: taskStats.in_progress,
        dueToday: dueTodayResult.recordset[0].count,
        overdue: overdueResult.recordset[0].count,
        projects: projectCountResult.recordset[0].count,
        completionRate
      },
      recentTasks: recentTasksResult.recordset,
      tasksByPriority: tasksByPriorityResult.recordset
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard statistics' });
  }
});

// Get activity history
router.get('/activity', verifyToken, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('userId', sql.Int, req.userId)
      .input('limit', sql.Int, parseInt(limit))
      .query(`
        SELECT TOP (@limit) th.*, t.title as task_title
        FROM task_history th
        LEFT JOIN tasks t ON th.task_id = t.id
        WHERE th.user_id = @userId
        ORDER BY th.created_at DESC
      `);

    res.json({ history: result.recordset });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to get activity history' });
  }
});

// Get calendar data (tasks with due dates)
router.get('/calendar', verifyToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    const pool = await getPool();
    
    let query = `
      SELECT id, title, due_date, status, priority 
      FROM tasks 
      WHERE user_id = @userId AND due_date IS NOT NULL
    `;
    
    const request = pool.request().input('userId', sql.Int, req.userId);

    if (month && year) {
      query += ` AND MONTH(due_date) = @month AND YEAR(due_date) = @year`;
      request.input('month', sql.Int, parseInt(month));
      request.input('year', sql.Int, parseInt(year));
    }

    query += ' ORDER BY due_date ASC';

    const result = await request.query(query);
    res.json({ tasks: result.recordset });
  } catch (error) {
    console.error('Get calendar error:', error);
    res.status(500).json({ error: 'Failed to get calendar data' });
  }
});

export default router;
