import { API_URL } from "../utils/constants";

const authenticatedFetch = async (url, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
  
      const response = await fetch(url, options);
      
      if (response.status === 403) {
        throw new Error('Session expired');
      }
      
      return response;
    } catch (error) {
      if (error.message === 'Session expired') {
        throw error;
      }
      throw new Error('Network error');
    }
  };
  
  export const api = {
    getFoods: () => authenticatedFetch(`${API_URL}/foods`),
    addFood: (formData) => authenticatedFetch(`${API_URL}/admin/food`, {
      method: 'POST',
      body: formData,
    }),
    updateFood: (id, formData) => authenticatedFetch(`${API_URL}/admin/food/${id}`, {
      method: 'PUT',
      body: formData,
    }),
    deleteFood: (id) => authenticatedFetch(`${API_URL}/admin/food/${id}`, {
      method: 'DELETE',
    }),
  };
  