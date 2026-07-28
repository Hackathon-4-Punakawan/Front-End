import { API_BASE_URL } from './authService';

/**
 * Service API untuk Logbook Harian/Mingguan Mahasiswa
 * Base endpoint: /api/v1/mahasiswa/logbook
 */

/**
 * 1. Ambil semua logbook mahasiswa yang sedang login
 * GET /api/v1/mahasiswa/logbook
 */
export const getMyLogbookApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mahasiswa/logbook`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Gagal mengambil data logbook' };
    }
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error pada getMyLogbookApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 2. Submit logbook baru (harian/mingguan)
 * POST /api/v1/mahasiswa/logbook
 * Body: { minggu_ke, tanggal_mulai, tanggal_selesai, ringkasan_kegiatan, file_lampiran_url? }
 */
export const submitLogbookApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mahasiswa/logbook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Gagal menyimpan logbook' };
    }
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error pada submitLogbookApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};
