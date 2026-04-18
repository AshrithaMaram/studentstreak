import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/GoalTracker.css';

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: 'short_term',
    target_date: '',
    progress_percentage: 0
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGoals(data.goals || []);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      setGoals([]);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setFormData({
        title: '',
        description: '',
        goal_type: 'short_term',
        target_date: '',
        progress_percentage: 0
      });
      setShowForm(false);
      await fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Error creating goal: ' + error.message);
    }
  };

  const handleProgressUpdate = async (goalId, newProgress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ progress_percentage: newProgress })
      });
      if (response.ok) {
        await fetchGoals();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update goal progress:', error);
      alert('Error updating goal progress: ' + error.message);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Delete this goal?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (response.ok) {
          await fetchGoals();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to delete goal:', error);
        alert('Error deleting goal: ' + error.message);
      }
    }
  };

  const shortTermGoals = goals.filter(g => g.goal_type === 'short_term');
  const longTermGoals = goals.filter(g => g.goal_type === 'long_term');

  return (
    <div className="goal-tracker">
      <div className="goal-header">
        <h1>🎯 Goal Tracker</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      {showForm && (
        <form className="goal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Goal Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Type</label>
              <select
                name="goal_type"
                value={formData.goal_type}
                onChange={handleFormChange}
              >
                <option value="short_term">Short Term</option>
                <option value="long_term">Long Term</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Target Date *</label>
              <input
                type="date"
                name="target_date"
                value={formData.target_date}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <button type="submit" className="btn-success">Create Goal</button>
        </form>
      )}

      {shortTermGoals.length > 0 && (
        <div className="goal-section">
          <h2>📌 Short Term Goals</h2>
          <div className="goals-grid">
            {shortTermGoals.map(goal => (
              <div key={goal.id} className={`goal-card ${goal.is_completed ? 'completed' : ''}`}>
                <h3>{goal.title}</h3>
                <p className="goal-description">{goal.description}</p>
                <div className="goal-meta">
                  <span>📅 Target: {goal.target_date}</span>
                </div>
                
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${goal.progress_percentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{goal.progress_percentage.toFixed(0)}%</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress_percentage}
                  onChange={(e) => handleProgressUpdate(goal.id, parseInt(e.target.value))}
                  className="progress-slider"
                />
                
                <button 
                  className="btn-danger"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {longTermGoals.length > 0 && (
        <div className="goal-section">
          <h2>🏆 Long Term Goals</h2>
          <div className="goals-grid">
            {longTermGoals.map(goal => (
              <div key={goal.id} className={`goal-card ${goal.is_completed ? 'completed' : ''}`}>
                <h3>{goal.title}</h3>
                <p className="goal-description">{goal.description}</p>
                <div className="goal-meta">
                  <span>📅 Target: {goal.target_date}</span>
                </div>
                
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${goal.progress_percentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{goal.progress_percentage.toFixed(0)}%</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress_percentage}
                  onChange={(e) => handleProgressUpdate(goal.id, parseInt(e.target.value))}
                  className="progress-slider"
                />
                
                <button 
                  className="btn-danger"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <p className="empty-state">No goals yet. Set one to start tracking your progress!</p>
      )}
    </div>
  );
};

export default GoalTracker;
