-- Task Manager Database Schema for SQL Server
-- Run this script to create the database and tables

-- Create database (run as admin if database doesn't exist)
-- CREATE DATABASE TaskManagerDB;
-- GO

-- Use the database
USE TaskManagerDB;
GO

-- Create users table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    PRINT 'Table users created successfully';
END
ELSE
BEGIN
    PRINT 'Table users already exists';
END
GO

-- Create tasks table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tasks' AND xtype='U')
BEGIN
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
        updated_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_tasks_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    PRINT 'Table tasks created successfully';
END
ELSE
BEGIN
    PRINT 'Table tasks already exists';
END
GO

-- Create task_history table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='task_history' AND xtype='U')
BEGIN
    CREATE TABLE task_history (
        id INT IDENTITY(1,1) PRIMARY KEY,
        task_id INT NOT NULL,
        user_id INT NOT NULL,
        action NVARCHAR(100) NOT NULL,
        old_value NVARCHAR(MAX),
        new_value NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_task_history_tasks FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        CONSTRAINT FK_task_history_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    PRINT 'Table task_history created successfully';
END
ELSE
BEGIN
    PRINT 'Table task_history already exists';
END
GO

-- Create projects table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='projects' AND xtype='U')
BEGIN
    CREATE TABLE projects (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        color NVARCHAR(50) DEFAULT '#3b82f6',
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_projects_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    PRINT 'Table projects created successfully';
END
ELSE
BEGIN
    PRINT 'Table projects already exists';
END
GO

-- Create task_projects junction table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='task_projects' AND xtype='U')
BEGIN
    CREATE TABLE task_projects (
        task_id INT NOT NULL,
        project_id INT NOT NULL,
        PRIMARY KEY (task_id, project_id),
        CONSTRAINT FK_task_projects_tasks FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        CONSTRAINT FK_task_projects_projects FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
    PRINT 'Table task_projects created successfully';
END
ELSE
BEGIN
    PRINT 'Table task_projects already exists';
END
GO

-- Create notifications table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='notifications' AND xtype='U')
BEGIN
    CREATE TABLE notifications (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        title NVARCHAR(255) NOT NULL,
        message NVARCHAR(MAX) NOT NULL,
        type NVARCHAR(50) DEFAULT 'info',
        read BIT DEFAULT 0,
        created_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_notifications_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    PRINT 'Table notifications created successfully';
END
ELSE
BEGIN
    PRINT 'Table notifications already exists';
END
GO

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_tasks_user_id')
BEGIN
    CREATE INDEX IX_tasks_user_id ON tasks(user_id);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_tasks_status')
BEGIN
    CREATE INDEX IX_tasks_status ON tasks(status);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_tasks_due_date')
BEGIN
    CREATE INDEX IX_tasks_due_date ON tasks(due_date);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_notifications_user_id')
BEGIN
    CREATE INDEX IX_notifications_user_id ON notifications(user_id);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_task_history_user_id')
BEGIN
    CREATE INDEX IX_task_history_user_id ON task_history(user_id);
END

PRINT 'Database schema setup completed!';
GO
