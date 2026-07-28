import { API_BASE_URL } from './authService';

/**
 * 1. GET HELPER INFO FOR STEP 3 FORM
 * GET /api/v1/surat-pengantar/helper-info
 */
export const getSuratPengantarHelperInfoApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/surat-pengantar/helper-info`, {
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
        message: data?.message || data?.error || 'Gagal mengambil data helper info Surat Pengantar',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getSuratPengantarHelperInfoApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 2. SUBMIT PENGAJUAN SURAT PENGANTAR (STEP 3)
 * POST /api/v1/surat-pengantar
 */
export const submitSuratPengantarApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/surat-pengantar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal mengajukan Surat Pengantar Magang',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Pengajuan Surat Pengantar Magang FIK berhasil dikirim.',
    };
  } catch (error) {
    console.error('Error pada submitSuratPengantarApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 3. GET MONITORING STATUS SURAT PENGANTAR (STEP 3)
 * GET /api/v1/surat-pengantar/my-status
 */
export const getMySuratPengantarStatusApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/surat-pengantar/my-status`, {
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
        message: data?.message || data?.error || 'Gagal mengambil status Surat Pengantar',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getMySuratPengantarStatusApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};
