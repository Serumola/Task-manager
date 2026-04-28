# TaskMaster - Task Management Application

A modern, full-stack task management application with JWT authentication, built with React (frontend) and Node.js/Express with PostgreSQL (backend). Features a beautiful, responsive UI with real-time notifications and professional animations.

![TaskMaster](https://img.shields.io/badge/TaskMaster-Productivity-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)

## ✨ Features

### Core Functionality
- **🔐 JWT Authentication**: Secure user registration and login with bcrypt password hashing
- **📊 Dashboard**: Visual overview with interactive charts (pie chart, bar chart) and task statistics
- **✅ My Tasks**: Full CRUD operations with priority levels, due dates, and status tracking
- **📅 Calendar**: View tasks organized by due dates
- **🔔 Notifications**: Real-time toast notifications for all user actions
- **📈 Reports**: Analytics and productivity insights with visual charts
- **⚙️ Settings**: Manage profile, password, and preferences
- **❓ Help**: FAQ and support information

### Professional UI/UX
- **🎨 Modern Design**: Clean, professional interface with green color palette
- **📱 Fully Responsive**: Optimized for mobile, tablet, desktop, and large screens
- **✨ Smooth Animations**: Page transitions, hover effects, and micro-interactions
- **🔔 Toast Notifications**: Beautiful, auto-dismissing notifications for actions
- **⌨️ Keyboard Friendly**: Intuitive keyboard shortcuts
- **🌙 Dark Mode Ready**: Architecture supports theme switching

### Task Management
- Create, edit, and delete tasks instantly
- Mark tasks as complete/pending with one click
- Set priority levels (High, Medium, Low)
- Add due dates with calendar picker
- Rich task descriptions
- Quick add task functionality
- Task filtering by status

## ️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Fetch API** - HTTP requests
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Primary database
- **pg** - PostgreSQL client
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running (or use a cloud provider like Neon, Supabase, or Render)
- pnpm (recommended) or npm

### Database Setup

1. **Create the database:**
   ```bash
   createdb TaskManagerDB
   ```
   
   Or using psql:
   ```sql
   CREATE DATABASE "TaskManagerDB";
   ```

2. **Run the schema script:**
   ```bash
   # Navigate to server directory
   cd server
   
   # Run the schema
   psql -U your_username -d TaskManagerDB -f schema.sql
   ```

3. **Update database credentials:**
   
   Edit `server/.env` with your PostgreSQL credentials:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/TaskManagerDB
   # Or use individual settings:
   DB_HOST=postgresql://username:password@localhost:5432/TaskManagerDB
   DB_DATABASE=TaskManagerDB
   DB_USER=username
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Task-manager
   ```

2. **Install frontend dependencies:**
   ```bash
   pnpm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   pnpm install
   cd ..
   ```

### Running the Application

1. **Ensure PostgreSQL is running** on your machine

2. **Start the backend server:**
   ```bash
   cd server
   pnpm start
   ```
   The API will run on `http://localhost:5000` (or your configured PORT)

3. **Start the frontend (in a new terminal):**
   ```bash
   pnpm run dev
   ```
   The app will run on `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173`

## 📖 Usage

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Sign in at `/login`
3. **Dashboard**: View your task overview with interactive charts
4. **My Tasks**: Create, edit, delete, and organize tasks
5. **Calendar**: View tasks by due date
6. **Reports**: View productivity analytics and insights
7. **Settings**: Update your profile and preferences
8. **Help**: Find answers to common questions

### Quick Tips
- Click the checkbox to mark tasks complete/incomplete
- Use the edit button (✏️) to modify tasks
- Click the delete button (🗑️) with confirmation dialog
- Toast notifications confirm all actions
- Responsive design works on all screen sizes

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically on push

### Backend (Render/Railway)
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd server && pnpm install`
4. Set start command: `cd server && pnpm start`
5. Add PostgreSQL database
6. Configure environment variables

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (protected) |
| PUT | `/api/auth/profile` | Update user profile (protected) |
| PUT | `/api/auth/change-password` | Change password (protected) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (protected) |
| GET | `/api/tasks/:id` | Get single task (protected) |
| POST | `/api/tasks` | Create new task (protected) |
| PUT | `/api/tasks/:id` | Update task (protected) |
| DELETE | `/api/tasks/:id` | Delete task (protected) |
| GET | `/api/tasks/stats/summary` | Get task statistics (protected) |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get all notifications (protected) |
| PUT | `/api/notifications/:id/read` | Mark notification as read (protected) |
| PUT | `/api/notifications/read-all` | Mark all as read (protected) |
| DELETE | `/api/notifications/:id` | Delete notification (protected) |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/dashboard` | Get dashboard statistics (protected) |
| GET | `/api/reports/activity` | Get activity history (protected) |
| GET | `/api/reports/calendar` | Get calendar data (protected) |

## 📁 Project Structure

```
Task-manager/
├── src/                          # Frontend React code
│   ├── components/               # Reusable components
│   │   ├── sidebar/              # Sidebar navigation
│   │   └── ProtectedRoute.jsx    # Auth route protection
│   ├── context/                  # React Context
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── ToastContext.jsx      # Toast notifications
│   ├── pages/                    # Page components
│   │   ├── Dashboard/            # Main dashboard with charts
│   │   ├── Login/                # Login page
│   │   ├── SignUp/               # Registration page
│   │   ├── Notifications/        # Notifications center
│   │   ├── MyTasks/              # Task management
│   │   ├── Calendar/             # Calendar view
│   │   ├── Reports/              # Analytics & reports
│   │   ├── Help/                 # Help & support
│   │   └── Settings/             # User settings
│   ├── services/                 # API services
│   │   └── api.js                # API client
│   └── App.jsx                   # Main app component
├── server/                       # Backend Node.js code
│   ├── routes/                   # API routes
│   │   ├── auth.js               # Authentication routes
│   │   ├── tasks.js              # Task CRUD routes
│   │   ├── notifications.js      # Notification routes
│   │   └── reports.js            # Report/analytics routes
│   ├── middleware/               # Express middleware
│   │   └── auth.js               # JWT verification
│   ├── db.js                     # Database connection
│   ├── index.js                  # Server entry point
│   ├── schema.sql                # Database schema
│   └── .env                      # Environment variables
└── package.json                  # Frontend dependencies
```

## 🗄️ Database Schema

### Tables

**users**
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(255))
- `email` (VARCHAR(255), UNIQUE)
- `password` (VARCHAR(255))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**tasks**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, FK → users)
- `title` (VARCHAR(500))
- `description` (TEXT)
- `status` (VARCHAR(50), default: 'pending')
- `priority` (VARCHAR(50), default: 'medium')
- `due_date` (TIMESTAMP)
- `completed_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**notifications**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, FK → users)
- `title` (VARCHAR(255))
- `message` (TEXT)
- `type` (VARCHAR(50))
- `read` (BOOLEAN)
- `created_at` (TIMESTAMP)

**task_history**
- `id` (SERIAL PRIMARY KEY)
- `task_id` (INTEGER, FK → tasks)
- `user_id` (INTEGER, FK → users)
- `action` (VARCHAR(100))
- `old_value` (JSONB)
- `new_value` (JSONB)
- `created_at` (TIMESTAMP)

## 🔒 Security

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT tokens with configurable expiration (default: 7 days)
- ✅ Protected routes require valid JWT
- ✅ CORS configured for specific origins
- ✅ Parameterized queries prevent SQL injection
- ✅ Input validation on all endpoints
- ✅ HTTPS in production

## 🌍 Environment Variables

### Server (.env)
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=production

# PostgreSQL Configuration
DATABASE_URL=postgresql://user:password@host:5432/database
# Or individual settings:
DB_HOST=postgresql://user:password@host:5432/database
DB_DATABASE=TaskManagerDB
DB_USER=username
DB_PASSWORD=password
DB_PORT=5432
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🐛 Troubleshooting

### PostgreSQL Connection Issues

1. **Ensure PostgreSQL is running:**
   ```bash
   # Windows
   net start postgresql
   
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. **Check connection string:**
   - Verify username, password, and database name
   - Ensure port 5432 is open

3. **Create database if it doesn't exist:**
   ```bash
   createdb TaskManagerDB
   ```

4. **Check PostgreSQL logs:**
   ```bash
   # Location varies by installation
   /var/log/postgresql/postgresql-*.log
   ```

### API Connection Issues

1. **Check backend is running:** Visit `http://localhost:5000/api/health`
2. **Verify CORS settings** in server/index.js
3. **Check environment variables** are set correctly
4. **Ensure frontend API URL** matches backend URL

## 📱 Responsive Breakpoints

| Screen Size | Breakpoint | Layout |
|-------------|------------|--------|
| Small Mobile | ≤480px | Single column, compact UI |
| Mobile | ≤768px | Single column, mobile menu |
| Tablet | 769-1024px | 2-column grids |
| Desktop | 1025-1440px | Standard layout |
| Large Desktop | ≥1440px | Expanded padding |

##  Features in Detail

### Toast Notifications
- **Success**: Green, checkmark icon
- **Error**: Red, alert icon
- **Info**: Blue, info icon
- **Warning**: Orange, warning icon
- Auto-dismiss after 3 seconds
- Manual close button
- Slide-in animation
- Mobile responsive

### Dashboard Charts
- **Priority Pie Chart**: Visual distribution of task priorities
- **Status Bar Chart**: Tasks by completion status
- **Quick Stats**: Due today, overdue, projects count
- Real-time updates
- Smooth animations

### Task Management
- Inline editing
- Confirmation dialogs
- Instant feedback
- Priority color coding
- Due date tracking
- Status toggling

##  License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the Help section in the app
- Review the troubleshooting guide above

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
