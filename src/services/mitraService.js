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

/**
 * 5. Ambil Daftar Pendaftaran Mahasiswa Magang Masuk ke Perusahaan Mitra
 * GET /api/v1/mitra/pendaftaran-magang
 */
export const getMitraPendaftarListApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mitra/pendaftaran-magang`, {
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
        message: data?.message || data?.error || 'Gagal mengambil daftar pendaftaran magang',
      };
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error('Error pada getMitraPendaftarListApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 6. ACC / Disetujui Pendaftaran Mahasiswa Magang oleh Mitra
 * POST /api/v1/mitra/pendaftaran-magang/acc
 */
export const accPendaftarMitraApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mitra/pendaftaran-magang/acc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_pengajuan: payload.id_pengajuan,
        nim: payload.nim,
        catatan_mitra: payload.catatan_mitra || 'Selamat! Pendaftaran magang Anda telah disetujui resmi oleh Mitra Industri.',
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal menyetujui pendaftaran magang',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error pada accPendaftarMitraApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 7. Tolak Pendaftaran Mahasiswa Magang oleh Mitra
 * POST /api/v1/mitra/pendaftaran-magang/tolak
 */
export const tolakPendaftarMitraApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mitra/pendaftaran-magang/tolak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_pengajuan: payload.id_pengajuan,
        nim: payload.nim,
        catatan_mitra: payload.catatan_mitra || 'Mohon maaf, kualifikasi/kuota magang belum sesuai.',
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal menolak pendaftaran magang',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error pada tolakPendaftarMitraApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 8. Ambil Daftar Logbook Harian/Mingguan Mahasiswa Magang
 * GET /api/v1/mitra/logbook
 */
export const getMitraLogbookListApi = async (token, params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params.nim) searchParams.append('nim', params.nim);
    if (params.minggu) searchParams.append('minggu', params.minggu);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/mitra/logbook${queryString}`, {
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
        message: data?.message || data?.error || 'Gagal mengambil data logbook',
      };
    }

    return {
      success: true,
      data: data.data?.logbook || [],
    };
  } catch (error) {
    console.error('Error pada getMitraLogbookListApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 9. ACC / Verifikasi Logbook Mahasiswa oleh Supervisor Mitra
 * POST /api/v1/mitra/logbook/acc
 */
export const accMitraLogbookApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mitra/logbook/acc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_logbook: payload.id_logbook,
        nim: payload.nim,
        action: payload.action || 'ACC',
        catatan_supervisor: payload.catatan_supervisor || 'Logbook telah diperiksa & disetujui.',
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal memverifikasi logbook',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error pada accMitraLogbookApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 10. Ambil Data Profil Perusahaan & Kuota Magang
 * GET /api/v1/mitra/profile
 */
export const getMitraCompanyProfileApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mitra/profile`, {
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
        message: data?.message || data?.error || 'Gagal mengambil profil perusahaan',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getMitraCompanyProfileApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 11. Update Data Profil Perusahaan & Kuota Magang
 * PUT /api/v1/mitra/profile
 */
export const updateMitraCompanyProfileApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mitra/profile`, {
      method: 'PUT',
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
        message: data?.message || data?.error || 'Gagal mengupdate profil perusahaan',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error pada updateMitraCompanyProfileApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 12. Auto-Generate Sertifikat Kelulusan Magang Industri PDF
 * POST /api/v1/mitra/generate-sertifikat
 */
export const generateMitraSertifikatApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mitra/generate-sertifikat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_surat_akhir: payload.id_surat_akhir,
        nim: payload.nim,
        nama_mahasiswa: payload.nama_mahasiswa,
        posisi: payload.posisi,
        nilai_mitra_angka: payload.nilai_mitra_angka,
        nilai_mitra_huruf: payload.nilai_mitra_huruf,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal menggenerate sertifikat',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error pada generateMitraSertifikatApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};
