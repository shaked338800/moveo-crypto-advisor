import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Raw API functions ---

export const registerApi = (name: string, email: string, password: string) =>
  api.post('/api/auth/register', { name, email, password }).then((r) => r.data);

export const loginApi = (email: string, password: string) =>
  api.post('/api/auth/login', { email, password }).then((r) => r.data);

export const getMeApi = () =>
  api.get('/api/user/me').then((r) => r.data);

export const savePreferencesApi = (
  coins: string[],
  investorType: string,
  contentTypes: string[]
) =>
  api.post('/api/user/preferences', { coins, investorType, contentTypes }).then((r) => r.data);

export const getDashboardApi = () =>
  api.get('/api/dashboard').then((r) => r.data);

export const submitVoteApi = (sectionType: string, contentId: string, vote: number) =>
  api.post('/api/votes', { sectionType, contentId, vote }).then((r) => r.data);
