import { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const logout = useCallback((options = {}) => {
    const { redirect = '/login', showMessage = false, message = '' } = options;
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    if (showMessage && message) {
      window.alert(message);
    }
    window.location.href = redirect;
  }, []);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkLoggedIn = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const envApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const socketUrl = envApiUrl.replace(/\/api$/, '');
    const socket = io(socketUrl, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      if (user?.userId) {
        socket.emit('register_user', user.userId);
      }
    });

    socket.on('force_logout', ({ message }) => {
      logout({ redirect: '/login', showMessage: true, message: message || 'Tài khoản của bạn đã bị khóa bởi quản trị viên.' });
    });

    socket.on('disconnect', () => {
      // Keep user state until backend forces logout or API denies access
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, logout]);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
