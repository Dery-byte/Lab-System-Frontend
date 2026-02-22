import axios from 'axios';

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const auth = JSON.parse(authStorage);
      const token = auth?.state?.accessToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {}
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
