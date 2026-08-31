import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_TOKEN_KEY = 'NIRVOY_AUTH_TOKEN';
const AUTH_USER_KEY = 'NIRVOY_AUTH_USER';
const AUTH_PROFILE_KEY = 'NIRVOY_AUTH_PROFILE';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [patientProfile, setPatientProfile] = useState(() => {
    const saved = localStorage.getItem(AUTH_PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync with backend on startup if token exists
  useEffect(() => {
    async function verifyAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setPatientProfile(data.profile);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
          localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(data.profile));
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.warn('Could not verify session with backend:', err);
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setToken(data.token);
    setUser(data.user);
    setPatientProfile(data.profile);

    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(data.profile));

    return data;
  };

  const register = async (patientData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    setToken(data.token);
    setUser(data.user);
    setPatientProfile(data.profile);

    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(data.profile));

    return data;
  };

  const updateProfile = async (updatedData) => {
    if (!token) throw new Error('Not authenticated');

    const res = await fetch('/api/patient/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Update failed');
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    }
    if (data.profile) {
      setPatientProfile(data.profile);
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(data.profile));
    }

    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPatientProfile(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_PROFILE_KEY);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        patientProfile,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
