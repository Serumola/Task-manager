# Task Manager Application

A full-stack task management application with JWT authentication, built with React (frontend) and Node.js/Express with SQL Server (backend).

## Features

- **JWT Authentication**: Secure user registration and login
- **Dashboard**: Overview of tasks with statistics
- **My Tasks**: Create, update, delete, and organize tasks
- **Projects**: Organize tasks into color-coded projects
- **Calendar**: View tasks with due dates on a calendar
- **Notifications**: Stay updated with task and project notifications
- **Reports**: Analytics and insights on your productivity
- **Settings**: Manage profile, password, and preferences
- **Help**: FAQ and support information

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Lucide React (icons)
- Fetch API

### Backend
- Node.js
- Express
- **Microsoft SQL Server** (mssql)
- JWT (jsonwebtoken)
- bcryptjs

## Getting Started

### Prerequisites
- Node.js 18+ installed
- **SQL Server** installed and running (Express edition or higher)
- pnpm (recommended) or npm

### SQL Server Setup

1. **Create the database:**

   Open SQL Server Management Studio (SSMS) or Azure Data Studio and run:
   ```sql
   CREATE DATABASE TaskManagerDB;
   ```

2. **Run the schema script:**
   
   Execute the schema file located at `server/schema.sql` to create all tables:
   ```bash
   # Or run the SQL script directly in SSMS/Azure Data Studio
   ```

3. **Update database credentials:**
   
   Edit `server/.env` with your SQL Server credentials:
   ```env
   DB_SERVER=localhost
   DB_DATABASE=TaskManagerDB
   DB_USER=sa
   DB_PASSWORD=YourPassword123!
   DB_PORT=1433
   DB_TRUST_SERVER_CERTIFICATE=true
   ```

### Installation

1. **Install frontend dependencies:**
```bash
cd C:\Users\Administrator\Desktop\website\Task-manager
pnpm install
```

2. **Install backend dependencies:**
```bash
cd C:\Users\Administrator\Desktop\website\Task-manager\server
pnpm install
```

### Running the Application

1. **Ensure SQL Server is running** on your machine

2. **Start the backend server:**
```bash
cd C:\Users\Administrator\Desktop\website\Task-manager\server
pnpm start
```
The API will run on http://localhost:5000

3. **Start the frontend (in a new terminal):**
```bash
cd C:\Users\Administrator\Desktop\website\Task-manager
pnpm run dev
```
The app will run on http://localhost:5173

## Usage

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Sign in at `/login`
3. **Dashboard**: View your task overview and statistics
4. **My Tasks**: Manage your tasks (create, edit, delete, mark complete)
5. **Projects**: Create projects to organize related tasks
6. **Calendar**: View tasks by due date
7. **Notifications**: See your task and project notifications
8. **Reports**: View productivity analytics
9. **Settings**: Update your profile and preferences
10. **Help**: Find answers to common questions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `GET /api/tasks/:id` - Get single task (protected)
- `POST /api/tasks` - Create new task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `GET /api/tasks/stats/summary` - Get task statistics (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `GET /api/projects/:id` - Get single project with tasks (protected)
- `POST /api/projects` - Create new project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Notifications
- `GET /api/notifications` - Get all notifications (protected)
- `PUT /api/notifications/:id/read` - Mark notification as read (protected)
- `PUT /api/notifications/read-all` - Mark all as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics (protected)
- `GET /api/reports/activity` - Get activity history (protected)
- `GET /api/reports/calendar` - Get calendar data (protected)

## Project Structure

```
Task-manager/
├── src/                    # Frontend React code
│   ├── components/         # Reusable components
│   │   ├── sidebar/        # Sidebar component
│   │   └── ProtectedRoute.jsx
│   ├── context/            # React context (AuthContext)
│   ├── pages/              # Page components
│   │   ├── Dashboard/
│   │   ├── Login/
│   │   ├── SignUp/
│   │   ├── Notifications/
│   │   ├── MyTasks/
│   │   ├── Calendar/
│   │   ├── Projects/
│   │   ├── Reports/
│   │   ├── Help/
│   │   └── Settings/
│   ├── services/           # API service
│   └── App.jsx
├── server/                 # Backend Node.js code
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── projects.js
│   │   ├── notifications.js
│   │   └── reports.js
│   ├── middleware/         # Express middleware
│   │   └── auth.js
│   ├── db.js               # Database connection (SQL Server)
│   ├── index.js            # Server entry point
│   ├── schema.sql          # SQL Server database schema
│   └── .env                # Environment variables
└── package.json
```

## Database Schema (SQL Server)

### Tables

**users**
- id (INT, IDENTITY, PK)
- name (NVARCHAR(255))
- email (NVARCHAR(255), UNIQUE)
- password (NVARCHAR(255))
- created_at (DATETIME2)
- updated_at (DATETIME2)

**tasks**
- id (INT, IDENTITY, PK)
- user_id (INT, FK -> users)
- title (NVARCHAR(500))
- description (NVARCHAR(MAX))
- status (NVARCHAR(50))
- priority (NVARCHAR(50))
- due_date (DATETIME2)
- completed_at (DATETIME2)
- created_at (DATETIME2)
- updated_at (DATETIME2)

**projects**
- id (INT, IDENTITY, PK)
- user_id (INT, FK -> users)
- name (NVARCHAR(255))
- description (NVARCHAR(MAX))
- color (NVARCHAR(50))
- created_at (DATETIME2)
- updated_at (DATETIME2)

**task_projects** (Junction Table)
- task_id (INT, FK -> tasks, PK)
- project_id (INT, FK -> projects, PK)

**notifications**
- id (INT, IDENTITY, PK)
- user_id (INT, FK -> users)
- title (NVARCHAR(255))
- message (NVARCHAR(MAX))
- type (NVARCHAR(50))
- read (BIT)
- created_at (DATETIME2)

**task_history**
- id (INT, IDENTITY, PK)
- task_id (INT, FK -> tasks)
- user_id (INT, FK -> users)
- action (NVARCHAR(100))
- old_value (NVARCHAR(MAX))
- new_value (NVARCHAR(MAX))
- created_at (DATETIME2)

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication (7-day expiration)
- Protected routes require valid JWT token
- CORS enabled for frontend-backend communication
- Parameterized queries to prevent SQL injection

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development

# SQL Server Configuration
DB_SERVER=localhost
DB_DATABASE=TaskManagerDB
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_PORT=1433
DB_TRUST_SERVER_CERTIFICATE=true
```

## Troubleshooting

### SQL Server Connection Issues

1. **Ensure SQL Server is running:**
   - Check SQL Server service status in Services (services.msc)
   - For named instances, use `DB_SERVER=localhost\\SQLEXPRESS`

2. **Enable TCP/IP protocol:**
   - Open SQL Server Configuration Manager
   - Navigate to SQL Server Network Configuration > Protocols
   - Enable TCP/IP if disabled

3. **Check firewall settings:**
   - Ensure port 1433 (or your configured port) is open

4. **Authentication mode:**
   - Ensure SQL Server is set to "SQL Server and Windows Authentication mode"

## License

MIT
# Task-manager
