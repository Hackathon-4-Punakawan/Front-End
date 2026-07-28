import { API_BASE_URL } from './authService';

/**
 * Service untuk Pengajuan Surat Akhir Magang & Evaluasi Kinerja Mitra
 */

/**
 * 1. Ambil Data Pre-fill Otomatis Form Surat Akhir (Mahasiswa)
 * GET /api/v1/surat-akhir-magang/helper-info
 */
export const getSuratAkhirHelperInfoApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/surat-akhir-magang/helper-info`, {
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
        message: data?.message || data?.error || 'Gagal mengambil data helper surat akhir',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getSuratAkhirHelperInfoApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 2. Submit / Kirim Pengajuan Surat Akhir & Ucapan Terima Kasih FIK (Mahasiswa)
 * POST /api/v1/surat-akhir-magang
 */
export const submitSuratAkhirApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/surat-akhir-magang`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_magang: payload.id_magang || payload.idMagang || 'FIK6199373',
        tanggal_mulai_magang: payload.tanggal_mulai_magang || payload.tanggalMulai || '01 Agustus 2026',
        tanggal_berakhir_magang: payload.tanggal_berakhir_magang || payload.tanggalBerakhir || '31 Januari 2027',
        periode_magang: payload.periode_magang || payload.periode || '6 Bulan',
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal mengajukan surat akhir magang',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error pada submitSuratAkhirApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 3. Monitoring Status Surat Akhir Saya (Mahasiswa View)
 * GET /api/v1/surat-akhir-magang/my-status
 */
export const getMySuratAkhirStatusApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/surat-akhir-magang/my-status`, {
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
        message: data?.message || data?.error || 'Gagal mengambil status surat akhir',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getMySuratAkhirStatusApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 4. Ambil Daftar Pengajuan Surat Akhir & Ucapan Terima Kasih Masuk (Mitra Dashboard)
 * GET /api/v1/surat-akhir-magang/mitra/list
 */
export const getMitraSuratAkhirListApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/surat-akhir-magang/mitra/list`, {
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
        message: data?.message || data?.error || 'Gagal mengambil daftar pengajuan surat akhir mitra',
      };
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error('Error pada getMitraSuratAkhirListApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 5. Input / Submit Penilaian & Evaluasi Kinerja Mahasiswa (Mitra)
 * POST /api/v1/surat-akhir-magang/penilaian-mitra
 */
export const submitNilaiMitraApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/surat-akhir-magang/penilaian-mitra`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_surat_akhir: payload.id_surat_akhir,
        nim: payload.nim,
        nilai_mitra_angka: payload.nilai_mitra_angka,
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
    console.error('Error pada submitNilaiMitraApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};
