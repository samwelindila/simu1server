import axios from 'axios';

/** Backend root, e.g. https://simu1-api.onrender.com — no trailing slash */
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE,
});

export function asArray(data) {
  return Array.isArray(data) ? data : [];
}

/** Turn /uploads/... paths into full URLs in production */
export function mediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path}`;
}

export default api;
