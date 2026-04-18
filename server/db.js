import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'TaskManagerDB',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

export async function getPool() {
  if (pool) {
    return pool;
  }
  
  try {
    pool = await sql.connect(config);
    console.log('Connected to SQL Server database:', config.database);
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
}

export async function initDatabase() {
  try {
    const pool = await getPool();
    
    // First, disable foreign key constraints
    await pool.request().query('EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"');
    
    // Drop all tables in correct order (children first, then parents)
    const tablesToDrop = ['task_projects', 'task_history', 'notifications', 'tasks', 'projects', 'users'];
    
    for (const table of tablesToDrop) {
      await pool.request().query(`
        IF EXISTS (SELECT * FROM sys.objects WHERE name = '${table}' AND type = 'U')
        DROP TABLE [${table}]
      `);
      console.log(`Dropped table: ${table}`);
    }
    
    // Now create all tables with foreign key constraints
    await pool.request().query(`
      CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Created table: users');

    await pool.request().query(`
      CREATE TABLE tasks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        title NVARCHAR(500) NOT NULL,
        description NVARCHAR(MAX),
        status NVARCHAR(50) DEFAULT 'pending',
        priority NVARCHAR(50) DEFAULT 'medium',
        due_date DATETIME2,
        completed_at DATETIME2,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Created table: tasks');

    await pool.request().query(`
      CREATE TABLE task_history (
        id INT IDENTITY(1,1) PRIMARY KEY,
        task_id INT NOT NULL,
        user_id INT NOT NULL,
        action NVARCHAR(100) NOT NULL,
        old_value NVARCHAR(MAX),
        new_value NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Created table: task_history');

    await pool.request().query(`
      CREATE TABLE projects (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        color NVARCHAR(50) DEFAULT '#3b82f6',
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Created table: projects');

    await pool.request().query(`
      CREATE TABLE task_projects (
        task_id INT NOT NULL,
        project_id INT NOT NULL,
        PRIMARY KEY (task_id, project_id)
      )
    `);
    console.log('Created table: task_projects');

    await pool.request().query(`
      CREATE TABLE notifications (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        title NVARCHAR(255) NOT NULL,
        message NVARCHAR(MAX) NOT NULL,
        type NVARCHAR(50) DEFAULT 'info',
        [read] BIT DEFAULT 0,
        created_at DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Created table: notifications');

    // Now add foreign key constraints separately
    await pool.request().query(`
      ALTER TABLE tasks ADD CONSTRAINT FK_tasks_users FOREIGN KEY (user_id) REFERENCES users(id)
    `);
    console.log('Added FK: tasks -> users');

    await pool.request().query(`
      ALTER TABLE task_history ADD CONSTRAINT FK_task_history_tasks FOREIGN KEY (task_id) REFERENCES tasks(id)
    `);
    console.log('Added FK: task_history -> tasks');

    await pool.request().query(`
      ALTER TABLE task_history ADD CONSTRAINT FK_task_history_users FOREIGN KEY (user_id) REFERENCES users(id)
    `);
    console.log('Added FK: task_history -> users');

    await pool.request().query(`
      ALTER TABLE projects ADD CONSTRAINT FK_projects_users FOREIGN KEY (user_id) REFERENCES users(id)
    `);
    console.log('Added FK: projects -> users');

    await pool.request().query(`
      ALTER TABLE task_projects ADD CONSTRAINT FK_task_projects_tasks FOREIGN KEY (task_id) REFERENCES tasks(id)
    `);
    console.log('Added FK: task_projects -> tasks');

    await pool.request().query(`
      ALTER TABLE task_projects ADD CONSTRAINT FK_task_projects_projects FOREIGN KEY (project_id) REFERENCES projects(id)
    `);
    console.log('Added FK: task_projects -> projects');

    await pool.request().query(`
      ALTER TABLE notifications ADD CONSTRAINT FK_notifications_users FOREIGN KEY (user_id) REFERENCES users(id)
    `);
    console.log('Added FK: notifications -> users');

    // Re-enable foreign key constraints
    await pool.request().query('EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all"');
    
    console.log('Database tables initialized successfully!');
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  }
}

export default sql;
