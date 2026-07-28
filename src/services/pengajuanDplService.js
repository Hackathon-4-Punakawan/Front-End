import { API_BASE_URL } from './authService';

/**
 * 1. GET HELPER INFO FOR STEP 4 PENGAJUAN DPL FORM
 * GET /api/v1/pengajuan-dpl/helper-info
 */
export const getPengajuanDplHelperInfoApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pengajuan-dpl/helper-info`, {
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
        message: data?.message || data?.error || 'Gagal mengambil helper info pengajuan DPL',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getPengajuanDplHelperInfoApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 2. SUBMIT FORM PENGAJUAN DOSEN PEMBIMBING MAGANG (STEP 4)
 * POST /api/v1/pengajuan-dpl
 */
export const submitPengajuanDplApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pengajuan-dpl`, {
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
        message: data?.message || data?.error || 'Gagal mengajukan Dosen Pembimbing Magang',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Pengajuan Dosen Pembimbing Magang berhasil dikirim.',
    };
  } catch (error) {
    console.error('Error pada submitPengajuanDplApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 3. GET MONITORING STATUS PENGAJUAN DPL (STEP 4)
 * GET /api/v1/pengajuan-dpl/my-status
 */
export const getMyPengajuanDplStatusApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pengajuan-dpl/my-status`, {
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
        message: data?.message || data?.error || 'Gagal mengambil status pengajuan DPL',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getMyPengajuanDplStatusApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};
