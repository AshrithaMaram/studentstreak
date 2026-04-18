import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/PomodoroTimer.css';

const PomodoroTimer = () => {
  const [sessions, setSessions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isStudyMode, setIsStudyMode] = useState(true);
  const [currentSession, setCurrentSession] = useState(null);
  const [subject, setSubject] = useState('');
  const [stats, setStats] = useState({
    week_total_sessions: 0,
    week_total_time_hours: 0,
    subject_breakdown: {}
  });

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pomodoro/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data || {
        week_total_sessions: 0,
        week_total_time_hours: 0,
        subject_breakdown: {}
      });
    } catch (error) {
      console.error('Failed to fetch pomodoro stats:', error);
      setStats({
        week_total_sessions: 0,
        week_total_time_hours: 0,
        subject_breakdown: {}
      });
    }
  }, []);

  const handleSessionComplete = useCallback(async () => {
    if (currentSession && isStudyMode) {
      try {
        const response = await fetch(`${API_BASE_URL}/pomodoro/${currentSession.id}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (response.ok) {
          fetchStats();
        }
      } catch (error) {
        console.error('Error completing session:', error);
      }
    }

    setIsStudyMode(prev => !prev);
  }, [currentSession, isStudyMode, fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isRunning) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return isStudyMode ? 5 * 60 : 25 * 60;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isStudyMode, handleSessionComplete]);

  const handleStartSession = async () => {
    if (!subject.trim()) {
      alert('Please enter a subject name');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pomodoro/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: subject,
          duration_minutes: 25
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.session) {
        setCurrentSession(data.session);
        setIsRunning(true);
      } else {
        throw new Error('Invalid session response');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error starting session: ' + error.message);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-header">
        <h1>🍅 Pomodoro Timer</h1>
      </div>

      <div className="pomodoro-main">
        <div className="timer-display">
          <div className={`timer-circle ${isStudyMode ? 'study' : 'break'}`}>
            <div className="timer-text">
              <span className="time">{formatTime(timeLeft)}</span>
              <span className="mode">{isStudyMode ? 'Study Time' : 'Break Time'}</span>
            </div>
          </div>
        </div>

        <div className="timer-controls">
          {!currentSession ? (
            <div className="session-input">
              <input
                type="text"
                placeholder="Enter subject name"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isRunning}
              />
              <button
                className="btn-primary"
                onClick={handleStartSession}
                disabled={isRunning}
              >
                Start Session
              </button>
            </div>
          ) : (
            <div className="session-info">
              <p>Currently studying: <strong>{currentSession.subject}</strong></p>
              <button
                className={isRunning ? 'btn-warning' : 'btn-primary'}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? 'Pause' : 'Resume'}
              </button>
            </div>
          )}
        </div>

        {stats && (
          <div className="pomodoro-stats">
            <h3>📊 This Week's Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.week_total_sessions || 0}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{((stats.week_total_time_hours || 0).toFixed(1))}</span>
                <span className="stat-label">Hours Studied</span>
              </div>
            </div>

            {stats.subject_breakdown && Object.keys(stats.subject_breakdown).length > 0 && (
              <div className="subject-stats">
                <h4>Subject Breakdown</h4>
                {Object.entries(stats.subject_breakdown).map(([subj, data]) => (
                  <div key={subj} className="subject-stat">
                    <span>{subj}</span>
                    <span>{(data.sessions || 0)} sessions ({((data.time || 0) / 60).toFixed(1)}h)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
