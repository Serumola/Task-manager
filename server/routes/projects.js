import express from 'express';
import { getPool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all projects for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.query(
      `SELECT p.*, COUNT(tp.task_id) as task_count
       FROM projects p
       LEFT JOIN task_projects tp ON p.id = tp.project_id
       WHERE p.user_id = $1
       GROUP BY p.id, p.name, p.description, p.color, p.created_at, p.updated_at
       ORDER BY p.created_at DESC`,
      [req.userId]
    );

    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
});

// Get single project
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();

    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get tasks in this project
    const tasksResult = await pool.query(
      `SELECT t.* FROM tasks t
       INNER JOIN task_projects tp ON t.id = tp.task_id
       WHERE tp.project_id = $1 AND t.user_id = $2`,
      [req.params.id, req.userId]
    );

    res.json({ 
      project: projectResult.rows[0],
      tasks: tasksResult.rows 
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// Create new project
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const pool = await getPool();

    const result = await pool.query(
      `INSERT INTO projects (user_id, name, description, color)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.userId, name, description || null, color || '#3b82f6']
    );

    const project = result.rows[0];

    res.status(201).json({ project, message: 'Project created successfully' });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const pool = await getPool();

    const result = await pool.query(
      `UPDATE projects 
       SET name = $1, description = $2, color = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [name, description, color, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project: result.rows[0], message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
