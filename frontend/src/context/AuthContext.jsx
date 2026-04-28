import { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sc_user'));
      if (!stored || typeof stored !== 'object') return null;
      const roles = Array.isArray(stored.roles)
        ? stored.roles
        : typeof stored.roles === 'string'
          ? [stored.roles]
          : [];
      return { ...stored, roles };
    } catch {
      return null;
    }
  });

  const normalizeRoles = (roles) => {
    if (Array.isArray(roles)) return roles;
    if (typeof roles === 'string') return [roles];
    return [];
  };

  const setAuth = (data) => {
    const roles = normalizeRoles(data.roles);
    const u = { username: data.username, email: data.email, fullName: data.fullName, roles };
    localStorage.setItem('sc_token', data.token);
    localStorage.setItem('sc_user', JSON.stringify(u));
    setUser(u);
  };

  const login = async (username, password) => {
    const res = await authService.login({ username, password });
    setAuth(res.data.data);
    return res;
  };

  const register = async (form) => {
    const res = await authService.register(form);
    setAuth(res.data.data);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    setUser(null);
  };

  const roles = normalizeRoles(user?.roles);
  const isAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');
  const isTechnician = roles.includes('ROLE_TECHNICIAN') || roles.includes('TECHNICIAN');
  const isUser = roles.includes('ROLE_USER') || roles.includes('USER');

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isTechnician, isUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
