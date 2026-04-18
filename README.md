# Smart Student Planner - Complete Full-Stack Application

A comprehensive web application designed to help students manage their studies effectively with timetabling, goal tracking, streak system, Pomodoro timer, and more.

## 🚀 Features Implemented

### 1. **User Authentication**

- ✅ Signup with email validation
- ✅ Secure password storage (bcrypt hashing)
- ✅ JWT-based authentication
- ✅ Profile management
- ✅ Dark mode toggle

### 2. **Task/Timetable Management**

- ✅ Create, read, update, delete tasks
- ✅ Time conflict detection
- ✅ Task status tracking (pending, in-progress, completed, overdue)
- ✅ Priority levels (high, medium, low)
- ✅ Daily and weekly task views
- ✅ Pagination support
- ✅ Color-coded task indicators

### 3. **Goal Tracking**

- ✅ Short-term and long-term goals
- ✅ Progress percentage tracking
- ✅ Visual progress bars
- ✅ Goal completion status

### 4. **Streak System** (AUTO-UPDATED)

- ✅ Current streak tracking
- ✅ Longest streak tracking
- ✅ Auto-update on task completion
- ✅ Auto-reset on missed deadline
- ✅ Daily streak history (30-day view)

### 5. **Real-Time Notifications** (BACKGROUND SCHEDULER)

- ✅ APScheduler integration
- ✅ Upcoming task notifications (5-10 mins before)
- ✅ Overdue task alerts
- ✅ Auto-update every 5 minutes
- ✅ Daily midnight reset checks

### 6. **Pomodoro Timer**

- ✅ 25-minute study sessions
- ✅ 5-minute breaks
- ✅ Session counting
- ✅ Subject-wise time tracking
- ✅ Weekly statistics
- ✅ Total study hours calculation

### 7. **Smart Dashboard**

- ✅ Today's task completion rate
- ✅ Weekly performance score
- ✅ Current and longest streaks
- ✅ Subject-wise time breakdown
- ✅ Overdue task count
- ✅ Pending task count
- ✅ Today vs Yesterday comparison
- ✅ Weekly chart data

### 8. **Data Export**

- ✅ Export tasks as CSV
- ✅ Export goals as CSV
- ✅ Export streak data as CSV
- ✅ Export all data combined
- ✅ Date range filtering

### 9. **UI/UX Features**

- ✅ Clean modern design
- ✅ Color-coded priorities
- ✅ Dark mode toggle
- ✅ Responsive design (mobile & desktop)
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Smooth animations

### 10. **Database**

- ✅ SQLite database
- ✅ User table with authentication
- ✅ Tasks table with status tracking
- ✅ Goals table
- ✅ Streaks table
- ✅ Study sessions table

---

## 📁 Project Structure

```
SmartStud/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py          # User model
│   │   │   ├── task.py          # Task model with status enum
│   │   │   ├── goal.py          # Goal model
│   │   │   ├── streak.py        # Streak model
│   │   │   └── study_session.py # Pomodoro session model
│   │   ├── routes/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── tasks.py         # Task CRUD endpoints
│   │   │   ├── goals.py         # Goal CRUD endpoints
│   │   │   ├── streaks.py       # Streak endpoints
│   │   │   ├── dashboard.py     # Dashboard statistics
│   │   │   ├── pomodoro.py      # Pomodoro timer endpoints
│   │   │   └── export.py        # Export functionality
│   │   ├── services/
│   │   │   ├── business_service.py   # Task, Streak, Notification services
│   │   │   ├── scheduler_service.py  # Background jobs (APScheduler)
│   │   │   ├── dashboard_service.py  # Dashboard statistics service
│   │   │   └── export_service.py     # CSV export service
│   │   ├── utils/
│   │   │   └── decorators.py    # JWT & validation decorators
│   │   └── __init__.py          # Flask app factory
│   ├── config.py                # Configuration
│   ├── run.py                   # Application entry point
│   └── requirements.txt         # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx        # Login page
    │   │   └── Signup.jsx       # Signup page
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Dashboard page
    │   │   ├── TaskManager.jsx  # Task management page
    │   │   ├── GoalTracker.jsx  # Goal tracking page
    │   │   └── PomodoroTimer.jsx # Pomodoro timer page
    │   ├── services/
    │   │   └── api.js           # API service with axios
    │   ├── hooks/
    │   │   └── useApi.js        # React hooks for API calls
    │   ├── styles/
    │   │   ├── index.css        # Global styles
    │   │   ├── App.css          # App layout
    │   │   ├── Auth.css         # Auth pages
    │   │   ├── Dashboard.css    # Dashboard
    │   │   ├── TaskManager.css  # Task manager
    │   │   ├── GoalTracker.css  # Goal tracker
    │   │   └── PomodoroTimer.css # Pomodoro timer
    │   ├── App.jsx              # Main app component
    │   └── main.jsx             # React entry point
    ├── index.html               # HTML template
    ├── vite.config.js           # Vite configuration
    └── package.json             # Node dependencies
```

---

## 🔧 API Endpoints

### Authentication

```
POST   /api/auth/signup              - User registration
POST   /api/auth/login               - User login
POST   /api/auth/logout              - User logout
GET    /api/auth/profile             - Get user profile
PUT    /api/auth/profile             - Update profile
POST   /api/auth/toggle-dark-mode    - Toggle dark mode
```

### Tasks

```
POST   /api/tasks                    - Create task
GET    /api/tasks                    - Get tasks (paginated)
GET    /api/tasks/<id>               - Get specific task
PUT    /api/tasks/<id>               - Update task
POST   /api/tasks/<id>/complete      - Mark task complete
DELETE /api/tasks/<id>               - Delete task
GET    /api/tasks/daily/<date>       - Get daily tasks
GET    /api/tasks/weekly             - Get weekly tasks
```

### Goals

```
POST   /api/goals                    - Create goal
GET    /api/goals                    - Get all goals
GET    /api/goals/<id>               - Get specific goal
PUT    /api/goals/<id>               - Update goal
POST   /api/goals/<id>/progress      - Update progress
DELETE /api/goals/<id>               - Delete goal
```

### Streaks

```
GET    /api/streaks/current          - Get current streak
POST   /api/streaks/update           - Manually update streak
POST   /api/streaks/reset            - Reset streak
GET    /api/streaks/stats            - Get streak statistics
```

### Dashboard

```
GET    /api/dashboard/stats          - Get dashboard statistics
GET    /api/dashboard/weekly-chart   - Get weekly performance chart
GET    /api/dashboard/productivity-score - Get productivity score
```

### Pomodoro

```
POST   /api/pomodoro/start           - Start study session
POST   /api/pomodoro/<id>/complete   - Complete session
GET    /api/pomodoro/today           - Get today's sessions
GET    /api/pomodoro/history         - Get session history
GET    /api/pomodoro/stats           - Get pomodoro statistics
```

### Export

```
GET    /api/export/tasks/csv         - Export tasks
GET    /api/export/goals/csv         - Export goals
GET    /api/export/streak/csv        - Export streak
GET    /api/export/all/csv           - Export all data
```

---

## 🚀 Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Create virtual environment:**

```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
source venv/bin/activate      # On Mac/Linux
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

4. **Run the application:**

```bash
python run.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start development server:**

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

---

## 🔑 Key Improvements Implemented

### 1. **Real-Time Notification System** (CRITICAL)

- Implemented APScheduler for background jobs
- Auto-checks for upcoming tasks every 1 minute
- Sends notifications 5-10 minutes before task time
- Checks for overdue tasks every 5 minutes
- Runs daily at midnight for streak reset

### 2. **Auto Streak Update** (INTELLIGENT)

- Automatically updates streak when all day's tasks are completed
- Auto-resets streak if tasks are incomplete
- Midnight check for daily reset
- No manual trigger needed

### 3. **Advanced Dashboard**

- Weekly performance score
- Today vs Yesterday comparison
- Subject-wise time breakdown
- Overdue/pending task counts
- Visual progress indicators
- Weekly trend chart

### 4. **Task Status Categories**

- **pending** - Not started
- **in_progress** - Currently working
- **completed** - Finished
- **overdue** - Deadline passed

### 5. **Overdue Task Detection**

- Auto-marks tasks as overdue when end time passes
- Runs every 5 minutes
- Red indicator in UI
- Alert notifications

### 6. **Weekly Calendar View**

- Shows tasks for the entire week
- Grouped by date
- Shows task count per day
- Color-coded priority

### 7. **Weekly Performance Score**

- Calculates completion percentage
- Shows "Your productivity: 78% this week"
- Tracks daily progress
- Visual gauge

### 8. **Edit History** (Available in DB)

- Tracks when tasks are created/updated
- Stores timestamps
- Shows modification history

### 9. **Enhanced Security**

- Strong password validation (8 chars, 1 uppercase, 1 number)
- JWT token with 30-day expiry
- CORS enabled for frontend
- Protected routes with JWT verification

### 10. **Data Export**

- CSV export for tasks, goals, streak data
- Date range filtering
- Combined export option
- Comprehensive report generation

---

## 📊 Database Schema

### Users Table

```sql
id (PK), username (UNIQUE), email (UNIQUE), password_hash,
first_name, last_name, dark_mode, total_study_hours,
created_at, updated_at
```

### Tasks Table

```sql
id (PK), user_id (FK), subject, description, date, start_time,
end_time, priority, status, is_completed, completion_time,
created_at, updated_at
```

### Goals Table

```sql
id (PK), user_id (FK), title, description, goal_type, target_date,
progress_percentage, is_completed, created_at, updated_at
```

### Streaks Table

```sql
id (PK), user_id (FK), current_streak, longest_streak,
last_completed_date, created_at, updated_at
```

### StudySessions Table

```sql
id (PK), user_id (FK), subject, duration_minutes, sessions_count,
date, start_time, end_time, is_completed, created_at
```

---

## 🎨 Color Scheme

- **Primary**: #6366f1 (Indigo)
- **Secondary**: #ec4899 (Pink)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Danger**: #ef4444 (Red)

---

## 📱 Responsive Design

✅ Mobile (< 768px)
✅ Tablet (768px - 1024px)
✅ Desktop (> 1024px)

---

## 🧪 Testing the Application

### Test Account

```
Username: testuser
Email: test@example.com
Password: TestPass123
```

### Test Workflow

1. Sign up with new account
2. Create multiple tasks with different times
3. Set goals (short and long term)
4. Complete tasks to build streak
5. Use Pomodoro timer for study sessions
6. Check dashboard for statistics
7. Export data as CSV
8. Toggle dark mode
9. View weekly performance

---

## 🔐 Security Features

- ✅ Password hashing with Werkzeug
- ✅ JWT authentication with 30-day expiry
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Strong password requirements

---

## 📈 Performance Optimizations

- ✅ Pagination for task lists
- ✅ Efficient database queries with indexes
- ✅ Background scheduler for heavy tasks
- ✅ Lazy loading components
- ✅ Optimized CSS with gradients

---

## 🐛 Error Handling

- ✅ Try-catch blocks in all API routes
- ✅ Validation decorators for requests
- ✅ User-friendly error messages
- ✅ HTTP status codes
- ✅ Logging for debugging

---

## 📚 Dependencies

### Backend

- Flask 3.0.0
- Flask-SQLAlchemy 3.1.1
- Flask-JWT-Extended 4.5.2
- Flask-CORS 4.0.0
- APScheduler 3.10.4
- Werkzeug 3.0.1

### Frontend

- React 18.2.0
- Axios 1.6.0
- Vite 4.4.0

---

## 🎯 Next Steps for Enhancement

1. **Email Notifications** - Send emails for important deadlines
2. **Social Features** - Share progress with friends
3. **AI Recommendations** - Smart task suggestions
4. **Mobile App** - Native mobile application
5. **Analytics** - Advanced performance metrics
6. **Integrations** - Calendar sync, Google Drive backup
7. **Webhooks** - Slack/Discord notifications
8. **WebSockets** - Real-time updates

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Developer Notes

- All improvements from the requirement have been implemented
- Code follows clean architecture principles
- Service layer separates business logic
- Decorators for common patterns
- Comprehensive error handling
- Type hints in Python where applicable
- CSS-in-JS with organized stylesheets

---

**Created: April 2026**
**Version: 1.0.0**
