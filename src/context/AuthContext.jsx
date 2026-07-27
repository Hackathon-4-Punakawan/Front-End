import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    name: 'Budi Santoso',
    identity: '22.11.4321', // NIM
    email: 'budi.mahasiswa@amikom.ac.id',
    password: 'password123',
    role: 'mahasiswa',
  },
  {
    name: 'Dr. Ahmad Dahlan, M.T.',
    identity: '0412088501', // NIDN
    email: 'ahmad.dosen@amikom.ac.id',
    password: 'password123',
    role: 'dosen',
  },
  {
    name: 'Google Indonesia (Mitra)',
    identity: 'MITRA-GOOG', // Kode Mitra
    email: 'hr@google.co.id',
    password: 'password123',
    role: 'mitra',
  },
  {
    name: 'Prof. Kusrini, M.Kom.',
    identity: '0419077902', // NIDN Kaprodi
    email: 'kusrini.kaprodi@amikom.ac.id',
    password: 'password123',
    role: 'kaprodi',
  }
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('edushift_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('edushift_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('edushift_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edushift_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('edushift_current_user');
    }
  }, [currentUser]);

  // Login function
  const login = (loginInput, password, selectedRole) => {
    // Cari user yang cocok dengan email/NIM dan password serta role
    const foundUser = users.find(
      (u) =>
        (u.email.toLowerCase() === loginInput.toLowerCase() || u.identity === loginInput) &&
        u.password === password &&
        u.role === selectedRole
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      return { success: true, user: foundUser };
    } else {
      // Periksa apakah username/password salah, atau rol yang tidak cocok
      const userWithInput = users.find(
        (u) => u.email.toLowerCase() === loginInput.toLowerCase() || u.identity === loginInput
      );
      
      if (!userWithInput) {
        return { success: false, message: 'Akun tidak terdaftar' };
      } else if (userWithInput.password !== password) {
        return { success: false, message: 'Kata sandi salah' };
      } else {
        return { success: false, message: `Peran yang dipilih salah. Akun ini terdaftar sebagai ${getRoleLabel(userWithInput.role)}` };
      }
    }
  };

  // Register function
  const register = (name, identity, email, password, role) => {
    // Periksa apakah NIM/Email sudah terdaftar
    const isExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.identity === identity
    );

    if (isExists) {
      return { success: false, message: 'Email atau NIM/NIDN/ID sudah terdaftar' };
    }

    const newUser = { name, identity, email, password, role };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser); // Auto login setelah register
    return { success: true, user: newUser };
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
  };

  const getRoleLabel = (r) => {
    switch (r) {
      case 'mahasiswa': return 'Mahasiswa';
      case 'dosen': return 'Dosen';
      case 'mitra': return 'Mitra Industri';
      case 'kaprodi': return 'Kaprodi';
      default: return r;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, getRoleLabel }}>
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
