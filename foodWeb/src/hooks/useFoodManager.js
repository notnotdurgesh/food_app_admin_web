import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useFoodManager = () => {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFoods = async () => {
    setIsLoading(true);
    try {
      const response = await api.getFoods();
      const data = await response.json();
      setFoods(data);
    } catch (err) {
      setError('Failed to fetch foods');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const addFood = async (foodData) => {
    setIsLoading(true);
    try {
      await api.addFood(foodData);
      await fetchFoods();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFood = async (id, foodData) => {
    setIsLoading(true);
    try {
      await api.updateFood(id, foodData);
      await fetchFoods();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFood = async (id) => {
    setIsLoading(true);
    try {
      await api.deleteFood(id);
      await fetchFoods();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    foods,
    isLoading,
    error,
    addFood,
    updateFood,
    deleteFood,
  };
};

