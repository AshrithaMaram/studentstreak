import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    priority: 'medium'
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
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
    
    // Frontend validation
    if (!formData.subject.trim()) {
      alert('Please enter a subject');
      return;
    }
    if (!formData.date) {
      alert('Please select a date');
      return;
    }
    if (!formData.start_time) {
      alert('Please enter start time');
      return;
    }
    if (!formData.end_time) {
      alert('Please enter end time');
      return;
    }
    
    try {
      const payload = {
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        priority: formData.priority
      };
      
      console.log('Sending task payload:', JSON.stringify(payload, null, 2));
      
      let response;
      if (editingId) {
        // Update task
        response = await fetch(`${API_BASE_URL}/tasks/${editingId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create task
        response = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }
      
      const responseData = await response.json();
      console.log('Response:', responseData);
      
      if (!response.ok) {
        const errorMsg = responseData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      // Reset form and fetch updated tasks
      setFormData({
        subject: '',
        description: '',
        date: '',
        start_time: '',
        end_time: '',
        priority: 'medium'
      });
      setEditingId(null);
      setShowForm(false);
      await fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task: ' + error.message);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.ok) {
        await fetchTasks();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
      alert('Error completing task: ' + error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (response.ok) {
          await fetchTasks();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Error deleting task: ' + error.message);
      }
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#4CAF50',
      medium: '#FFC107',
      high: '#FF5722'
    };
    return colors[priority] || '#999';
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.is_completed;
    if (filter === 'pending') return !task.is_completed;
    return true;
  });

  const upcomingTasks = tasks.filter(t => !t.is_completed && t.status !== 'completed').slice(0, 3);
  const overdueTasks = tasks.filter(t => t.status === 'overdue').slice(0, 3);

  return (
    <div className="task-manager">
      <div className="task-header">
        <h1>📝 Task Manager</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 && (
        <div className="alert-section overdue">
          <h3>⚠️ Overdue Tasks - Action Required!</h3>
          <div className="alert-tasks">
            {overdueTasks.map(task => (
              <div key={task.id} className="alert-task-item">
                <span className="alert-task-name">{task.subject}</span>
                <span className="alert-task-date">Due: {task.date}</span>
                <span className={`priority-label ${task.priority}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tasks Notification */}
      {upcomingTasks.length > 0 && (
        <div className="alert-section upcoming">
          <h3>📌 Upcoming Tasks</h3>
          <div className="alert-tasks">
            {upcomingTasks.map(task => (
              <div key={task.id} className="alert-task-item">
                <span className="alert-task-name">{task.subject}</span>
                <span className="alert-task-date">📅 {task.date} • ⏰ {task.start_time}</span>
                <span className={`priority-label ${task.priority}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>End Time *</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleFormChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="2"
              ></textarea>
            </div>
          </div>
          
          <button type="submit" className="btn-success">Save Task</button>
        </form>
      )}

      <div className="task-filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({tasks.length})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({tasks.filter(t => !t.is_completed).length})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks.filter(t => t.is_completed).length})
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Create one to get started!</p>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-item ${task.status}`}>
              <div 
                className="priority-indicator" 
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              ></div>
              
              <div className="task-content">
                <div className="task-title">
                  <h3>{task.subject}</h3>
                  <span className={`status-badge ${task.status}`}>{task.status}</span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span>📅 {task.date}</span>
                  <span>⏰ {task.start_time} - {task.end_time}</span>
                </div>
              </div>
              
              <div className="task-actions">
                {!task.is_completed && (
                  <button 
                    className="btn-small btn-success"
                    onClick={() => handleCompleteTask(task.id)}
                  >
                    ✓ Complete
                  </button>
                )}
                <button 
                  className="btn-small btn-danger"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
