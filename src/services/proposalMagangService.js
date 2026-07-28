import { API_BASE_URL } from './authService';

/**
 * Helper Service untuk Step 2: Proposal Magang & Review Kaprodi
 */

/**
 * 1. Ambil data pre-fill otomatis untuk Form Proposal Magang
 * GET /api/v1/proposal-magang/helper-info
 */
export const getProposalMagangHelperInfoApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/proposal-magang/helper-info`, {
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
        message: data?.message || data?.error || 'Gagal mengambil data helper proposal',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error pada getProposalMagangHelperInfoApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};

/**
 * 2. Submit / Resubmit Proposal Magang Complete (Mahasiswa Step 2)
 * POST /api/v1/proposal-magang
 */
export const submitProposalMagangApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/proposal-magang`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_pengajuan: payload.idPengajuan || null,
        nama_program_kegiatan: payload.namaProgramKegiatan,
        nama_instansi: payload.namaInstansiMBKM || payload.namaInstansi,
        alamat_instansi: payload.alamatInstansiMBKM || payload.alamatInstansi,
        tanggal_mulai: payload.tanggalMulai,
        tanggal_selesai: payload.tanggalSelesai,
        durasi_pelaksanaan: payload.durasiPelaksanaan,
        nama_pic: payload.namaPIC,
        jabatan_pic: payload.jabatanPIC,
        email_pic: payload.emailPIC,
        no_hp_pic: payload.hpPIC || payload.no_hp_pic,
        program_diikuti: payload.programDiikuti || 'Magang Berdampak',
        no_hp_mahasiswa: payload.hpMahasiswa || payload.no_hp_mahasiswa,
        alasan_mendaftar: payload.alasanMendaftar,
        deskripsi_kegiatan: payload.deskripsiKegiatan || payload.deskripsiRencana,
        keahlian_utama: payload.keahlianUtama,
        file_cv: typeof payload.fileCv === 'string' ? payload.fileCv : (payload.fileCv?.name || 'https://drive.google.com/file/d/cv.pdf'),
        file_krs: typeof payload.fileKRS === 'string' ? payload.fileKRS : (payload.fileKRS?.name || 'https://drive.google.com/file/d/krs.pdf'),
        file_transkrip: typeof payload.fileTranskrip === 'string' ? payload.fileTranskrip : (payload.fileTranskrip?.name || 'https://drive.google.com/file/d/transkrip.pdf'),
        file_proposal_pdf: typeof payload.fileProposalPdf === 'string' ? payload.fileProposalPdf : 'https://drive.google.com/file/d/proposal_magang.pdf',
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || data?.error || 'Gagal mengirim proposal magang',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Proposal magang berhasil dikirim.',
    };
  } catch (error) {
    console.error('Error pada submitProposalMagangApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API. Periksa koneksi internet Anda.',
    };
  }
};

/**
 * 3. Monitoring Proposal Mahasiswa (Status & Review Kaprodi)
 * GET /api/v1/proposal-magang/my-proposal
 */
export const getMyProposalStatusApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/proposal-magang/my-proposal`, {
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
        message: data?.message || data?.error || 'Gagal mengambil status proposal',
      };
    }

    return {
      success: true,
      data: Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []),
    };
  } catch (error) {
    console.error('Error pada getMyProposalStatusApi:', error);
    return {
      success: false,
      message: 'Gagal terhubung ke server API.',
    };
  }
};
