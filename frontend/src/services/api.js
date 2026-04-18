import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  signup: (username, email, password, firstName, lastName) =>
    api.post('/auth/signup', {
      username,
      email,
      password,
      confirm_password: password,
      first_name: firstName,
      last_name: lastName
    }),
  
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  
  logout: () =>
    api.post('/auth/logout'),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (firstName, lastName) =>
    api.put('/auth/profile', { first_name: firstName, last_name: lastName }),
  
  toggleDarkMode: () =>
    api.post('/auth/toggle-dark-mode')
};

// Task Services
export const taskService = {
  createTask: (subject, description, date, startTime, endTime, priority) =>
    api.post('/tasks', {
      subject,
      description,
      date,
      start_time: startTime,
      end_time: endTime,
      priority
    }),
  
  getTasks: (page = 1, perPage = 10, startDate, endDate) =>
    api.get('/tasks', {
      params: { page, per_page: perPage, start_date: startDate, end_date: endDate }
    }),
  
  getDailyTasks: (date) =>
    api.get(`/tasks/daily/${date}`),
  
  getWeeklyTasks: () =>
    api.get('/tasks/weekly'),
  
  getTask: (id) =>
    api.get(`/tasks/${id}`),
  
  updateTask: (id, updates) =>
    api.put(`/tasks/${id}`, updates),
  
  completeTask: (id) =>
    api.post(`/tasks/${id}/complete`),
  
  deleteTask: (id) =>
    api.delete(`/tasks/${id}`)
};

// Goal Services
export const goalService = {
  createGoal: (title, description, goalType, targetDate) =>
    api.post('/goals', {
      title,
      description,
      goal_type: goalType,
      target_date: targetDate
    }),
  
  getGoals: (type) =>
    api.get('/goals', { params: { type } }),
  
  getGoal: (id) =>
    api.get(`/goals/${id}`),
  
  updateGoal: (id, updates) =>
    api.put(`/goals/${id}`, updates),
  
  updateGoalProgress: (id, percentage) =>
    api.post(`/goals/${id}/progress`, { progress_percentage: percentage }),
  
  deleteGoal: (id) =>
    api.delete(`/goals/${id}`)
};

// Streak Services
export const streakService = {
  getCurrentStreak: () =>
    api.get('/streaks/current'),
  
  updateStreak: () =>
    api.post('/streaks/update'),
  
  resetStreak: () =>
    api.post('/streaks/reset'),
  
  getStreakStats: () =>
    api.get('/streaks/stats')
};

// Dashboard Services
export const dashboardService = {
  getDashboardStats: () =>
    api.get('/dashboard/stats'),
  
  getWeeklyChart: () =>
    api.get('/dashboard/weekly-chart'),
  
  getProductivityScore: () =>
    api.get('/dashboard/productivity-score')
};

// Pomodoro Services
export const pomodoroService = {
  startSession: (subject, durationMinutes = 25) =>
    api.post('/pomodoro/start', {
      subject,
      duration_minutes: durationMinutes
    }),
  
  completeSession: (sessionId) =>
    api.post(`/pomodoro/${sessionId}/complete`),
  
  getTodaySessions: () =>
    api.get('/pomodoro/today'),
  
  getSessionHistory: (days = 30) =>
    api.get('/pomodoro/history', { params: { days } }),
  
  getPomodoroStats: () =>
    api.get('/pomodoro/stats')
};

// Export Services
export const exportService = {
  exportTasks: (startDate, endDate) =>
    api.get('/export/tasks/csv', { params: { start_date: startDate, end_date: endDate } }),
  
  exportGoals: () =>
    api.get('/export/goals/csv'),
  
  exportStreak: () =>
    api.get('/export/streak/csv'),
  
  exportAll: (startDate, endDate) =>
    api.get('/export/all/csv', { params: { start_date: startDate, end_date: endDate } })
};

export default api;
