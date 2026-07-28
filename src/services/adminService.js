import { API_BASE_URL } from './authService';

/**
 * 1. Get Executive Analytics Dashboard Stats
 * GET /api/v1/admin/dashboard-stats
 */
export const getAdminDashboardStatsApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal mengambil statistik dashboard' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error getAdminDashboardStatsApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 2. Get Monitoring & Daftar Mahasiswa Konversi
 * GET /api/v1/admin/mahasiswa
 */
export const getAdminMahasiswaListApi = async (token, { search = '', status = '' } = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);

    const url = `${API_BASE_URL}/admin/mahasiswa?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal mengambil daftar mahasiswa' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error getAdminMahasiswaListApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 3. Get Detail Komprehensif Mahasiswa (Monitoring 5 Steps & DPL)
 * GET /api/v1/admin/mahasiswa/:nim
 */
export const getAdminMahasiswaDetailApi = async (token, nim) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/mahasiswa/${nim}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal mengambil detail mahasiswa' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error getAdminMahasiswaDetailApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 4. Get Daftar DPL & Beban Bimbingan
 * GET /api/v1/admin/dosen
 */
export const getAdminDosenListApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dosen`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal mengambil daftar DPL' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error getAdminDosenListApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 5. Create DPL Account & Send Automated Email Credentials
 * POST /api/v1/admin/create-dpl
 * Body: { nidn, nama, email, custom_password?, foto_profile? }
 */
export const createAdminDplApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/create-dpl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal membuat akun DPL' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error createAdminDplApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 6. Get Daftar Mitra Industri
 * GET /api/v1/admin/mitra
 */
export const getAdminMitraListApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/mitra`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal mengambil daftar Mitra' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error getAdminMitraListApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 7. Create Mitra Supervisor Account & Send Automated Email Credentials
 * POST /api/v1/admin/create-mitra
 * Body: { nama_perusahaan, nama_supervisor, email, bidang_usaha?, custom_password? }
 */
export const createAdminMitraApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/create-mitra`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal membuat akun Mitra Industri' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error createAdminMitraApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 8. Master Data Katalog Mata Kuliah & CPMK
 * GET /api/v1/admin/mata-kuliah
 */
export const getAdminMataKuliahListApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/mata-kuliah`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal mengambil katalog mata kuliah' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error getAdminMataKuliahListApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 9. Master Data Tambah Mata Kuliah & CPMK Baru
 * POST /api/v1/admin/mata-kuliah
 */
export const createAdminMataKuliahApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/mata-kuliah`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal menambah mata kuliah baru' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error createAdminMataKuliahApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 10. Penetapan / Plotting DPL untuk Mahasiswa oleh Kaprodi
 * POST /api/v1/admin/plotting-dpl
 * Body: { nim, nidn_dpl, sk_dpl_url? }
 */
export const plottingAdminDplApi = async (token, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/plotting-dpl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal menetapkan DPL' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error plottingAdminDplApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 11. Bulk Import Data Katalog Mata Kuliah & CPMK
 * POST /api/v1/admin/import/mata-kuliah
 */
export const importAdminMataKuliahApi = async (token, items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/import/mata-kuliah`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Gagal mengimpor katalog mata kuliah' };
    return { success: true, data: data.data, message: data.message };
  } catch (error) {
    console.error('Error importAdminMataKuliahApi:', error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

/**
 * 12. Export Data Katalog Mata Kuliah & CPMK
 * GET /api/v1/admin/export/mata-kuliah?format=excel
 */
export const exportAdminMataKuliahApi = async (token, format = 'excel') => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/export/mata-kuliah?format=${format}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Gagal mengunduh file export katalog mata kuliah');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Katalog_Mata_Kuliah_CPMK_Informatika.${format === 'csv' ? 'csv' : 'xlsx'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error('Error exportAdminMataKuliahApi:', error);
    return { success: false, message: error.message };
  }
};

/**
 * 13. Export Data Mitra Industri & Supervisor
 * GET /api/v1/admin/export/mitra?format=excel
 */
export const exportAdminMitraApi = async (token, format = 'excel') => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/export/mitra?format=${format}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Gagal mengunduh file export mitra industri');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Data_Mitra_Industri_MBKM_Informatika.${format === 'csv' ? 'csv' : 'xlsx'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error('Error exportAdminMitraApi:', error);
    return { success: false, message: error.message };
  }
};
