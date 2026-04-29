import express from 'express';
import { getPool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, priority, project_id } = req.query;
    const pool = await getPool();

    let query = `
      SELECT t.*, p.name as project_name, p.color as project_color
      FROM tasks t
      LEFT JOIN task_projects tp ON t.id = tp.task_id
      LEFT JOIN projects p ON tp.project_id = p.id
      WHERE t.user_id = $1
    `;
    const params = [req.userId];
    let paramCount = 2;

    if (status) {
      query += ` AND t.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (priority) {
      query += ` AND t.priority = $${paramCount}`;
      params.push(priority);
      paramCount++;
    }

    if (project_id) {
      query += ` AND tp.project_id = $${paramCount}`;
      params.push(parseInt(project_id));
      paramCount++;
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ tasks: result.rows });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Get single task
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.query(
      `SELECT t.*, p.name as project_name, p.color as project_color
       FROM tasks t
       LEFT JOIN task_projects tp ON t.id = tp.task_id
       LEFT JOIN projects p ON tp.project_id = p.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
});

// Create new task
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, status, priority, due_date, project_id } = req.body;
    const pool = await getPool();

    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.userId, title, description || null, status || 'pending', priority || 'medium', due_date || null]
    );

    const task = result.rows[0];

    // If project_id is provided, link task to project
    if (project_id) {
      await pool.query(
        `INSERT INTO task_projects (task_id, project_id) VALUES ($1, $2)`,
        [task.id, project_id]
      );
    }

    // Log history
    await pool.query(
      `INSERT INTO task_history (task_id, user_id, action, new_value)
       VALUES ($1, $2, $3, $4)`,
      [task.id, req.userId, 'created', JSON.stringify({ title: task.title })]
    );

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, status, priority, due_date, completed, project_id } = req.body;
    const pool = await getPool();

    // Get old task data for history
    const oldResult = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    if (oldResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const oldTask = oldResult.rows[0];
    
    // Handle completed_at timestamp based on status and completed flag
    let completed_at = oldTask.completed_at;
    if (completed !== undefined) {
      completed_at = completed ? new Date().toISOString() : null;
    }
    // Also update completed_at if status changes to/from completed
    if (status !== undefined) {
      if (status === 'completed') {
        completed_at = new Date().toISOString();
      } else if (oldTask.status === 'completed' && status !== 'completed') {
        completed_at = null;
      }
    }

    // Build dynamic update query - only update fields that are provided
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined && title !== null) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (status !== undefined && status !== null) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    if (priority !== undefined && priority !== null) {
      updates.push(`priority = $${paramCount}`);
      values.push(priority);
      paramCount++;
    }
    if (due_date !== undefined) {
      updates.push(`due_date = $${paramCount}`);
      values.push(due_date);
      paramCount++;
    }
    
    // Always update completed_at and updated_at
    updates.push(`completed_at = $${paramCount}`);
    values.push(completed_at);
    paramCount++;
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updates.length === 2) {
      // Only completed_at and updated_at - no fields to update
      return res.json({ task: oldTask, message: 'No changes made' });
    }

    values.push(req.params.id);
    values.push(req.userId);

    const result = await pool.query(
      `UPDATE tasks
       SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
       RETURNING *`,
      values
    );

    const task = result.rows[0];

    // Update project association only if project_id is explicitly provided
    if (project_id !== undefined) {
      await pool.query('DELETE FROM task_projects WHERE task_id = $1', [task.id]);
      if (project_id) {
        await pool.query('INSERT INTO task_projects (task_id, project_id) VALUES ($1, $2)', [task.id, project_id]);
      }
    }

    // Log history (don't fail if history logging fails)
    try {
      await pool.query(
        `INSERT INTO task_history (task_id, user_id, action, old_value, new_value)
         VALUES ($1, $2, $3, $4, $5)`,
        [task.id, req.userId, 'updated', JSON.stringify(oldTask), JSON.stringify(task)]
      );
    } catch (historyErr) {
      console.error('Failed to log task history:', historyErr);
    }

    res.json({ task, message: 'Task updated successfully' });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get task history
router.get('/:id/history', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.query(
      `SELECT * FROM task_history 
       WHERE task_id = $1 AND user_id = $2 
       ORDER BY created_at DESC`,
      [req.params.id, req.userId]
    );

    res.json({ history: result.rows });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// Get task stats
router.get('/stats/summary', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();

    const totalResult = await pool.query(
      'SELECT COUNT(*) as count FROM tasks WHERE user_id = $1',
      [req.userId]
    );

    const doneResult = await pool.query(
      "SELECT COUNT(*) as count FROM tasks WHERE user_id = $1 AND status = 'completed'",
      [req.userId]
    );

    const pendingResult = await pool.query(
      "SELECT COUNT(*) as count FROM tasks WHERE user_id = $1 AND status != 'completed'",
      [req.userId]
    );

    const total = parseInt(totalResult.rows[0].count);
    const done = parseInt(doneResult.rows[0].count);
    const pending = parseInt(pendingResult.rows[0].count);
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    res.json({
      stats: {
        totalTasks: total,
        completedTasks: done,
        pendingTasks: pending,
        completionRate
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
