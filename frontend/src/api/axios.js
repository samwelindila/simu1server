import axios from 'axios';

/** Fix common Netlify typos: https//, https://https://..., etc. */
export function normalizeApiBase(raw) {
  if (!raw || typeof raw !== 'string') return '';

  let url = raw.trim();

  // Missing colon: https//host → https://host
  url = url.replace(/^(https?)\/\//i, '$1://');

  // Multiple protocols: https://https://host or https://https//host
  const stacked = url.match(/^(?:https?:\/\/)+(.+)$/i);
  if (stacked) {
    const rest = stacked[1].replace(/^(https?)\/\//i, '$1://').replace(/^\/+/, '');
    url = `https://${rest}`;
  } else if (!/^https?:\/\//i.test(url)) {
    url = `https://${url.replace(/^\/+/, '')}`;
  }

  return url.replace(/\/$/, '');
}

/** Backend root, e.g. https://simu1server.onrender.com */
export const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL);

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
