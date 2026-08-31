import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_TOKEN_KEY = 'NIRVOY_AUTH_TOKEN';
const AUTH_USER_KEY = 'NIRVOY_AUTH_USER';
const AUTH_PROFILE_KEY = 'NIRVOY_AUTH_PROFILE';

function safeParseJSON(val) {
  if (!val || val === 'undefined' || val === 'null') return null;
  try {
    return JSON.parse(val);
  } catch (e) {
    console.warn('Failed to parse localStorage JSON:', e);
    return null;
  }
}

function normalizeProfile(profile) {
  if (!profile) return null;
  let diseases = profile.chronic_diseases;
  if (typeof diseases === 'string') {
    diseases = diseases.replace(/^{|}$/g, '').split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean);
  }
  let allergies = profile.allergies;
  if (typeof allergies === 'string') {
    allergies = allergies.replace(/^{|}$/g, '').split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean);
  }
  return {
    ...profile,
    chronic_diseases: Array.isArray(diseases) ? diseases : [],
    allergies: Array.isArray(allergies) ? allergies : []
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return safeParseJSON(localStorage.getItem(AUTH_USER_KEY));
  });

  const [patientProfile, setPatientProfile] = useState(() => {
    return normalizeProfile(safeParseJSON(localStorage.getItem(AUTH_PROFILE_KEY)));
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
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          const normProfile = normalizeProfile(data.profile);
          setUser(data.user || null);
          setPatientProfile(normProfile);
          if (data.user) {
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
          }
          if (normProfile) {
            localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(normProfile));
          }
        } else if (res.status === 401 || res.status === 403) {
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

    let data;
    try {
      data = await res.json();
    } catch {
      data = { error: 'Server response error' };
    }

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    const normProfile = normalizeProfile(data.profile);
    setToken(data.token);
    setUser(data.user || null);
    setPatientProfile(normProfile);

    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    if (normProfile) {
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(normProfile));
    }

    return data;
  };

  const register = async (patientData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { error: 'Server response error' };
    }

    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    const normProfile = normalizeProfile(data.profile);
    setToken(data.token);
    setUser(data.user || null);
    setPatientProfile(normProfile);

    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    if (normProfile) {
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(normProfile));
    }

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

    let data;
    try {
      data = await res.json();
    } catch {
      data = { error: 'Server response error' };
    }

    if (!res.ok) {
      throw new Error(data.error || 'Update failed');
    }

    const normProfile = normalizeProfile(data.profile);
    if (data.user) {
      setUser(data.user);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    }
    if (normProfile) {
      setPatientProfile(normProfile);
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(normProfile));
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
