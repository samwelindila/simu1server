import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('simu1_token'));
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/api/auth/me')
        .then(r => setAdmin(r.data))
        .catch(() => logout());
    }
  }, [token]);

  const login = async (email, password) => {
    const r = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('simu1_token', r.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${r.data.token}`;
    setToken(r.data.token);
    setAdmin({ email: r.data.email });
  };

  const logout = () => {
    localStorage.removeItem('simu1_token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
