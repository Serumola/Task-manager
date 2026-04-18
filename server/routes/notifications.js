import express from 'express';
import { getPool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';
import sql from 'mssql';

const router = express.Router();

// Get all notifications for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const { unread } = req.query;
    const pool = await getPool();
    
    let query = 'SELECT * FROM notifications WHERE user_id = @userId';
    const request = pool.request().input('userId', sql.Int, req.userId);

    if (unread === 'true') {
      query += ' AND [read] = 0';
    }

    query += ' ORDER BY created_at DESC';

    const result = await request.query(query);
    res.json({ notifications: result.recordset });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const pool = await getPool();

    const notification = await pool.request()
      .input('id', sql.Int, notificationId)
      .input('userId', sql.Int, req.userId)
      .query('SELECT * FROM notifications WHERE id = @id AND user_id = @userId');
    
    if (notification.recordset.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await pool.request()
      .input('id', sql.Int, notificationId)
      .input('userId', sql.Int, req.userId)
      .query('UPDATE notifications SET [read] = 1 WHERE id = @id AND user_id = @userId');

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();
    
    await pool.request()
      .input('userId', sql.Int, req.userId)
      .query('UPDATE notifications SET [read] = 1 WHERE user_id = @userId AND [read] = 0');

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// Delete notification
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const pool = await getPool();

    const notification = await pool.request()
      .input('id', sql.Int, notificationId)
      .input('userId', sql.Int, req.userId)
      .query('SELECT * FROM notifications WHERE id = @id AND user_id = @userId');
    
    if (notification.recordset.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await pool.request()
      .input('id', sql.Int, notificationId)
      .input('userId', sql.Int, req.userId)
      .query('DELETE FROM notifications WHERE id = @id AND user_id = @userId');

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Get unread count
router.get('/unread/count', verifyToken, async (req, res) => {
  try {
    const pool = await getPool();
    
    const result = await pool.request()
      .input('userId', sql.Int, req.userId)
      .query('SELECT COUNT(*) as count FROM notifications WHERE user_id = @userId AND [read] = 0');

    res.json({ count: result.recordset[0].count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

export default router;
