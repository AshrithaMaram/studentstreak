import React, { useState, useEffect } from 'react';
import { taskService, streakService } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const inspirationalQuotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The only way to do great work is to love what you do.",
    "Your future depends on what you do today.",
    "Excellence is not a destination; it is a continuous journey.",
    "Believe in yourself and you're halfway there.",
    "Don't watch the clock; do what it does. Keep going.",
    "The expert in anything was once a beginner.",
    "Strive for progress, not perfection.",
    "You are capable of amazing things.",
    "Success is the result of preparation, hard work, and learning from failure."
  ];

  const getRandomQuote = () => {
    return inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

import { API_BASE_URL } from '../config';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const inspirationalQuotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The only way to do great work is to love what you do.",
    "Your future depends on what you do today.",
    "Excellence is not a destination; it is a continuous journey.",
    "Believe in yourself and you're halfway there.",
    "Don't watch the clock; do what it does. Keep going.",
    "The expert in anything was once a beginner.",
    "Strive for progress, not perfection.",
    "You are capable of amazing things.",
    "Success is the result of preparation, hard work, and learning from failure."
  ];

  const getRandomQuote = () => {
    return inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch streak
      const streakResponse = await fetch(`${API_BASE_URL}/streaks/current`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const streakData = await streakResponse.json();
      setStreak(streakData);

      // Fetch upcoming tasks (next 24 hours)
      const tasksResponse = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const tasksData = await tasksResponse.json();
      const pendingUpcomingTasks = (tasksData.tasks || [])
        .filter(t => !t.is_completed && t.status !== 'completed')
        .slice(0, 3);
      setUpcomingTasks(pendingUpcomingTasks);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="dashboard-container"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="dashboard-container">
      {/* Inspirational Quote */}
      <div className="inspiration-banner">
        <div className="inspiration-content">
          <p className="inspiration-icon">✨</p>
          <p className="inspiration-text">"{getRandomQuote()}"</p>
        </div>
      </div>

      <div className="dashboard-header">
        <h1>📊 Welcome, {user?.first_name || user?.username}!</h1>
        <p>Your productivity dashboard</p>
      </div>

      {/* Upcoming Tasks Notifications */}
      {upcomingTasks.length > 0 && (
        <div className="notifications-section">
          <h2>🔔 Upcoming Tasks</h2>
          <div className="notifications-list">
            {upcomingTasks.map((task, index) => (
              <div key={task.id} className="notification-item">
                <div className="notification-icon">🎯</div>
                <div className="notification-content">
                  <p className="notification-title">{task.subject}</p>
                  <p className="notification-time">📅 {task.date} • ⏰ {task.start_time}</p>
                  <span className={`priority-badge ${task.priority}`}>{task.priority.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Streak - Priority High */}
        <div className="dashboard-card streak-card highlight">
          <h3>🔥 Current Streak</h3>
          <div className="stat-display">
            <div className="streak-display">
              <div className="streak-current">
                <span className="streak-value">{streak?.current_streak || 0}</span>
                <span className="streak-label">Days</span>
              </div>
              <div className="streak-best">
                <span className="streak-value">{streak?.longest_streak || 0}</span>
                <span className="streak-label">Best Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="dashboard-card highlight">
          <h3>📈 Weekly Performance</h3>
          <div className="stat-display">
            <div className="stat-item">
              <span className="stat-value">{stats?.week?.performance_score?.toFixed(1) || 0}%</span>
              <span className="stat-label">Productivity Score</span>
            </div>
            <p className="score-message">Your productivity: {stats?.week?.performance_score?.toFixed(1) || 0}% this week</p>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="dashboard-card">
          <h3>📅 Today's Tasks</h3>
          <div className="stat-display">
            <div className="stat-item">
              <span className="stat-value">{stats?.today?.completed}/{stats?.today?.total}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${stats?.today?.completion_percentage || 0}%` }}
              ></div>
            </div>
            <span className="percentage">{(stats?.today?.completion_percentage || 0).toFixed(1)}%</span>
          </div>
        </div>

        {/* Study Hours */}
        <div className="dashboard-card">
          <h3>⏱️ Total Study Hours</h3>
          <div className="stat-display">
            <span className="stat-value">{(stats?.total_study_hours || 0).toFixed(1)}</span>
            <span className="stat-label">Hours</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="dashboard-card alert-card">
          <h3>⏰ Pending Tasks</h3>
          <div className="stat-display">
            <span className="stat-value">{stats?.pending_count || 0}</span>
            <span className="stat-label">Waiting</span>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="dashboard-card alert-card danger">
          <h3>⚠️ Overdue Tasks</h3>
          <div className="stat-display">
            <span className="stat-value danger-value">{stats?.overdue_count || 0}</span>
            <span className="stat-label">Overdue</span>
          </div>
        </div>
      </div>

      {/* Subject-wise Time */}
      {stats?.subject_times && Object.keys(stats.subject_times).length > 0 && (
        <div className="dashboard-section">
          <h2>📚 Subject-wise Time Tracking</h2>
          <div className="subject-breakdown">
            {Object.entries(stats.subject_times).map(([subject, hours]) => (
              <div key={subject} className="subject-item">
                <span className="subject-name">{subject}</span>
                <div className="subject-bar">
                  <div className="subject-fill" style={{ width: `${Math.min((hours / 10) * 100, 100)}%` }}></div>
                </div>
                <span className="subject-hours">{hours.toFixed(1)} hrs</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison */}
      <div className="dashboard-section">
        <h2>📊 Performance Comparison</h2>
        <div className="comparison">
          <div className="comparison-item">
            <span>📍 Today: {stats?.week?.vs_yesterday?.today_completed} tasks</span>
            <span>📍 Yesterday: {stats?.week?.vs_yesterday?.yesterday_completed} tasks</span>
            <span className={stats?.week?.vs_yesterday?.improvement > 0 ? 'positive' : 'neutral'}>
              {stats?.week?.vs_yesterday?.improvement > 0 ? '📈 +' : ''}{(stats?.week?.vs_yesterday?.improvement || 0).toFixed(1)}% improvement
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
