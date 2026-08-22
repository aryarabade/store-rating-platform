/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

  // On first load, check if a token already exists (e.g. page refresh)
  // and restore the session by asking the backend who we are.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    authApi
      .getMe()
      .then((res) => setUser(res.data.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password, selectedRole) {
    const res = await authApi.login({ email, password, selectedRole });
    const { token, user: loggedInUser } = res.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function signup(formData) {
    const res = await authApi.signup(formData);
    // Account creation does not start a session. The user must explicitly
    // sign in from the Login page with the role they selected.
    return res.data.data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
