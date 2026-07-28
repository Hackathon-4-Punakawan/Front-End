import { API_BASE_URL } from './authService';

/**
 * Service API untuk Dashboard Dosen Pembimbing Lapangan (DPL)
 * Base endpoint: /api/v1/dosen
 */

/**
 * 1. Statistik Dashboard DPL
 * GET /api/v1/dosen/dashboard-stats
 */
export const getDosenDashboardStatsApi = async (token, semester = 6) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dosen/dashboard-stats?semester=${semester}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal mengambil statistik DPL' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error getDosenDashboardStatsApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 2. Daftar Mahasiswa Bimbingan DPL
 * GET /api/v1/dosen/mahasiswa?search=&status_konversi=
 */
export const getDosenMahasiswaListApi = async (token, { search = '', status_konversi = '' } = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status_konversi) params.append('status_konversi', status_konversi);
    const response = await fetch(`${API_BASE_URL}/dosen/mahasiswa?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal mengambil daftar mahasiswa' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error getDosenMahasiswaListApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 3. Detail Data Mahasiswa Bimbingan DPL
 * GET /api/v1/dosen/mahasiswa/:nim
 */
export const getDosenMahasiswaDetailApi = async (token, nim) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dosen/mahasiswa/${nim}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal mengambil detail mahasiswa' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error getDosenMahasiswaDetailApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 4. Review Konversi SKS oleh DPL (ACC / REVISI / INPUT_NILAI)
 * POST /api/v1/dosen/konversi/review
 * Body: { id_item_konversi, nim, action, catatan_dosen?, nilai_angka?, nilai_huruf? }
 */
export const dosenReviewKonversiApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dosen/konversi/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal menyimpan review konversi' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error dosenReviewKonversiApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 5. Shortcut ACC semua konversi mahasiswa
 * POST /api/v1/dosen/konversi/acc
 */
export const dosenAccAllKonversiApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dosen/konversi/acc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal ACC konversi' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error dosenAccAllKonversiApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};
