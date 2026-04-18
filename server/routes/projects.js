import express from 'express';
import { getPool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';
import sql from 'mssql';

const router = express.Router();

// Get all projects for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();
    
    const result = await pool.request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT p.*, COUNT(tp.task_id) as task_count
        FROM projects p
        LEFT JOIN task_projects tp ON p.id = tp.project_id
        WHERE p.user_id = @userId
        GROUP BY p.id, p.name, p.description, p.color, p.created_at, p.updated_at
        ORDER BY p.created_at DESC
      `);

    res.json({ projects: result.recordset });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
});

// Get single project
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();
    
    const projectResult = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, req.userId)
      .query('SELECT * FROM projects WHERE id = @id AND user_id = @userId');

    if (projectResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get tasks in this project
    const tasksResult = await pool.request()
      .input('project_id', sql.Int, req.params.id)
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT t.* FROM tasks t
        INNER JOIN task_projects tp ON t.id = tp.task_id
        WHERE tp.project_id = @project_id AND t.user_id = @userId
      `);

    res.json({ project: projectResult.recordset[0], tasks: tasksResult.recordset });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// Create new project
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const pool = await getPool();

    const result = await pool.request()
      .input('userId', sql.Int, req.userId)
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description || null)
      .input('color', sql.NVarChar, color || '#3b82f6')
      .query(`
        INSERT INTO projects (user_id, name, description, color)
        OUTPUT INSERTED.*
        VALUES (@userId, @name, @description, @color)
      `);

    res.status(201).json({ message: 'Project created successfully', project: result.recordset[0] });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const projectId = req.params.id;
    const pool = await getPool();

    const existingProject = await pool.request()
      .input('id', sql.Int, projectId)
      .input('userId', sql.Int, req.userId)
      .query('SELECT * FROM projects WHERE id = @id AND user_id = @userId');

    if (existingProject.recordset.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = existingProject.recordset[0];

    const result = await pool.request()
      .input('name', sql.NVarChar, name || project.name)
      .input('description', sql.NVarChar, description !== undefined ? description : project.description)
      .input('color', sql.NVarChar, color || project.color)
      .input('id', sql.Int, projectId)
      .input('userId', sql.Int, req.userId)
      .query(`
        UPDATE projects
        SET name = @name, description = @description, color = @color, updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id AND user_id = @userId
      `);

    res.json({ message: 'Project updated successfully', project: result.recordset[0] });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const pool = await getPool();

    const existingProject = await pool.request()
      .input('id', sql.Int, projectId)
      .input('userId', sql.Int, req.userId)
      .query('SELECT * FROM projects WHERE id = @id AND user_id = @userId');
    
    if (existingProject.recordset.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await pool.request()
      .input('id', sql.Int, projectId)
      .input('userId', sql.Int, req.userId)
      .query('DELETE FROM projects WHERE id = @id AND user_id = @userId');

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
