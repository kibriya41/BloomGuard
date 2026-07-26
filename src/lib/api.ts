import axios from 'axios';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('bloomguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
