import { useState } from 'react';
import { login } from '../services/auth';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    isLoading,
    error,
    handleLogin,
    handleLogout,
  };
};

