import { useState, useCallback } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('access_token', data.access_token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (username, email, password, firstName, lastName) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/signup', {
        username,
        email,
        password,
        confirm_password: password,
        first_name: firstName,
        last_name: lastName
      });
      localStorage.setItem('access_token', data.access_token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
  }, []);

  return { user, setUser, isLoading, error, login, signup, logout };
};

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (page = 1, perPage = 10, startDate, endDate) => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/tasks', {
        params: { page, per_page: perPage, start_date: startDate, end_date: endDate }
      });
      setTasks(data.tasks);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { tasks, setTasks, isLoading, error, fetchTasks };
};

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async (type) => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/goals', { params: { type } });
      setGoals(data.goals);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch goals');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { goals, setGoals, isLoading, error, fetchGoals };
};

export const useStreak = () => {
  const [streak, setStreak] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStreak = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/streaks/current');
      setStreak(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch streak');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { streak, setStreak, isLoading, error, fetchStreak };
};

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard stats');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { stats, setStats, isLoading, error, fetchStats };
};

import api from './api';
