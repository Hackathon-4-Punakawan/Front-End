/**
 * Service API Autentikasi untuk BIMA / Konversi Amikom
 * Base URL diambil dari environment variable VITE_API_BASE_URL
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-konversi.vercel.app/api/v1';

/**
 * Mappings antara Peran Backend (RBAC) dengan Frontend Rute
 */
export const mapBackendRoleToFrontend = (backendRole) => {
  if (!backendRole) return 'mahasiswa';
  const roleUpper = String(backendRole).toUpperCase();
  switch (roleUpper) {
    case 'MAHASISWA':
      return 'mahasiswa';
    case 'DPL':
    case 'DOSEN':
      return 'dosen';
    case 'MITRA':
      return 'mitra';
    case 'ADMIN_PRODI':
    case 'DEKAN':
    case 'KAPRODI':
      return 'kaprodi';
    default:
      return backendRole.toLowerCase();
  }
};

export const mapFrontendRoleToBackend = (frontendRole) => {
  if (!frontendRole) return 'MAHASISWA';
  const roleLower = String(frontendRole).toLowerCase();
  switch (roleLower) {
    case 'mahasiswa':
      return 'MAHASISWA';
    case 'dosen':
      return 'DPL';
    case 'mitra':
      return 'MITRA';
    case 'kaprodi':
      return 'ADMIN_PRODI';
    default:
      return frontendRole.toUpperCase();
  }
};

/**
 * Login Multi-Identifier (NIM / NIDN / Email / Email Supervisor)
 * POST /api/v1/auth/login
 */
export const loginApi = async (identifier, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Login gagal dengan status ${response.status}`;
      return { success: false, message: errorMessage };
    }

    return {
      success: true,
      token: data.token,
      user: data.user || data.data,
      message: data.message || 'Login berhasil',
    };
  } catch (error) {
    console.error('Error pada loginApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API. Periksa koneksi internet Anda.',
    };
  }
};

/**
 * Get Profile User Aktif (/me)
 * GET /api/v1/auth/me
 */
export const getProfileApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || 'Gagal mengambil profil user';
      return { success: false, message: errorMessage };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error pada getProfileApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * Registrasi Mahasiswa Mandiri
 * POST /api/v1/auth/register-mahasiswa
 */
export const registerMahasiswaApi = async ({ nim, nama, email, password, prodi, angkatan }) => {
  try {
    const payload = { nim, nama, email, password };
    if (prodi) payload.prodi = prodi;
    if (angkatan) payload.angkatan = angkatan;

    const response = await fetch(`${API_BASE_URL}/auth/register-mahasiswa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Registrasi gagal dengan status ${response.status}`;
      return { success: false, message: errorMessage };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Registrasi berhasil',
    };
  } catch (error) {
    console.error('Error pada registerMahasiswaApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API. Periksa koneksi internet Anda.',
    };
  }
};
