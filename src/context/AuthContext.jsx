import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginApi,
  getProfileApi,
  registerMahasiswaApi,
  mapBackendRoleToFrontend,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('edushift_token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('edushift_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    return null;
  });
  const [isInitializing, setIsInitializing] = useState(true);

  // Sync token state to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('edushift_token', token);
    } else {
      localStorage.removeItem('edushift_token');
    }
  }, [token]);

  // Sync currentUser state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edushift_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('edushift_current_user');
    }
  }, [currentUser]);

  // Fetch /auth/me profile when app loads if token exists
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('edushift_token');
      if (savedToken) {
        const res = await getProfileApi(savedToken);
        if (res.success && res.data) {
          const uData = res.data;
          const mappedRole = mapBackendRoleToFrontend(uData.role);
          const formattedUser = {
            id: uData.id,
            name: uData.profile?.nama || uData.email,
            identity: uData.profile?.nidn || uData.profile?.nim || uData.email,
            email: uData.email,
            role: mappedRole,
            rawRole: uData.role,
            profile: uData.profile,
            token: savedToken,
          };
          setCurrentUser(formattedUser);
        } else {
          // Clear invalid token
          setToken(null);
          setCurrentUser(null);
        }
      }
      setIsInitializing(false);
    };

    initAuth();
  }, []);

  // Login Function via Real API
  const login = async (loginInput, password, selectedRole) => {
    const result = await loginApi(loginInput, password);

    if (!result.success || !result.user) {
      return { success: false, message: result.message || 'Gagal mengambil data akun.' };
    }

    const { token: apiToken, user: uData } = result;
    const mappedRole = mapBackendRoleToFrontend(uData?.role);

    const formattedUser = {
      id: uData?.id,
      name: uData?.profile?.nama || uData?.email || 'User',
      identity: uData?.profile?.nidn || uData?.profile?.nim || uData?.email,
      email: uData?.email,
      role: mappedRole,
      rawRole: uData?.role,
      profile: uData?.profile,
      token: apiToken,
    };

    setToken(apiToken);
    setCurrentUser(formattedUser);

    return {
      success: true,
      user: formattedUser,
      message: result.message || 'Login berhasil',
    };
  };

  // Register Function via Real API (Mahasiswa Mandiri)
  const register = async (name, identity, email, password, role) => {
    const result = await registerMahasiswaApi({
      nim: identity,
      nama: name,
      email,
      password,
    });

    if (!result.success) {
      return { success: false, message: result.message };
    }

    // Auto-login after registration
    const loginResult = await login(identity || email, password, role || 'mahasiswa');
    if (loginResult.success) {
      return { success: true, user: loginResult.user };
    }

    return {
      success: true,
      user: {
        name,
        identity,
        email,
        role: 'mahasiswa',
      },
      message: 'Registrasi berhasil. Silakan login.',
    };
  };

  // Logout Function
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('edushift_token');
    localStorage.removeItem('edushift_current_user');
  };

  const getRoleLabel = (r) => {
    switch (r) {
      case 'mahasiswa': return 'Mahasiswa';
      case 'dosen': return 'Dosen Pembimbing (DPL)';
      case 'mitra': return 'Mitra Industri';
      case 'kaprodi': return 'Admin / Kaprodi';
      default: return r;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, register, logout, getRoleLabel, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
