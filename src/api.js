// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';  // Change this to match your Django server

// Create axios instance with auth token
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Transaction API
export const transactionAPI = {
  getAll: () => apiClient.get('transactions/'),
  getExpenses: () => apiClient.get('transactions/expenses/'),
  getIncomes: () => apiClient.get('transactions/income/'),
  getSavings: () => apiClient.get('transactions/savings/'),
  create: (transactionData) => apiClient.post('transactions/', transactionData),
  update: (id, transactionData) => apiClient.put(`transactions/${id}/`, transactionData),
  delete: (id) => apiClient.delete(`transactions/${id}/`),
};

// Category API
export const categoryAPI = {
  getAll: () => apiClient.get('categories/'),
  getExpenseCategories: () => apiClient.get('categories/expense_categories/'),
  getIncomeCategories: () => apiClient.get('categories/income_categories/'),
  create: (categoryData) => apiClient.post('categories/', categoryData),
  update: (id, categoryData) => apiClient.put(`categories/${id}/`, categoryData),
  delete: (id) => apiClient.delete(`categories/${id}/`),
};

// Budget API
export const budgetAPI = {
  getAll: () => apiClient.get('budgets/'),
  create: (budgetData) => apiClient.post('budgets/', budgetData),
  update: (id, budgetData) => apiClient.put(`budgets/${id}/`, budgetData),
  delete: (id) => apiClient.delete(`budgets/${id}/`),
};

export default {
  transaction: transactionAPI,
  category: categoryAPI,
  budget: budgetAPI,
};