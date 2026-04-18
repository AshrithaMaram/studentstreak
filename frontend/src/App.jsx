import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import TaskManager from './pages/TaskManager';
import GoalTracker from './pages/GoalTracker';
import PomodoroTimer from './pages/PomodoroTimer';
import { API_BASE_URL } from './config';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('auth');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUserProfile();
      setCurrentPage('dashboard');
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      setUser(data);
      setDarkMode(data.dark_mode || false);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('access_token');
      setCurrentPage('auth');
    }
  };

  const handleLogin = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('access_token', data.access_token);
      setUser(data.user);
      setCurrentPage('dashboard');
    } else {
      throw new Error(data.error);
    }
  };

  const handleSignup = async (username, email, password, firstName, lastName) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password,
        confirm_password: password,
        first_name: firstName,
        last_name: lastName
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('access_token', data.access_token);
      setUser(data.user);
      setCurrentPage('dashboard');
    } else {
      throw new Error(data.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setCurrentPage('auth');
    setAuthMode('login');
  };

  const toggleDarkMode = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/toggle-dark-mode`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setDarkMode(!darkMode);
    } catch (error) {
      console.error('Failed to toggle dark mode:', error);
    }
  };

  if (!user) {
    return (
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        {authMode === 'login' ? (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthMode('signup')}
          />
        ) : (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <nav className="navbar">
        <div className="nav-brand">
          <h2>📚 Smart Student Planner</h2>
        </div>
        
        <div className="nav-links">
          <button
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentPage('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={currentPage === 'tasks' ? 'active' : ''}
            onClick={() => setCurrentPage('tasks')}
          >
            📝 Tasks
          </button>
          <button
            className={currentPage === 'goals' ? 'active' : ''}
            onClick={() => setCurrentPage('goals')}
          >
            🎯 Goals
          </button>
          <button
            className={currentPage === 'pomodoro' ? 'active' : ''}
            onClick={() => setCurrentPage('pomodoro')}
          >
            🍅 Pomodoro
          </button>
        </div>
        
        <div className="nav-right">
          <button className="btn-icon" onClick={toggleDarkMode} title="Toggle Dark Mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span className="user-name">👤 {user.username}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard user={user} />}
        {currentPage === 'tasks' && <TaskManager />}
        {currentPage === 'goals' && <GoalTracker />}
        {currentPage === 'pomodoro' && <PomodoroTimer />}
      </main>
    </div>
  );
}

export default App;
