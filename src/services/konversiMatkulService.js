import { API_BASE_URL } from './authService';

/**
 * 1. GET COURSE CATALOG FOR MANUAL SELECTION (STEP 5)
 * GET /api/v1/konversi-matkul/catalog
 */
export const getKonversiCatalogApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/konversi-matkul/catalog`, {
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
        message: data?.message || data?.error || 'Gagal mengambil katalog mata kuliah konversi',
      };
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error('Error pada getKonversiCatalogApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 2. POST GET AI RECOMMENDATIONS FOR CONVERSION (STEP 5)
 * POST /api/v1/konversi-matkul/ai-recommendation
 */
export const getAiRecommendationApi = async (token, payload = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/konversi-matkul/ai-recommendation`, {
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
        message: data?.message || data?.error || 'Gagal mengambil rekomendasi AI konversi',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Rekomendasi AI berhasil dibuat.',
    };
  } catch (error) {
    console.error('Error pada getAiRecommendationApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 3. SUBMIT TABEL KONVERSI SKS (BATCH / PER MATKUL) (STEP 5)
 * POST /api/v1/konversi-matkul
 */
export const submitKonversiMatkulApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/konversi-matkul`, {
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
        message: data?.message || data?.error || 'Gagal mengajukan tabel konversi SKS',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Pengajuan Konversi SKS berhasil dikirim ke DPL.',
    };
  } catch (error) {
    console.error('Error pada submitKonversiMatkulApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 4. GET MONITORING STATUS TABEL KONVERSI SKS (STEP 5)
 * GET /api/v1/konversi-matkul/my-status
 */
export const getMyKonversiStatusApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/konversi-matkul/my-status`, {
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
        message: data?.message || data?.error || 'Gagal mengambil status konversi SKS',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getMyKonversiStatusApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};
