import express from 'express';
import { getPool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';
import sql from 'mssql';

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
      WHERE t.user_id = @userId
    `;

    const request = pool.request().input('userId', sql.Int, req.userId);

    if (status) {
      query += ' AND t.status = @status';
      request.input('status', sql.NVarChar, status);
    }

    if (priority) {
      query += ' AND t.priority = @priority';
      request.input('priority', sql.NVarChar, priority);
    }

    if (project_id) {
      query += ' AND tp.project_id = @project_id';
      request.input('project_id', sql.Int, parseInt(project_id));
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await request.query(query);
    res.json({ tasks: result.recordset });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Get single task
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT t.*, p.name as project_name, p.color as project_color
        FROM tasks t
        LEFT JOIN task_projects tp ON t.id = tp.task_id
        LEFT JOIN projects p ON tp.project_id = p.id
        WHERE t.id = @id AND t.user_id = @userId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.recordset[0] });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
});

// Create new task
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, priority, due_date, project_ids } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const pool = await getPool();

    const result = await pool.request()
      .input('userId', sql.Int, req.userId)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description || null)
      .input('priority', sql.NVarChar, priority || 'medium')
      .input('due_date', sql.DateTime2, due_date || null)
      .query(`
        INSERT INTO tasks (user_id, title, description, priority, due_date, status)
        OUTPUT INSERTED.*
        VALUES (@userId, @title, @description, @priority, @due_date, 'pending')
      `);

    const task = result.recordset[0];

    // Log history
    await pool.request()
      .input('task_id', sql.Int, task.id)
      .input('userId', sql.Int, req.userId)
      .input('new_value', sql.NVarChar, JSON.stringify({ title, description, priority, due_date }))
      .query(`
        INSERT INTO task_history (task_id, user_id, action, new_value)
        VALUES (@task_id, @userId, 'created', @new_value)
      `);

    // Associate with projects if provided
    if (project_ids && Array.isArray(project_ids)) {
      for (const projectId of project_ids) {
        await pool.request()
          .input('task_id', sql.Int, task.id)
          .input('project_id', sql.Int, projectId)
          .query('INSERT INTO task_projects (task_id, project_id) VALUES (@task_id, @project_id)');
      }
    }

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, priority, due_date, status, project_ids } = req.body;
    const taskId = req.params.id;
    const pool = await getPool();

    // Check if task exists and belongs to user
    const existingTask = await pool.request()
      .input('id', sql.Int, taskId)
      .input('userId', sql.Int, req.userId)
      .query('SELECT * FROM tasks WHERE id = @id AND user_id = @userId');

    if (existingTask.recordset.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = existingTask.recordset[0];
    const updates = [];
    const params = { id: taskId, userId: req.userId };
    const changes = {};

    if (title !== undefined) {
      updates.push('title = @title');
      params.title = title;
      changes.title = { old: task.title, new: title };
    }
    if (description !== undefined) {
      updates.push('description = @description');
      params.description = description;
      changes.description = { old: task.description, new: description };
    }
    if (priority !== undefined) {
      updates.push('priority = @priority');
      params.priority = priority;
      changes.priority = { old: task.priority, new: priority };
    }
    if (due_date !== undefined) {
      updates.push('due_date = @due_date');
      params.due_date = due_date;
      changes.due_date = { old: task.due_date, new: due_date };
    }
    if (status !== undefined) {
      updates.push('status = @status');
      params.status = status;
      changes.status = { old: task.status, new: status };
      if (status === 'completed') {
        updates.push('completed_at = GETDATE()');
        changes.completed_at = new Date().toISOString();
      } else if (status === 'pending') {
        updates.push('completed_at = NULL');
        changes.completed_at = { old: task.completed_at, new: null };
      }
    }

    if (updates.length > 0) {
      const request = pool.request();
      for (const [key, value] of Object.entries(params)) {
        if (key === 'id' || key === 'userId') {
          request.input(key, sql.Int, value);
        } else {
          request.input(key, sql.NVarChar, value);
        }
      }
      
      await request.query(`
        UPDATE tasks
        SET ${updates.join(', ')}, updated_at = GETDATE()
        WHERE id = @id AND user_id = @userId
      `);

      // Log history
      await pool.request()
        .input('task_id', sql.Int, taskId)
        .input('userId', sql.Int, req.userId)
        .input('old_value', sql.NVarChar, JSON.stringify(changes))
        .input('new_value', sql.NVarChar, JSON.stringify(req.body))
        .query(`
          INSERT INTO task_history (task_id, user_id, action, old_value, new_value)
          VALUES (@task_id, @userId, 'updated', @old_value, @new_value)
        `);
    }

    // Update project associations
    if (project_ids !== undefined) {
      await pool.request()
        .input('task_id', sql.Int, taskId)
        .query('DELETE FROM task_projects WHERE task_id = @task_id');
      
      if (project_ids && Array.isArray(project_ids)) {
        for (const projectId of project_ids) {
          await pool.request()
            .input('task_id', sql.Int, taskId)
            .input('project_id', sql.Int, projectId)
            .query('INSERT INTO task_projects (task_id, project_id) VALUES (@task_id, @project_id)');
        }
      }
    }

    const updatedTask = await pool.request()
      .input('id', sql.Int, taskId)
      .query('SELECT * FROM tasks WHERE id = @id');

    res.json({ message: 'Task updated successfully', task: updatedTask.recordset[0] });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const pool = await getPool();

    const existingTask = await pool.request()
      .input('id', sql.Int, taskId)
      .input('userId', sql.Int, req.userId)
      .query('SELECT * FROM tasks WHERE id = @id AND user_id = @userId');
    
    if (existingTask.recordset.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Log history before deletion
    await pool.request()
      .input('task_id', sql.Int, taskId)
      .input('userId', sql.Int, req.userId)
      .input('old_value', sql.NVarChar, JSON.stringify(existingTask.recordset[0]))
      .query(`
        INSERT INTO task_history (task_id, user_id, action, old_value)
        VALUES (@task_id, @userId, 'deleted', @old_value)
      `);

    await pool.request()
      .input('id', sql.Int, taskId)
      .input('userId', sql.Int, req.userId)
      .query('DELETE FROM tasks WHERE id = @id AND user_id = @userId');

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
    
    const result = await pool.request()
      .input('task_id', sql.Int, req.params.id)
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT * FROM task_history
        WHERE task_id = @task_id AND user_id = @userId
        ORDER BY created_at DESC
      `);

    res.json({ history: result.recordset });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get task history' });
  }
});

// Get task statistics
router.get('/stats/summary', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();
    
    const result = await pool.request()
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

    res.json({ stats: result.recordset[0] });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

export default router;
