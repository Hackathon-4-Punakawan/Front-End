import { API_BASE_URL } from './authService';

/**
 * Helper Service untuk Step 1: Pengajuan Surat & ID Magang FIK
 */

/**
 * 1. Ambil data pre-fill otomatis untuk Form FIK
 * GET /api/v1/pengajuan-fik/helper-info
 */
export const getPengajuanFikHelperInfoApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pengajuan-fik/helper-info`, {
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
        message: data?.message || data?.error || 'Gagal mengambil data pre-fill FIK',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getPengajuanFikHelperInfoApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 2. Submit / Resubmit Form Pendaftaran FIK (Pengajuan ID Magang)
 * POST /api/v1/pengajuan-fik
 */
export const submitPengajuanFikApi = async (token, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pengajuan-fik`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        jenis_pengajuan: formData.jenisPengajuan || 'Pengajuan ID Magang',
        kepada_yth: formData.kepadaYth,
        nama_instansi: formData.namaInstansi,
        alamat_instansi: formData.alamatInstansi,
        posisi: formData.posisi || formData.namaInstansi,
        jenis_program: formData.jenisProgram || 'Magang Mandiri',
        semester: formData.semester,
        tahun_akademik: formData.tahunAkademik,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal mengirim pengajuan FIK',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Pengajuan ID Magang FIK berhasil dikirim.',
    };
  } catch (error) {
    console.error('Error pada submitPengajuanFikApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API. Periksa koneksi internet Anda.',
    };
  }
};

/**
 * 3. Monitoring Status Pengajuan FIK (Auto-ACC 5s)
 * GET /api/v1/pengajuan-fik/my-status
 */
export const getMyPengajuanFikStatusApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pengajuan-fik/my-status`, {
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
        message: data?.message || data?.error || 'Gagal mengambil status pengajuan FIK',
      };
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error('Error pada getMyPengajuanFikStatusApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 4. Unified All-Steps Progress Aggregator
 * GET /api/v1/pengajuan-fik/all-steps
 */
export const getAllStepsApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pengajuan-fik/all-steps`, {
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
        message: data?.message || data?.error || 'Gagal mengambil data all-steps',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getAllStepsApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 5. Full Main Dashboard Data (Hero Card, DPL, Surat Akhir, Progress & Table MK)
 * GET /api/v1/mahasiswa/dashboard
 */
export const getMahasiswaDashboardApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mahasiswa/dashboard`, {
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
        message: data?.message || data?.error || 'Gagal mengambil data dashboard mahasiswa',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getMahasiswaDashboardApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 6. Riwayat Magang & Berkas Dokumen ACC per Semester
 * GET /api/v1/mahasiswa/riwayat-semester
 */
export const getMahasiswaRiwayatSemesterApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mahasiswa/riwayat-semester`, {
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
        message: data?.message || data?.error || 'Gagal mengambil data riwayat magang per semester',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getMahasiswaRiwayatSemesterApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};
