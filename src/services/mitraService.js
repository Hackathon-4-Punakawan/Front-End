import { API_BASE_URL } from './authService';

/**
 * Service API untuk Dashboard Mitra Industri
 */

/**
 * 1. Ringkasan Statistik Dashboard Mitra
 * GET /api/v1/mitra/dashboard-stats
 */
export const getMitraDashboardStatsApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mitra/dashboard-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal mengambil statistik dashboard mitra',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getMitraDashboardStatsApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 2. Daftar Mahasiswa Pengaju Surat Terima Kasih ke Mitra
 * GET /api/v1/mitra/mahasiswa
 */
export const getMitraMahasiswaListApi = async (token, search = '', status = '') => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/mitra/mahasiswa${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal mengambil daftar mahasiswa mitra',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getMitraMahasiswaListApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 3. Detail Data Mahasiswa Magang per NIM
 * GET /api/v1/mitra/mahasiswa/:nim
 */
export const getMitraMahasiswaDetailApi = async (token, nim) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mitra/mahasiswa/${nim}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal mengambil detail mahasiswa mitra',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getMitraMahasiswaDetailApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 4. Submit Penilaian Akhir Magang & Sertifikat oleh Mitra
 * POST /api/v1/mitra/penilaian
 */
export const submitMitraPenilaianApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mitra/penilaian`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_surat_akhir: payload.id_surat_akhir,
        nim: payload.nim,
        nilai_mitra_angka: payload.nilai_mitra_angka,
        nilai_mitra_huruf: payload.nilai_mitra_huruf || null,
        catatan_mitra: payload.catatan_mitra || '',
        sertifikat_magang_url: payload.sertifikat_magang_url || null,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal menyimpan penilaian mitra',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error pada submitMitraPenilaianApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};
