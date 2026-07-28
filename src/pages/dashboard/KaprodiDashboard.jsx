import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, GraduationCap, CheckSquare, Layers, Award, Mail, Send, Check, X, Bell,
  ChevronLeft, ChevronRight, LayoutDashboard, Search, UserCheck, FileCheck, CheckCircle,
  XCircle, ExternalLink, FileText, Lock, AlertCircle, UserPlus, Plus, Building2, BookOpen,
  Users, RefreshCcw, Eye, Edit3, Trash2, Download, Upload
} from 'lucide-react';
import amikomLogo from '../../assets/amikom.png';
import unikaLogo from '../../assets/unika-logo.svg';
import {
  getAdminDashboardStatsApi,
  getAdminMahasiswaListApi,
  getAdminMahasiswaDetailApi,
  getAdminDosenListApi,
  createAdminDplApi,
  getAdminMitraListApi,
  createAdminMitraApi,
  getAdminMataKuliahListApi,
  createAdminMataKuliahApi,
  plottingAdminDplApi,
  exportAdminMataKuliahApi,
  importAdminMataKuliahApi,
  exportAdminMitraApi,
  exportAdminDosenApi,
} from '../../services/adminService';

const UnikaLogo = ({ size = 26 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" style={{ width: size, height: size, objectFit: 'contain' }}>
    <defs>
      <linearGradient id="unikaGradMainKap" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9333ea" />
        <stop offset="50%" stopColor="#7e22ce" />
        <stop offset="100%" stopColor="#581c87" />
      </linearGradient>
      <linearGradient id="unikaGradAccentKap" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="60%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
    </defs>
    <g>
      <polygon points="250,55 425,145 250,235 75,145" fill="url(#unikaGradMainKap)" />
      <polygon points="250,85 390,145 250,205 110,145" fill="url(#unikaGradAccentKap)" opacity="0.35" />
      <path d="M 405,150 C 418,190 415,220 412,235" stroke="url(#unikaGradMainKap)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="412" cy="242" r="9" fill="url(#unikaGradMainKap)" />
      <polygon points="405,250 419,250 422,305 402,305" fill="url(#unikaGradMainKap)" />
      <path d="M 135,210 L 192,238 L 192,315 C 192,385 308,385 308,315 L 308,238 L 365,210 L 365,315 C 365,435 135,435 135,315 Z" fill="url(#unikaGradMainKap)" />
      <path d="M 135,210 C 135,345 235,430 275,415 C 210,415 192,345 192,238 Z" fill="url(#unikaGradAccentKap)" />
    </g>
  </svg>
);

const KaprodiDashboard = () => {
  const { currentUser, logout, getRoleLabel } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeNavTab, setActiveNavTab] = useState('dashboard'); // 'dashboard' | 'verifikasi' | 'penilaian'
  const [selectedDocStudent, setSelectedDocStudent] = useState(null);
  const [docReviewState, setDocReviewState] = useState({}); // { [docIdx]: 'valid' | 'invalid' }
  const [docRejectionReasons, setDocRejectionReasons] = useState({}); // { [docIdx]: string }
  const [activeRejectPopoverIdx, setActiveRejectPopoverIdx] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState({}); // { [docIdx]: true }
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchPopover, setShowSearchPopover] = useState(false);

  // ── Token Auth & API Integration States ──────────────────────────────────
  const token = currentUser?.token || localStorage.getItem('edushift_token');

  const [adminStats, setAdminStats] = useState(null);
  const [dosenListApi, setDosenListApi] = useState([]);
  const [mitraListApi, setMitraListApi] = useState([]);
  const [mataKuliahListApi, setMataKuliahListApi] = useState([]);
  const [mahasiswaListApi, setMahasiswaListApi] = useState([]);
  const [selectedMhsDetail, setSelectedMhsDetail] = useState(null);

  // Loading States
  const [isLoadingAdminStats, setIsLoadingAdminStats] = useState(false);
  const [isLoadingDosenList, setIsLoadingDosenList] = useState(false);
  const [isLoadingMitraList, setIsLoadingMitraList] = useState(false);
  const [isLoadingMatkulList, setIsLoadingMatkulList] = useState(false);
  const [isLoadingMahasiswaList, setIsLoadingMahasiswaList] = useState(false);

  // Modal State: Tambah DPL
  const [showCreateDplModal, setShowCreateDplModal] = useState(false);
  const [dplForm, setDplForm] = useState({ nidn: '', nama: '', email: '', custom_password: '', bidang_keahlian: '' });
  const [isSubmittingDpl, setIsSubmittingDpl] = useState(false);

  // Modal State: Tambah Mitra
  const [showCreateMitraModal, setShowCreateMitraModal] = useState(false);
  const [mitraForm, setMitraForm] = useState({ nama_perusahaan: '', nama_supervisor: '', email: '', bidang_usaha: '', custom_password: '' });
  const [isSubmittingMitra, setIsSubmittingMitra] = useState(false);

  // Modal State: Tambah Mata Kuliah
  const [showCreateMatkulModal, setShowCreateMatkulModal] = useState(false);
  const [matkulForm, setMatkulForm] = useState({ kode_mk: '', nama_mk: '', sks: 4, semester: 6, cpmk: '', kategori: 'Wajib Prodi' });
  const [isSubmittingMatkul, setIsSubmittingMatkul] = useState(false);

  // Pagination & Export/Import States Matkul
  const [matkulPage, setMatkulPage] = useState(1);
  const MATKUL_PER_PAGE = 10;

  const fileInputRef = useRef(null);
  const [isExportingMatkul, setIsExportingMatkul] = useState(false);
  const [isImportingMatkul, setIsImportingMatkul] = useState(false);

  // Export Matkul Handler
  const handleExportMatkul = async () => {
    setIsExportingMatkul(true);
    try {
      const res = await exportAdminMataKuliahApi(token, 'excel');
      if (res.success) showToast('Katalog Mata Kuliah & CPMK berhasil di-export ke Excel (.xlsx)!');
      else showToast('Gagal export data katalog');
    } catch (err) {
      showToast('Terjadi kesalahan saat memproses export');
    } finally {
      setIsExportingMatkul(false);
    }
  };

  // Import Matkul File Change Handler
  const handleFileImportChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImportingMatkul(true);
    try {
      const text = await file.text();
      let parsedItems = [];

      if (file.name.endsWith('.json')) {
        parsedItems = JSON.parse(text);
      } else {
        // Parse CSV text (Kode MK, Nama MK, SKS, Semester, CPMK, Kategori)
        const lines = text.split('\n').filter(l => l.trim());
        const startIdx = lines[0].toLowerCase().includes('kode') ? 1 : 0;
        for (let i = startIdx; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 2) {
            parsedItems.push({
              kode_mk: cols[0],
              nama_mk: cols[1],
              sks: Number(cols[2]) || 4,
              semester: Number(cols[3]) || 6,
              cpmk: cols[4] || `CPMK-${cols[0]}: Pembelajaran ${cols[1]}`,
              kategori: cols[5] || 'Wajib Prodi'
            });
          }
        }
      }

      if (parsedItems.length === 0) {
        showToast('Format file tidak valid atau data kosong. Gunakan JSON / CSV!');
        return;
      }

      const res = await importAdminMataKuliahApi(token, parsedItems);
      if (res.success) {
        showToast(`Berhasil mengimpor ${res.data?.total_imported || parsedItems.length} Mata Kuliah & CPMK ke Katalog!`);
        fetchMatkulList();
      } else {
        showToast(`Gagal import: ${res.message}`);
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan saat membaca file import');
    } finally {
      setIsImportingMatkul(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Pagination & Export States Dosen DPL
  const [dosenPage, setDosenPage] = useState(1);
  const DOSEN_PER_PAGE = 10;
  const [isExportingDosen, setIsExportingDosen] = useState(false);

  const handleExportDosen = async () => {
    setIsExportingDosen(true);
    try {
      const res = await exportAdminDosenApi(token, 'excel');
      if (res.success) showToast('Data Dosen Pembimbing Lapangan berhasil di-export ke Excel (.xlsx)!');
      else showToast('Gagal export data dosen pembimbing');
    } catch (err) {
      showToast('Terjadi kesalahan saat memproses export');
    } finally {
      setIsExportingDosen(false);
    }
  };

  // Pagination & Export States Mitra Industri
  const [mitraPage, setMitraPage] = useState(1);
  const MITRA_PER_PAGE = 10;
  const [isExportingMitra, setIsExportingMitra] = useState(false);

  const handleExportMitra = async () => {
    setIsExportingMitra(true);
    try {
      const res = await exportAdminMitraApi(token, 'excel');
      if (res.success) showToast('Data Mitra Industri MBKM berhasil di-export ke Excel (.xlsx)!');
      else showToast('Gagal export data mitra industri');
    } catch (err) {
      showToast('Terjadi kesalahan saat memproses export');
    } finally {
      setIsExportingMitra(false);
    }
  };

  // Fetch Functions
  const fetchStats = useCallback(async () => {
    if (!token) return;
    setIsLoadingAdminStats(true);
    try {
      const res = await getAdminDashboardStatsApi(token);
      if (res.success && res.data) setAdminStats(res.data);
    } catch (err) { console.error(err); }
    finally { setIsLoadingAdminStats(false); }
  }, [token]);

  const fetchDosenList = useCallback(async () => {
    if (!token) return;
    setIsLoadingDosenList(true);
    try {
      const res = await getAdminDosenListApi(token);
      if (res.success && res.data) setDosenListApi(res.data.dosen || []);
    } catch (err) { console.error(err); }
    finally { setIsLoadingDosenList(false); }
  }, [token]);

  const fetchMitraList = useCallback(async () => {
    if (!token) return;
    setIsLoadingMitraList(true);
    try {
      const res = await getAdminMitraListApi(token);
      if (res.success && res.data) setMitraListApi(res.data.mitra || []);
    } catch (err) { console.error(err); }
    finally { setIsLoadingMitraList(false); }
  }, [token]);

  const fetchMatkulList = useCallback(async () => {
    if (!token) return;
    setIsLoadingMatkulList(true);
    try {
      const res = await getAdminMataKuliahListApi(token);
      if (res.success && res.data) setMataKuliahListApi(res.data.mata_kuliah || []);
    } catch (err) { console.error(err); }
    finally { setIsLoadingMatkulList(false); }
  }, [token]);

  const fetchMahasiswaList = useCallback(async () => {
    if (!token) return;
    setIsLoadingMahasiswaList(true);
    try {
      const res = await getAdminMahasiswaListApi(token, { search: searchQuery });
      if (res.success && res.data) setMahasiswaListApi(res.data.mahasiswa || []);
    } catch (err) { console.error(err); }
    finally { setIsLoadingMahasiswaList(false); }
  }, [token, searchQuery]);

  // Load stats & lists on mount & tab change
  useEffect(() => {
    fetchStats();
    fetchMahasiswaList();
  }, [fetchStats, fetchMahasiswaList]);

  useEffect(() => {
    if (activeNavTab === 'dosen') fetchDosenList();
    if (activeNavTab === 'mitra') fetchMitraList();
    if (activeNavTab === 'matkul') fetchMatkulList();
    if (activeNavTab === 'mahasiswa') fetchMahasiswaList();
  }, [activeNavTab, fetchDosenList, fetchMitraList, fetchMatkulList, fetchMahasiswaList]);

  // Submit Handlers
  const handleCreateDplSubmit = async (e) => {
    e.preventDefault();
    if (!dplForm.nidn || !dplForm.nama || !dplForm.email) {
      showToast('⚠️ Mohon lengkapi NIDN, Nama, dan Email DPL');
      return;
    }
    setIsSubmittingDpl(true);
    try {
      const res = await createAdminDplApi(token, dplForm);
      if (res.success) {
        showToast(`✅ Akun DPL ${dplForm.nama} berhasil dibuat & kredensial password dikirim ke ${dplForm.email}!`);
        setShowCreateDplModal(false);
        setDplForm({ nidn: '', nama: '', email: '', custom_password: '', bidang_keahlian: '' });
        fetchDosenList();
        fetchStats();
      } else {
        showToast(`❌ Gagal: ${res.message}`);
      }
    } catch (err) {
      showToast('❌ Gagal terhubung ke server');
    } finally {
      setIsSubmittingDpl(false);
    }
  };

  const handleCreateMitraSubmit = async (e) => {
    e.preventDefault();
    if (!mitraForm.nama_perusahaan || !mitraForm.nama_supervisor || !mitraForm.email) {
      showToast('⚠️ Mohon lengkapi Perusahaan, Supervisor, dan Email');
      return;
    }
    setIsSubmittingMitra(true);
    try {
      const res = await createAdminMitraApi(token, mitraForm);
      if (res.success) {
        showToast(`🏢 Akun Supervisor ${mitraForm.nama_supervisor} (${mitraForm.nama_perusahaan}) berhasil dibuat & email terkirim!`);
        setShowCreateMitraModal(false);
        setMitraForm({ nama_perusahaan: '', nama_supervisor: '', email: '', bidang_usaha: '', custom_password: '' });
        fetchMitraList();
        fetchStats();
      } else {
        showToast(`❌ Gagal: ${res.message}`);
      }
    } catch (err) {
      showToast('❌ Gagal terhubung ke server');
    } finally {
      setIsSubmittingMitra(false);
    }
  };

  const handleCreateMatkulSubmit = async (e) => {
    e.preventDefault();
    if (!matkulForm.kode_mk || !matkulForm.nama_mk || !matkulForm.cpmk) {
      showToast('⚠️ Mohon lengkapi Kode MK, Nama MK, dan CPMK');
      return;
    }
    setIsSubmittingMatkul(true);
    try {
      const res = await createAdminMataKuliahApi(token, matkulForm);
      if (res.success) {
        showToast(`📚 Mata Kuliah ${matkulForm.nama_mk} (${matkulForm.kode_mk}) berhasil ditambahkan ke katalog!`);
        setShowCreateMatkulModal(false);
        setMatkulForm({ kode_mk: '', nama_mk: '', sks: 4, semester: 6, cpmk: '', kategori: 'Wajib Prodi' });
        fetchMatkulList();
        fetchStats();
      } else {
        showToast(`❌ Gagal: ${res.message}`);
      }
    } catch (err) {
      showToast('❌ Gagal terhubung ke server');
    } finally {
      setIsSubmittingMatkul(false);
    }
  };

  // 8 Dokumen Persyaratan Pengajuan Magang MSIB
  const requiredDocumentList = [
    { title: 'Proposal Magang MSIB', description: 'Proposal rencana program & aktivitas magang' },
    { title: 'Transkrip Nilai / IPK Terbaru', description: 'Capaian SKS & IPK minimal 3.00' },
    { title: 'Surat Rekomendasi Kaprodi / Fakultas', description: 'Surat resmi persetujuan perguruan tinggi' },
    { title: 'Surat Pertanggungjawaban Mutlak (SPTJM)', description: 'Pernyataan keabsahan dokumen ber-materai' },
    { title: 'Curriculum Vitae (CV) ATS Format', description: 'Daftar riwayat hidup & portofolio terkini' },
    { title: 'Sertifikat Prestasi / Pelatihan Khusus', description: 'Pendukung keahlian kompetensi mahasiswa' },
    { title: 'Kartu Tanda Mahasiswa (KTM) / KTP', description: 'Identitas resmi mahasiswa aktif' },
    { title: 'Surat Izin Orang Tua / Wali', description: 'Surat persetujuan orang tua/wali mahasiswa' }
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Daftar Pilihan Dosen Pembimbing yang ditentukan oleh Kaprodi
  const availableLecturers = [
    { id: 'd1', name: 'Ir. Handoko Prasetyo, M.T.', email: 'handoko@amikom.ac.id' },
    { id: 'd2', name: 'Dr. Krisnawati, M.T.', email: 'krisnawati@amikom.ac.id' },
    { id: 'd3', name: 'Prof. Kusrini, M.Kom.', email: 'kusrini@amikom.ac.id' },
    { id: 'd4', name: 'Bagus Setiawan, M.Kom.', email: 'bagus@amikom.ac.id' },
    { id: 'd5', name: 'Anita Wijaya, M.T.', email: 'anita@amikom.ac.id' },
    { id: 'd6', name: 'Dimas Arisandi, M.Kom.', email: 'dimas@amikom.ac.id' },
    { id: 'd7', name: 'Rudi Hartono, M.Kom.', email: 'rudi@amikom.ac.id' },
    { id: 'd8', name: 'Hendra Gunawan, M.Kom.', email: 'hendra@amikom.ac.id' }
  ];

  // Data penugasan Dosen Pembimbing oleh Kaprodi
  const [proposals, setProposals] = useState([
    { id: 1, nim: '22.11.4321', name: 'Budi Santoso', company: 'Google Indonesia', dosenPembimbing: 'Ir. Handoko Prasetyo, M.T.', dosenEmail: 'handoko@amikom.ac.id', subjectsCount: 2, totalSks: 8, status: 'Ditetapkan' },
    { id: 2, nim: '22.11.4302', name: 'Alif Pratama', company: 'Apple Inc.', dosenPembimbing: 'Dr. Krisnawati, M.T.', dosenEmail: 'krisnawati@amikom.ac.id', subjectsCount: 4, totalSks: 16, status: 'Belum Ditetapkan' },
    { id: 3, nim: '22.11.4299', name: 'Sonia Clarissa', company: 'Google Indonesia', dosenPembimbing: 'Prof. Kusrini, M.Kom.', dosenEmail: 'kusrini@amikom.ac.id', subjectsCount: 3, totalSks: 12, status: 'Ditetapkan' },
    { id: 4, nim: '22.11.4288', name: 'Rian Hidayat', company: 'Tokopedia', dosenPembimbing: 'Bagus Setiawan, M.Kom.', dosenEmail: 'bagus@amikom.ac.id', subjectsCount: 3, totalSks: 9, status: 'Belum Ditetapkan' },
    { id: 5, nim: '22.11.4215', name: 'Siti Aminah', company: 'Traveloka', dosenPembimbing: 'Anita Wijaya, M.T.', dosenEmail: 'anita@amikom.ac.id', subjectsCount: 2, totalSks: 6, status: 'Ditetapkan' },
    { id: 6, nim: '22.11.4190', name: 'Fajar Nugraha', company: 'Gojek', dosenPembimbing: 'Dimas Arisandi, M.Kom.', dosenEmail: 'dimas@amikom.ac.id', subjectsCount: 3, totalSks: 8, status: 'Belum Ditetapkan' },
    { id: 7, nim: '22.11.4177', name: 'Nabila Putri', company: 'Shopee Indonesia', dosenPembimbing: 'Dr. Krisnawati, M.T.', dosenEmail: 'krisnawati@amikom.ac.id', subjectsCount: 4, totalSks: 14, status: 'Belum Ditetapkan' },
    { id: 8, nim: '22.11.4150', name: 'Dimas Saputra', company: 'Bukalapak', dosenPembimbing: 'Rudi Hartono, M.Kom.', dosenEmail: 'rudi@amikom.ac.id', subjectsCount: 2, totalSks: 7, status: 'Ditetapkan' },
    { id: 9, nim: '22.11.4132', name: 'Reza Rahadian', company: 'Blibli.com', dosenPembimbing: 'Ir. Handoko Prasetyo, M.T.', dosenEmail: 'handoko@amikom.ac.id', subjectsCount: 3, totalSks: 10, status: 'Belum Ditetapkan' },
    { id: 10, nim: '22.11.4105', name: 'Ayu Lestari', company: 'Bank Mandiri', dosenPembimbing: 'Hendra Gunawan, M.Kom.', dosenEmail: 'hendra@amikom.ac.id', subjectsCount: 2, totalSks: 6, status: 'Ditetapkan' }
  ]);

  const handleDosenChange = (studentId, newDosenName) => {
    const foundLecturer = availableLecturers.find(l => l.name === newDosenName);
    setProposals(prev => prev.map(p => {
      if (p.id === studentId) {
        return {
          ...p,
          dosenPembimbing: newDosenName,
          dosenEmail: foundLecturer ? foundLecturer.email : 'dosen@amikom.ac.id'
        };
      }
      return p;
    }));
  };

  const handleAssignDosen = (id) => {
    const target = proposals.find(p => p.id === id);
    setProposals((prev) =>
      prev.map((prop) => (prop.id === id ? { ...prop, status: 'Ditetapkan' } : prop))
    );
    if (target) {
      showToast(`Dosen Pembimbing ${target.dosenPembimbing} berhasil ditetapkan untuk ${target.name} & email pemberitahuan terkirim!`);
    }
  };

  // Data History & Verifikasi Berkas Pengajuan Magang
  const [proposalsReviewData, setProposalsReviewData] = useState([
    { id: 1, name: 'Budi Santoso', nim: '22.11.4321', company: 'Google Indonesia', files: ['Proposal_Cloud.pdf', 'Transkrip_IPK.pdf', 'Surat_Rekomendasi.pdf'], collected: 3, total: 8, hasilBerkas: 'Belum Lengkap' },
    { id: 2, name: 'Alif Pratama', nim: '22.11.4302', company: 'Apple Inc.', files: ['Proposal_iOS_Apple.pdf', 'Transkrip_IPK.pdf', 'Surat_Rekomendasi.pdf', 'SPTJM.pdf', 'CV_ATS.pdf', 'Sertifikat.pdf', 'KTP.pdf', 'Surat_Izin.pdf'], collected: 8, total: 8, hasilBerkas: 'ACC Berkas' },
    { id: 3, name: 'Sonia Clarissa', nim: '22.11.4299', company: 'Google Indonesia', files: ['Proposal_Data.pdf', 'Transkrip_IPK.pdf', 'Surat_Rekomendasi.pdf', 'SPTJM.pdf', 'CV_ATS.pdf', 'Sertifikat.pdf', 'KTP.pdf', 'Surat_Izin.pdf'], collected: 8, total: 8, hasilBerkas: 'ACC Berkas' },
    { id: 4, name: 'Rian Hidayat', nim: '22.11.4288', company: 'Tokopedia', files: ['Proposal_DataAnalyst.pdf', 'Surat_Rekomendasi.pdf'], collected: 2, total: 8, hasilBerkas: 'Belum Lengkap' },
    { id: 5, name: 'Siti Aminah', nim: '22.11.4215', company: 'Traveloka', files: ['Proposal_QA.pdf', 'Transkrip_IPK.pdf', 'Surat_Rekomendasi.pdf', 'SPTJM.pdf', 'CV_ATS.pdf'], collected: 5, total: 8, hasilBerkas: 'Belum Lengkap' }
  ]);

  // Data Penilaian Proposal & Rilis Nilai Akhir (Website Informatika Flowchart)
  const [finalGradesData, setFinalGradesData] = useState([
    { id: 1, name: 'Budi Santoso', nim: '22.11.4321', company: 'Google Indonesia', proposalFile: 'Proposal_Cloud_Architecture_Budi.pdf', reportFile: 'Laporan_Akhir_Magang_Google_Budi.pdf', proposalScore: 92, partnerScore: 95, finalGrade: 'A (4.00)', status: 'Draft' },
    { id: 2, name: 'Alif Pratama', nim: '22.11.4302', company: 'Apple Inc.', proposalFile: 'Proposal_iOS_Apple_Alif.pdf', reportFile: 'Laporan_Akhir_Magang_Apple_Alif.pdf', proposalScore: 90, partnerScore: 92, finalGrade: 'A (4.00)', status: 'Draft' },
    { id: 3, name: 'Sonia Clarissa', nim: '22.11.4299', company: 'Google Indonesia', proposalFile: 'Proposal_Data_Engineering_Sonia.pdf', reportFile: 'Laporan_Akhir_Magang_Google_Sonia.pdf', proposalScore: 88, partnerScore: 90, finalGrade: 'A- (3.75)', status: 'Sudah Dirilis ke Website' },
    { id: 4, name: 'Rian Hidayat', nim: '22.11.4288', company: 'Tokopedia', proposalFile: 'Proposal_Data_Analyst_Rian.pdf', reportFile: 'Laporan_Akhir_Magang_Tokopedia_Rian.pdf', proposalScore: 85, partnerScore: 88, finalGrade: 'B+ (3.50)', status: 'Draft' },
    { id: 5, name: 'Siti Aminah', nim: '22.11.4215', company: 'Traveloka', proposalFile: 'Proposal_QA_Automation_Siti.pdf', reportFile: 'Laporan_Akhir_Magang_Traveloka_Siti.pdf', proposalScore: 95, partnerScore: 96, finalGrade: 'A (4.00)', status: 'Sudah Dirilis ke Website' }
  ]);

  const handleAccProposal = (id) => {
    const target = proposalsReviewData.find(p => p.id === id);
    setProposalsReviewData(prev => prev.map(p => p.id === id ? { ...p, collected: 8, hasilBerkas: 'ACC Berkas' } : p));
    if (target) {
      showToast(`Dokumen pengajuan magang ${target.name} (${target.company}) diverifikasi lengkap (8/8) & di-ACC!`);
    }
  };

  const handleRejectProposal = (id, reason = 'Berkas belum lengkap / perlu revisi') => {
    const target = proposalsReviewData.find(p => p.id === id);
    setProposalsReviewData(prev => prev.map(p => p.id === id ? { ...p, hasilBerkas: 'Dikembalikan' } : p));
    if (target) {
      showToast(`Berkas pengajuan magang ${target.name} dikembalikan dengan catatan: "${reason}"`);
    }
  };

  const handleReleaseGrade = (id) => {
    const target = finalGradesData.find(g => g.id === id);
    setFinalGradesData(prev => prev.map(g => g.id === id ? { ...g, status: 'Sudah Dirilis ke Website' } : g));
    if (target) {
      showToast(`Prodi berhasil merilis Nilai Akhir Konversi (${target.finalGrade}) untuk ${target.name} melalui Website Informatika!`);
    }
  };

  // Filter search results across all tables (Nama Mahasiswa, NIM, Mitra Industri)
  const filteredProposals = proposals.filter(prop =>
    prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProposalsReviewData = proposalsReviewData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFinalGradesData = finalGradesData.filter(grade =>
    grade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grade.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grade.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="custom-dashboard-container purple-gradient-theme fade-in">
      {/* Toast Feedback */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#581c87',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(88, 28, 135, 0.4)',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <UserCheck size={18} style={{ color: '#c084fc' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Left Sidebar */}
      <aside className={`custom-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <UnikaLogo size={26} />
          </div>
          {!isSidebarCollapsed && (
            <div className="logo-text">
              <h4>UNIKA.IN</h4>
            </div>
          )}
        </div>

        {/* Sidebar Nav Categories */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!isSidebarCollapsed && <span className="section-title">KAPRODI MENU</span>}
            
            <button 
              className={`nav-item ${activeNavTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveNavTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>

            <button 
              className={`nav-item ${activeNavTab === 'mahasiswa' ? 'active' : ''}`}
              onClick={() => setActiveNavTab('mahasiswa')}
            >
              <GraduationCap size={18} />
              {!isSidebarCollapsed && <span>Mahasiswa Konversi</span>}
            </button>

            <button 
              className={`nav-item ${activeNavTab === 'dosen' ? 'active' : ''}`}
              onClick={() => setActiveNavTab('dosen')}
            >
              <UserCheck size={18} />
              {!isSidebarCollapsed && <span>Dosen Pembimbing (DPL)</span>}
            </button>

            <button 
              className={`nav-item ${activeNavTab === 'mitra' ? 'active' : ''}`}
              onClick={() => setActiveNavTab('mitra')}
            >
              <Layers size={18} />
              {!isSidebarCollapsed && <span>Mitra Industri</span>}
            </button>

            <button 
              className={`nav-item ${activeNavTab === 'matkul' ? 'active' : ''}`}
              onClick={() => setActiveNavTab('matkul')}
            >
              <FileText size={18} />
              {!isSidebarCollapsed && <span>Mata Kuliah & CPMK</span>}
            </button>
          </div>
        </nav>
        <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid #f6f1fb' }}>
          <button
            className="nav-item"
            onClick={handleLogout}
            style={{
              width: '100%',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: isSidebarCollapsed ? '0' : '12px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Floating Toggle Sidebar Button */}
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        style={{
          position: 'absolute',
          left: isSidebarCollapsed ? '66px' : '246px',
          top: '22px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '1px solid #e9e2f2',
          boxShadow: '0 2px 8px rgba(180, 50, 242, 0.2)',
          color: '#B432F2',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s, transform 0.2s'
        }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.backgroundColor = '#f8ebff';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* 2. Main Viewport */}
      <div className="main-viewport">
        {/* Top Header */}
        <header className="custom-header">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <img 
              src={amikomLogo} 
              alt="Logo Universitas Amikom Yogyakarta" 
              style={{
                height: '38px',
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              lineHeight: '1.2',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#B432F2',
                margin: 0,
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>UNIVERSITAS AMIKOM</h3>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#94a3b8',
                margin: 0,
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>YOGYAKARTA</span>
            </div>
          </div>

          <div className="header-actions">
            <div className="search-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
              {showSearchPopover ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#faf5ff',
                  border: '1px solid #B432F2',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  boxShadow: '0 4px 14px rgba(180, 50, 242, 0.15)',
                  transition: 'all 0.25s ease'
                }}>
                  <Search size={16} color="#B432F2" />
                  <input
                    type="text"
                    placeholder="Cari Nama, NIM, Mitra..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1e1b4b',
                      width: '220px'
                    }}
                  />
                  <X
                    size={16}
                    color="#94a3b8"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchPopover(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ) : (
                <button 
                  className="icon-btn" 
                  onClick={() => setShowSearchPopover(true)}
                  title="Cari Nama Mahasiswa, NIM, atau Mitra Industri"
                >
                  <Search size={20} />
                </button>
              )}
            </div>
            <div className="notification-wrapper" style={{ position: 'relative' }}>
              <button 
                className="icon-btn" 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                style={{ backgroundColor: showNotifDropdown ? '#f3e8ff' : '' }}
                title="Pemberitahuan Sistem Bimbingan & Berkas Magang"
              >
                <Bell size={20} color={showNotifDropdown ? '#7e22ce' : 'currentColor'} />
                <span className="notification-dot"></span>
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '360px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(88, 28, 135, 0.22)',
                  border: '1px solid #e9d5ff',
                  zIndex: 1000,
                  overflow: 'hidden',
                  textAlign: 'left'
                }}>
                  <div style={{
                    padding: '14px 18px',
                    background: 'linear-gradient(135deg, #3b0764 0%, #581c87 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={16} color="#e9d5ff" />
                      <span style={{ fontSize: '14px', fontWeight: '800' }}>Notifikasi Kaprodi</span>
                    </div>
                    <span style={{ fontSize: '11px', backgroundColor: '#9333ea', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                      5 Baru
                    </span>
                  </div>

                  <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '6px 0' }}>
                    {/* Item 1: Monitoring Logbook */}
                    <div 
                      style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s ease' }} 
                      onClick={() => { setActiveNavTab('dashboard'); setShowNotifDropdown(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf5ff'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px' }}>📊 MONITORING LOGBOOK</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Baru saja</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>Budi Santoso (Google Indonesia)</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Mengirimkan Logbook Bimbingan Minggu ke-5 (28 Jam Aktivitas).</div>
                    </div>

                    {/* Item 2: Berkas Pengajuan Magang (3/8) */}
                    <div 
                      style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s ease' }} 
                      onClick={() => { setActiveNavTab('verifikasi'); setShowNotifDropdown(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>📁 BERKAS MAGANG (3/8)</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>10 mnt lalu</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>Budi Santoso</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Mengunggah Proposal Magang, Transkrip IPK & Surat Rekomendasi.</div>
                    </div>

                    {/* Item 3: Berkas Lengkap 8/8 */}
                    <div 
                      style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s ease' }} 
                      onClick={() => { setActiveNavTab('verifikasi'); setShowNotifDropdown(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#d1fae5', color: '#047857', padding: '2px 6px', borderRadius: '4px' }}>✅ BERKAS LENGKAP (8/8)</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>25 mnt lalu</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>Dewi Lestari (PT Telkom)</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Melengkapi seluruh 8/8 Dokumen Persyaratan Pengajuan Magang.</div>
                    </div>

                    {/* Item 4: Penetapan Dosen */}
                    <div 
                      style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s ease' }} 
                      onClick={() => { setActiveNavTab('dashboard'); setShowNotifDropdown(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px' }}>🎓 PENETAPAN DOSEN</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>1 jam lalu</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>Kaprodi Informatika</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Ir. Handoko Prasetyo, M.T. ditetapkan sebagai Dosen Pembimbing Budi Santoso.</div>
                    </div>
                  </div>

                  <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                    <button 
                      onClick={() => { setActiveNavTab('dashboard'); setShowNotifDropdown(false); }}
                      style={{ background: 'none', border: 'none', color: '#7e22ce', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Lihat Semua Notifikasi di Dashboard →
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="profile-badge">
              <div className="profile-info">
                <span className="profile-name">{currentUser?.name || 'Prof. Kusrini, M.Kom.'}</span>
                <span className="profile-role">{currentUser?.identity || '0419077902'}</span>
              </div>
              <div className="profile-avatar">
                {currentUser?.name ? currentUser.name.charAt(0) : 'K'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-content" style={{ maxWidth: '100%', margin: '0', padding: '32px' }}>
        
        {/* TAB 1: DASHBOARD */}
        {activeNavTab === 'dashboard' && (
          <>
            {/* Welcome Section */}
            <section className="welcome-section">
              <h2 className="welcome-title">Portal Kaprodi - Penugasan Dosen Pembimbing Mahasiswa</h2>
              <p className="welcome-desc">
                NIDN Kaprodi: <strong>{currentUser?.identity || '0419077902'}</strong> | Kepala Program Studi Informatika. Pilih & tetapkan Dosen Pembimbing untuk setiap mahasiswa peserta MSIB. Sistem akan langsung mengirimkan email notifikasi ke Dosen yang dipilih.
              </p>
            </section>

            {/* Stats Grid */}
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <GraduationCap size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">148 Orang</span>
                  <span className="stat-label">Mahasiswa Magang</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <UserCheck size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">
                    {proposals.filter((p) => p.status === 'Belum Ditetapkan').length} Pending
                  </span>
                  <span className="stat-label">Belum Ada Dosen Pembimbing</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Mail size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">18 Dosen</span>
                  <span className="stat-label">Dosen Pembimbing Siap</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Award size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">98.2%</span>
                  <span className="stat-label">Email Penugasan Terkirim</span>
                </div>
              </div>
            </section>

            {/* Details Grid */}
            <div className="info-grid">
              {/* Main Panel */}
              <section className="main-panel">
                <h3 className="panel-title">
                  <UserCheck size={20} className="text-primary" />
                  Penetapan & Pemberitahuan Dosen Pembimbing oleh Kaprodi
                </h3>
                
                <div style={{ overflowY: 'auto', overflowX: 'auto', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e9d5ff' }}>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>MAHASISWA</th>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>MITRA INDUSTRI</th>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>PILIH DOSEN PEMBIMBING</th>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>STATUS</th>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>AKSI KAPRODI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProposals.map((prop) => (
                        <tr key={prop.id}>
                          <td style={{ padding: '14px 10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', whiteSpace: 'nowrap' }}>{prop.name}</span>
                              <span className="sub-text" style={{ fontSize: '12px', color: '#7e22ce' }}>{prop.nim}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 10px', fontSize: '14px', fontWeight: '600', color: '#1e1b4b', whiteSpace: 'nowrap' }}>{prop.company}</td>
                          <td style={{ padding: '14px 10px' }}>
                            <select
                              value={prop.dosenPembimbing}
                              onChange={(e) => handleDosenChange(prop.id, e.target.value)}
                              disabled={prop.status === 'Ditetapkan'}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: '1px solid #d8b4fe',
                                backgroundColor: prop.status === 'Ditetapkan' ? '#f3e8ff' : '#faf5ff',
                                color: '#1e1b4b',
                                fontWeight: '600',
                                fontSize: '13px',
                                cursor: prop.status === 'Ditetapkan' ? 'not-allowed' : 'pointer',
                                outline: 'none',
                                width: '100%',
                                maxWidth: '210px'
                              }}
                            >
                              {availableLecturers.map(d => (
                                <option key={d.id} value={d.name}>{d.name}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '14px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              whiteSpace: 'nowrap',
                              gap: '4px',
                              padding: '4px 12px',
                              borderRadius: '99px',
                              fontSize: '11px',
                              fontWeight: '700',
                              backgroundColor: prop.status === 'Ditetapkan' ? '#ecfdf5' : '#fffbeb',
                              color: prop.status === 'Ditetapkan' ? '#059669' : '#d97706',
                              border: prop.status === 'Ditetapkan' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                            }}>
                              {prop.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {prop.status === 'Belum Ditetapkan' ? (
                              <button
                                type="button"
                                onClick={() => handleAssignDosen(prop.id)}
                                style={{
                                  background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '7px 14px',
                                  borderRadius: '8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.25)',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <Mail size={14} /> Tetapkan Dosen
                              </button>
                            ) : (
                              <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700', backgroundColor: '#ecfdf5', padding: '6px 12px', borderRadius: '6px', border: '1px solid #a7f3d0', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Check size={14} /> Email Terkirim
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Sidebar Panel Notifikasi Monitoring & Berkas */}
              <aside className="sidebar-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #e9d5ff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={18} color="#7e22ce" />
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#581c87', lineHeight: '1.3' }}>
                      Notifikasi Kaprodi
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', backgroundColor: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff', padding: '4px 10px', borderRadius: '99px', fontWeight: '800', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    5 Baru
                  </span>
                </div>

                {/* Scrollable list so it doesn't extend to the bottom */}
                <div style={{ maxHeight: '310px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                  {/* Item 1: Monitoring Logbook */}
                  <div className="list-item" style={{ borderLeft: '4px solid #9333ea', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px' }}>
                          📊 MONITORING LOGBOOK
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Baru saja</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Budi Santoso (Google Indonesia)
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Mengirimkan Logbook Bimbingan Minggu ke-5 (28 Jam Aktivitas).
                      </span>
                    </div>
                  </div>

                  {/* Item 2: Berkas Pengajuan Magang (3/8) */}
                  <div className="list-item" style={{ borderLeft: '4px solid #0284c7', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>
                          📁 BERKAS MAGANG (3/8)
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>10 mnt lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Budi Santoso
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Mengunggah berkas Proposal Magang, Transkrip IPK & Surat Rekomendasi (3/8 Dokumen).
                      </span>
                    </div>
                  </div>

                  {/* Item 3: Berkas Pengajuan Magang Lengkap 8/8 */}
                  <div className="list-item" style={{ borderLeft: '4px solid #10b981', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '4px' }}>
                          ✅ BERKAS LENGKAP (8/8)
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>25 mnt lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Dewi Lestari (PT Telkom)
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Telah melengkapi seluruh 8/8 Dokumen Persyaratan Pengajuan Magang MSIB (Siap di-ACC).
                      </span>
                    </div>
                  </div>

                  {/* Item 4: Penetapan Dosen */}
                  <div className="list-item" style={{ borderLeft: '4px solid #d97706', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#fffbeb', color: '#b45309', padding: '2px 6px', borderRadius: '4px' }}>
                          🎓 PENETAPAN DOSEN
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>1 jam lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Kaprodi Informatika
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Ir. Handoko Prasetyo, M.T. ditetapkan sebagai Dosen Pembimbing Budi Santoso.
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}

        {/* TAB 2: DOSEN PEMBIMBING LAPANGAN (DPL) */}
        {activeNavTab === 'dosen' && (() => {
          const defaultDosenList = [
            { nidn: '0522108201', nama: 'Andi Sunyoto, M.Kom.', email: 'andi.sunyoto@amikom.ac.id', bidang_keahlian: 'Cloud Infrastructure & Computer Network', total_mahasiswa_bimbingan: 2, kuota_max: 5, selesai_evaluasi: 1, menunggu_review: 1, is_active: true },
            { nidn: '0515088502', nama: 'Bambang Kurniawan, M.Eng', email: 'bambang.k@amikom.ac.id', bidang_keahlian: 'Artificial Intelligence & Data Science', total_mahasiswa_bimbingan: 2, kuota_max: 5, selesai_evaluasi: 2, menunggu_review: 0, is_active: true },
            { nidn: '0518048601', nama: 'Dharmawan, M.T.', email: 'dharmawan@amikom.ac.id', bidang_keahlian: 'Mobile Programming & Cyber Security', total_mahasiswa_bimbingan: 2, kuota_max: 5, selesai_evaluasi: 1, menunggu_review: 1, is_active: true },
            { nidn: '0512038901', nama: 'Dr. Indah Susanti, M.Kom', email: 'indah.susanti@amikom.ac.id', bidang_keahlian: 'Software Engineering & Web Dev', total_mahasiswa_bimbingan: 2, kuota_max: 5, selesai_evaluasi: 2, menunggu_review: 0, is_active: true },
            { nidn: '0509077801', nama: 'Drs. Kusrini, M.Kom.', email: 'kusrini@amikom.ac.id', bidang_keahlian: 'Business Intelligence & Data Mining', total_mahasiswa_bimbingan: 2, kuota_max: 5, selesai_evaluasi: 1, menunggu_review: 1, is_active: true },
            { nidn: '0511048102', nama: 'Ir. Amiruddin, M.T.', email: 'amiruddin@amikom.ac.id', bidang_keahlian: 'Enterprise Architecture & Governance', total_mahasiswa_bimbingan: 3, kuota_max: 6, selesai_evaluasi: 2, menunggu_review: 1, is_active: true },
            { nidn: '0528098301', nama: 'Niken Hendrakusma, M.Kom', email: 'niken.h@amikom.ac.id', bidang_keahlian: 'UI/UX Design & Human Computer Interaction', total_mahasiswa_bimbingan: 2, kuota_max: 5, selesai_evaluasi: 1, menunggu_review: 1, is_active: true },
            { nidn: '0503027902', nama: 'Romi Satria Wahono, Ph.D.', email: 'romi.wahono@amikom.ac.id', bidang_keahlian: 'Machine Learning & Software Metrics', total_mahasiswa_bimbingan: 4, kuota_max: 8, selesai_evaluasi: 3, menunggu_review: 1, is_active: true },
            { nidn: '0514068703', nama: 'Fajar Masya, M.T.', email: 'fajar.masya@amikom.ac.id', bidang_keahlian: 'Internet of Things & Embedded Systems', total_mahasiswa_bimbingan: 2, kuota_max: 5, selesai_evaluasi: 2, menunggu_review: 0, is_active: true },
            { nidn: '0519118401', nama: 'Widodo, M.Kom', email: 'widodo@amikom.ac.id', bidang_keahlian: 'Database Systems & Big Data Architecture', total_mahasiswa_bimbingan: 2, kuota_max: 5, selesai_evaluasi: 1, menunggu_review: 1, is_active: true },
            { nidn: '0525128802', nama: 'Yuli Astuti, M.Kom', email: 'yuli.astuti@amikom.ac.id', bidang_keahlian: 'Game Development & Interactive Media', total_mahasiswa_bimbingan: 1, kuota_max: 5, selesai_evaluasi: 1, menunggu_review: 0, is_active: true }
          ];

          const rawList = dosenListApi.length > 0 ? dosenListApi : defaultDosenList;
          const list = rawList.map((d, idx) => {
            const fb = defaultDosenList[idx % defaultDosenList.length] || {};
            return {
              ...d,
              nama: d.nama || fb.nama || 'Dosen Pembimbing DPL',
              email: d.email || fb.email || `${d.nidn}@amikom.ac.id`,
              bidang_keahlian: d.bidang_keahlian || fb.bidang_keahlian || 'Software Engineering',
              kuota_max: d.kuota_max || fb.kuota_max || 5,
              selesai_evaluasi: d.selesai_evaluasi !== undefined ? d.selesai_evaluasi : fb.selesai_evaluasi,
              menunggu_review: d.menunggu_review !== undefined ? d.menunggu_review : fb.menunggu_review,
              total_mahasiswa_bimbingan: d.total_mahasiswa_bimbingan || fb.total_mahasiswa_bimbingan || 2,
              is_active: d.is_active !== false
            };
          });

          const totalPages = Math.ceil(list.length / DOSEN_PER_PAGE) || 1;
          const startIndex = (dosenPage - 1) * DOSEN_PER_PAGE;
          const paginatedList = list.slice(startIndex, startIndex + DOSEN_PER_PAGE);

          return (
            <>
              <section className="welcome-section" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="welcome-title">Manajemen Dosen Pembimbing Lapangan (DPL)</h2>
                  <p className="welcome-desc">
                    Kelola daftar DPL Informatika, pantau alokasi beban bimbingan, dan tambah akun DPL baru secara otomatis.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleExportDosen}
                    disabled={isExportingDosen}
                    style={{
                      background: 'linear-gradient(135deg, #7e22ce 0%, #581c87 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 18px rgba(126, 34, 206, 0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={16} /> {isExportingDosen ? 'Mengunduh...' : 'Export Excel'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCreateDplModal(true)}
                    style={{
                      background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(147, 51, 234, 0.35)',
                      cursor: 'pointer'
                    }}
                  >
                    <UserPlus size={18} /> Tambah DPL Baru
                  </button>
                </div>
              </section>

              <section className="main-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="panel-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={20} className="text-primary" />
                    Daftar Dosen Pembimbing (DPL) Informatika (Halaman {dosenPage} dari {totalPages})
                  </h3>
                  <button 
                    onClick={fetchDosenList} 
                    style={{ background: '#f3e8ff', border: '1px solid #e9d5ff', color: '#7e22ce', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshCcw size={14} /> Refresh Data
                  </button>
                </div>

                <div style={{ overflowY: 'auto', overflowX: 'auto', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e9d5ff' }}>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>NIDN</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>NAMA DOSEN PEMBIMBING</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>EMAIL RESMI</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>BIDANG KEAHLIAN</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', textAlign: 'center' }}>BEBAN BIMBINGAN</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', textAlign: 'center' }}>STATUS EVALUASI</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', textAlign: 'center' }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedList.map((d, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px', fontSize: '13px', fontWeight: '800', color: '#7e22ce' }}>{d.nidn}</td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={d.foto_profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.nama)}&background=7e22ce&color=fff&bold=true`} alt={d.nama} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #e9d5ff' }} />
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b' }}>{d.nama}</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Dosen Pembimbing Lapangan</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                            <a href={`mailto:${d.email}`} style={{ color: '#7e22ce', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={14} /> {d.email}
                            </a>
                          </td>
                          <td style={{ padding: '14px', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{d.bidang_keahlian}</td>
                          <td style={{ padding: '14px', textAlign: 'center' }}>
                            <span style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', fontSize: '13px' }}>
                              {d.total_mahasiswa_bimbingan} / {d.kuota_max} Mhs
                            </span>
                          </td>
                          <td style={{ padding: '14px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#047857' }}>
                              Selesai: {d.selesai_evaluasi} Mhs
                            </div>
                            <div style={{ fontSize: '11px', color: '#b45309' }}>
                              Pending: {d.menunggu_review} Mhs
                            </div>
                          </td>
                          <td style={{ padding: '14px', textAlign: 'center' }}>
                            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '12px', fontWeight: '700', fontSize: '12px' }}>
                              {d.is_active ? 'Aktif' : 'Non-Aktif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINASI MODERN PER 10 DOSEN */}
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                    Menampilkan <strong>{Math.min(startIndex + 1, list.length)}</strong> - <strong>{Math.min(startIndex + DOSEN_PER_PAGE, list.length)}</strong> dari <strong>{list.length}</strong> Dosen Pembimbing (DPL)
                  </span>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setDosenPage(prev => Math.max(prev - 1, 1))}
                      disabled={dosenPage === 1}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: dosenPage === 1 ? '#f8fafc' : '#ffffff',
                        color: dosenPage === 1 ? '#94a3b8' : '#475569',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: dosenPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ‹ Sebelumnya
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => setDosenPage(pNum)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: dosenPage === pNum ? 'none' : '1px solid #cbd5e1',
                          backgroundColor: dosenPage === pNum ? '#9333ea' : '#ffffff',
                          color: dosenPage === pNum ? '#ffffff' : '#475569',
                          fontWeight: '800',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        {pNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setDosenPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={dosenPage === totalPages}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: dosenPage === totalPages ? '#f8fafc' : '#ffffff',
                        color: dosenPage === totalPages ? '#94a3b8' : '#475569',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: dosenPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Berikutnya ›
                    </button>
                  </div>
                </div>
              </section>
            </>
          );
        })()}

        {/* TAB 3: MITRA INDUSTRI */}
        {activeNavTab === 'mitra' && (() => {
          const defaultMitraList = [
            { id_mitra: 1, nama_perusahaan: 'PT GoTo Gojek Tokopedia Tbk', nama_supervisor: 'Rian Hidayat, S.Kom', email_supervisor: 'rian.hidayat@goto.com', kategori_industri: 'Technology & Unicorn', bidang_usaha: 'E-Commerce & On-Demand', kuota_magang: 15, total_mahasiswa_magang: 3, lokasi: 'Jakarta Selatan (Hybrid)', posisi: 'Fullstack Dev, Data Engineer', status_kerjasama: 'Aktif (MOU Verifikasi)' },
            { id_mitra: 2, nama_perusahaan: 'PT Bukalapak.com Tbk', nama_supervisor: 'Hendra Wijaya, M.TI', email_supervisor: 'hendra.wijaya@bukalapak.com', kategori_industri: 'E-Commerce & Digital Platform', bidang_usaha: 'E-Commerce Marketplace', kuota_magang: 10, total_mahasiswa_magang: 2, lokasi: 'Jakarta Selatan (Remote)', posisi: 'Backend Engineer, QA Specialist', status_kerjasama: 'Aktif (MOU Verifikasi)' },
            { id_mitra: 3, nama_perusahaan: 'PT Bank Central Asia Tbk (BCA)', nama_supervisor: 'Siti Rahmawati, S.E.', email_supervisor: 'siti.rahmawati@bca.co.id', kategori_industri: 'Banking & Fintech', bidang_usaha: 'Digital Banking Services', kuota_magang: 12, total_mahasiswa_magang: 2, lokasi: 'Jakarta Pusat (Onsite)', posisi: 'Cybersecurity Analyst, Data Science', status_kerjasama: 'Aktif (MOU Verifikasi)' },
            { id_mitra: 4, nama_perusahaan: 'PT Telkom Indonesia (Persero) Tbk', nama_supervisor: 'Agus Pratama, S.T.', email_supervisor: 'agus.pratama@telkom.co.id', kategori_industri: 'Telecommunication & Cloud', bidang_usaha: 'Telecommunication & Cloud Ecosystem', kuota_magang: 20, total_mahasiswa_magang: 2, lokasi: 'Bandung / Jakarta (Hybrid)', posisi: 'Cloud Engineer, DevOps, IoT Developer', status_kerjasama: 'Aktif (MOU Verifikasi)' },
            { id_mitra: 5, nama_perusahaan: 'PT Shopee International Indonesia', nama_supervisor: 'Jessica Amanda, B.Sc', email_supervisor: 'jessica.amanda@shopee.co.id', kategori_industri: 'E-Commerce & Logistics', bidang_usaha: 'E-Commerce Marketplace', kuota_magang: 8, total_mahasiswa_magang: 2, lokasi: 'Jakarta Selatan (Hybrid)', posisi: 'Frontend Engineer, UI/UX Designer', status_kerjasama: 'Aktif (MOU Verifikasi)' },
            { id_mitra: 6, nama_perusahaan: 'PT Traveloka Indonesia', nama_supervisor: 'Budi Utomo, M.CS', email_supervisor: 'budi.utomo@traveloka.com', kategori_industri: 'Travel & Lifestyle Tech', bidang_usaha: 'Travel & Hospitality SaaS', kuota_magang: 6, total_mahasiswa_magang: 1, lokasi: 'Tangerang (Hybrid)', posisi: 'Android / iOS Developer', status_kerjasama: 'Aktif (MOU Verifikasi)' },
            { id_mitra: 7, nama_perusahaan: 'PT Bank Rakyat Indonesia (Persero) Tbk', nama_supervisor: 'Dian Permata, M.M.', email_supervisor: 'dian.permata@bri.co.id', kategori_industri: 'Banking & Financial Services', bidang_usaha: 'Digital Microfinance', kuota_magang: 10, total_mahasiswa_magang: 1, lokasi: 'Jakarta Pusat (Onsite)', posisi: 'AI & Machine Learning Specialist', status_kerjasama: 'Aktif (MOU Verifikasi)' },
            { id_mitra: 8, nama_perusahaan: 'PT Blibli.com (Global Digital Niaga)', nama_supervisor: 'Ferry Irawan, S.T.', email_supervisor: 'ferry.irawan@blibli.com', kategori_industri: 'Retail & E-Commerce', bidang_usaha: 'Omnichannel Commerce', kuota_magang: 8, total_mahasiswa_magang: 1, lokasi: 'Jakarta Barat (Hybrid)', posisi: 'Software Architect, System Analyst', status_kerjasama: 'Aktif (MOU Verifikasi)' },
            { id_mitra: 9, nama_perusahaan: 'PT Paragon Technology and Innovation', nama_supervisor: 'Novianti Sari, S.Psi', email_supervisor: 'novianti.sari@paragon.co.id', kategori_industri: 'Manufacturing & Retail Tech', bidang_usaha: 'FMCG & IT Transformation', kuota_magang: 5, total_mahasiswa_magang: 1, lokasi: 'Tangerang (Onsite)', posisi: 'ERP Developer, Business Intelligence', status_kerjasama: 'Aktif (MOU Verifikasi)' },
            { id_mitra: 10, nama_perusahaan: 'PT Indonesia Indikator (Datamining)', nama_supervisor: 'Dr. Eko Prasetyo', email_supervisor: 'eko.prasetyo@indikator.co.id', kategori_industri: 'AI & Media Analytics', bidang_usaha: 'Big Data & NLP Intelligence', kuota_magang: 6, total_mahasiswa_magang: 1, lokasi: 'Jakarta Selatan (Remote)', posisi: 'NLP Engineer, Big Data Analyst', status_kerjasama: 'Aktif (MOU Verifikasi)' },
            { id_mitra: 11, nama_perusahaan: 'PT Xendit Finance Indonesia', nama_supervisor: 'Kevin Sanjaya, S.Kom', email_supervisor: 'kevin.sanjaya@xendit.co', kategori_industri: 'Fintech & Payment Gateway', bidang_usaha: 'Financial Infrastructure API', kuota_magang: 8, total_mahasiswa_magang: 1, lokasi: 'Jakarta Selatan (Remote)', posisi: 'API Integration Developer, Security Engineer', status_kerjasama: 'Aktif (MOU Verifikasi)' }
          ];

          const rawList = mitraListApi.length > 0 ? mitraListApi : defaultMitraList;
          const list = rawList.map((m, idx) => {
            const fb = defaultMitraList[idx % defaultMitraList.length] || {};
            return {
              ...m,
              nama_supervisor: m.nama_supervisor || m.nama_pic || m.supervisor_name || fb.nama_supervisor || 'Rian Hidayat, S.Kom',
              email_supervisor: m.email_supervisor || m.email_pic || m.email || fb.email_supervisor || 'rian.hidayat@goto.com',
              kuota_magang: m.kuota_magang || fb.kuota_magang || 10,
              lokasi: m.lokasi || fb.lokasi || 'Jakarta (Hybrid)',
              posisi: m.posisi || fb.posisi || 'Software Engineer',
              status_kerjasama: m.status_kerjasama || fb.status_kerjasama || 'Aktif (MOU Verifikasi)',
              total_mahasiswa_magang: m.total_mahasiswa_magang || fb.total_mahasiswa_magang || 2
            };
          });

          const totalPages = Math.ceil(list.length / MITRA_PER_PAGE) || 1;
          const startIndex = (mitraPage - 1) * MITRA_PER_PAGE;
          const paginatedList = list.slice(startIndex, startIndex + MITRA_PER_PAGE);

          return (
            <>
              <section className="welcome-section" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="welcome-title">Manajemen Mitra Industri MBKM</h2>
                  <p className="welcome-desc">
                    Kelola profil perusahaan mitra, kuota magang, akun supervisor mitra, dan tambah akun mitra baru.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleExportMitra}
                    disabled={isExportingMitra}
                    style={{
                      background: 'linear-gradient(135deg, #7e22ce 0%, #581c87 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 18px rgba(126, 34, 206, 0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={16} /> {isExportingMitra ? 'Mengunduh...' : 'Export Excel'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCreateMitraModal(true)}
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(2, 132, 199, 0.35)',
                      cursor: 'pointer'
                    }}
                  >
                    <Building2 size={18} /> Tambah Mitra Baru
                  </button>
                </div>
              </section>

              <section className="main-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="panel-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={20} className="text-primary" />
                    Daftar Mitra Industri & Supervisor (Halaman {mitraPage} dari {totalPages})
                  </h3>
                  <button 
                    onClick={fetchMitraList} 
                    style={{ background: '#e0f2fe', border: '1px solid #bae6fd', color: '#0369a1', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshCcw size={14} /> Refresh Data
                  </button>
                </div>

                <div style={{ overflowY: 'auto', overflowX: 'auto', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #bae6fd' }}>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#0369a1', backgroundColor: '#e0f2fe' }}>NAMA PERUSAHAAN</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#0369a1', backgroundColor: '#e0f2fe' }}>SUPERVISOR / PIC</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#0369a1', backgroundColor: '#e0f2fe' }}>EMAIL SUPERVISOR</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#0369a1', backgroundColor: '#e0f2fe' }}>KATEGORI INDUSTRI</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#0369a1', backgroundColor: '#e0f2fe', textAlign: 'center' }}>KUOTA MAGANG</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#0369a1', backgroundColor: '#e0f2fe', textAlign: 'center' }}>TOTAL MHS MAGANG</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#0369a1', backgroundColor: '#e0f2fe', textAlign: 'center' }}>STATUS MOU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedList.map((m, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{m.nama_perusahaan}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Lokasi: {m.lokasi}</div>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0369a1' }}>{m.nama_supervisor}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>Position: {m.posisi.split(',')[0]}</div>
                          </td>
                          <td style={{ padding: '14px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                            <a href={`mailto:${m.email_supervisor}`} style={{ color: '#0284c7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={14} /> {m.email_supervisor}
                            </a>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>{m.kategori_industri || 'Technology'}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{m.bidang_usaha}</div>
                          </td>
                          <td style={{ padding: '14px', textAlign: 'center' }}>
                            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '10px', fontWeight: '800', fontSize: '12px' }}>
                              {m.kuota_magang} Kuota (Terisi {m.total_mahasiswa_magang})
                            </span>
                          </td>
                          <td style={{ padding: '14px', textAlign: 'center' }}>
                            <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '12px', fontWeight: '800', fontSize: '13px' }}>
                              {m.total_mahasiswa_magang} Mahasiswa
                            </span>
                          </td>
                          <td style={{ padding: '14px', textAlign: 'center' }}>
                            <span style={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '8px', fontWeight: '700', fontSize: '11px' }}>
                              {m.status_kerjasama}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINASI MODERN PER 10 MITRA */}
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                    Menampilkan <strong>{Math.min(startIndex + 1, list.length)}</strong> - <strong>{Math.min(startIndex + MITRA_PER_PAGE, list.length)}</strong> dari <strong>{list.length}</strong> Mitra Industri
                  </span>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setMitraPage(prev => Math.max(prev - 1, 1))}
                      disabled={mitraPage === 1}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: mitraPage === 1 ? '#f8fafc' : '#ffffff',
                        color: mitraPage === 1 ? '#94a3b8' : '#475569',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: mitraPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ‹ Sebelumnya
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => setMitraPage(pNum)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: mitraPage === pNum ? 'none' : '1px solid #cbd5e1',
                          backgroundColor: mitraPage === pNum ? '#0284c7' : '#ffffff',
                          color: mitraPage === pNum ? '#ffffff' : '#475569',
                          fontWeight: '800',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        {pNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setMitraPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={mitraPage === totalPages}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: mitraPage === totalPages ? '#f8fafc' : '#ffffff',
                        color: mitraPage === totalPages ? '#94a3b8' : '#475569',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: mitraPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Berikutnya ›
                    </button>
                  </div>
                </div>
              </section>
            </>
          );
        })()}

        {/* TAB 4: MATA KULIAH & CPMK */}
        {activeNavTab === 'matkul' && (() => {
          const defaultMatkulList = [
            { kode_mk: 'IF101', nama_mk: 'Pemrograman Web Lanjut', sks: 4, cpmk: 'CPMK01-Mahasiswa mampu merancang dan mengimplementasikan aplikasi web tingkat lanjut dengan arsitektur modern', kategori: 'Wajib Prodi' },
            { kode_mk: 'IF102', nama_mk: 'Rekayasa Perangkat Lunak', sks: 4, cpmk: 'CPMK02-Mahasiswa mampu menerapkan metode rekayasa perangkat lunak, SDLC, dan pengujian sistem', kategori: 'Wajib Prodi' },
            { kode_mk: 'IF103', nama_mk: 'Manajemen Proyek TI', sks: 3, cpmk: 'CPMK03-Mahasiswa mampu mengelola proyek TI, estimasi resources, risiko, dan manajemen tim Agile', kategori: 'Wajib Prodi' },
            { kode_mk: 'IF104', nama_mk: 'Kecerdasan Buatan', sks: 3, cpmk: 'CPMK04-Mahasiswa mampu menerapkan konsep kecerdasan buatan, machine learning, dan pemrosesan data', kategori: 'Wajib Prodi' },
            { kode_mk: 'IF105', nama_mk: 'Magang Industri / MBKM', sks: 6, cpmk: 'CPMK05-Mahasiswa mampu mengaplikasikan ilmu komputer secara nyata dalam lingkungan kerja industri magang', kategori: 'Wajib Prodi' },
            { kode_mk: 'ST044', nama_mk: 'Metode Numerik', sks: 4, cpmk: 'CPMK06-Mahasiswa mampu memecahkan persamaan matematika komputasional dengan metode numerik', kategori: 'Wajib Prodi' },
            { kode_mk: 'ST050', nama_mk: 'Manajemen Strategik', sks: 2, cpmk: 'CPMK07-Mahasiswa mampu merumuskan strategi bisnis IT dan alokasi sumber daya teknologi informasi', kategori: 'Wajib Prodi' },
            { kode_mk: 'ST055', nama_mk: 'Arsitektur REST API & Cloud Computing', sks: 4, cpmk: 'CPMK08-Mahasiswa mampu merancang arsitektur REST API, microservices, dan deployment cloud server', kategori: 'Wajib Prodi' },
            { kode_mk: 'ST084', nama_mk: 'Pemrograman Web', sks: 4, cpmk: 'CPMK09-Mahasiswa mampu merancang web app responsif berbasis HTML, CSS, JavaScript, dan backend API', kategori: 'Wajib Prodi' },
            { kode_mk: 'ST087', nama_mk: 'Manajemen Sumber Daya IT', sks: 2, cpmk: 'CPMK10-Mahasiswa mampu mengelola aset, SDM IT, dan tata kelola teknologi informasi organisasi', kategori: 'Wajib Prodi' },
            { kode_mk: 'ST091', nama_mk: 'Analisis dan Desain Sistem Informasi', sks: 4, cpmk: 'CPMK11-Mahasiswa mampu merekayasa perangkat lunak, analisis proses bisnis, dan diagram UML', kategori: 'Wajib Prodi' },
            { kode_mk: 'ST108', nama_mk: 'E-Commerce', sks: 2, cpmk: 'CPMK12-Mahasiswa mampu membangun platform e-commerce, sistem pembayaran digital, dan keamanan transaksi', kategori: 'Wajib Prodi' }
          ];

          const list = mataKuliahListApi.length > 0 ? mataKuliahListApi : defaultMatkulList;
          const totalPages = Math.ceil(list.length / MATKUL_PER_PAGE) || 1;
          const startIndex = (matkulPage - 1) * MATKUL_PER_PAGE;
          const paginatedList = list.slice(startIndex, startIndex + MATKUL_PER_PAGE);

          return (
            <>
              {/* Hidden File Input for Excel/JSON Import */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".json,.csv,.xlsx"
                onChange={handleFileImportChange}
                style={{ display: 'none' }}
              />

              <section className="welcome-section" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="welcome-title">Master Data Katalog Mata Kuliah & CPMK</h2>
                  <p className="welcome-desc">
                    Kelola katalog mata kuliah prodi Informatika dan deskripsi CPMK untuk rekomendasi AI konversi SKS.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImportingMatkul}
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 18px rgba(2, 132, 199, 0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={16} /> {isImportingMatkul ? 'Mengimpor...' : 'Import Excel / CSV'}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportMatkul}
                    disabled={isExportingMatkul}
                    style={{
                      background: 'linear-gradient(135deg, #7e22ce 0%, #581c87 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 18px rgba(126, 34, 206, 0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={16} /> {isExportingMatkul ? 'Mengunduh...' : 'Export Excel'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCreateMatkulModal(true)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={18} /> Tambah MK Baru
                  </button>
                </div>
              </section>

              <section className="main-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="panel-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={20} className="text-primary" />
                    Katalog Mata Kuliah & CPMK Informatika (Halaman {matkulPage} dari {totalPages})
                  </h3>
                  <button 
                    onClick={fetchMatkulList} 
                    style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshCcw size={14} /> Refresh Catalog
                  </button>
                </div>

                <div style={{ overflowY: 'auto', overflowX: 'auto', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e9d5ff' }}>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>KODE MK</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>NAMA MATA KULIAH</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', textAlign: 'center' }}>SKS</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>DESKRIPSI CPMK</th>
                        <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>KATEGORI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedList.map((mk, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px', fontSize: '13px', fontWeight: '800', color: '#7e22ce' }}>{mk.kode_mk}</td>
                          <td style={{ padding: '14px', fontSize: '14px', fontWeight: '700', color: '#1e1b4b' }}>{mk.nama_mk}</td>
                          <td style={{ padding: '14px', textAlign: 'center' }}>
                            <span style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', fontSize: '13px' }}>
                              {mk.sks} SKS
                            </span>
                          </td>
                          <td style={{ padding: '14px', fontSize: '12px', color: '#475569', maxWidth: '380px', lineHeight: '1.5' }}>
                            {mk.cpmk || mk.deskripsi_cpmk || mk.deskripsi || (
                              {
                                'IF101': 'CPMK01-Mahasiswa mampu merancang dan mengimplementasikan aplikasi web tingkat lanjut dengan arsitektur modern',
                                'IF102': 'CPMK02-Mahasiswa mampu menerapkan metode rekayasa perangkat lunak, SDLC, dan pengujian sistem',
                                'IF103': 'CPMK03-Mahasiswa mampu mengelola proyek TI, estimasi resources, risiko, dan manajemen tim Agile',
                                'IF104': 'CPMK04-Mahasiswa mampu menerapkan konsep kecerdasan buatan, machine learning, dan pemrosesan data',
                                'IF105': 'CPMK05-Mahasiswa mampu mengaplikasikan ilmu komputer secara nyata dalam lingkungan kerja industri magang',
                                'ST044': 'CPMK06-Mahasiswa mampu memecahkan persamaan matematika komputasional dengan metode numerik',
                                'ST050': 'CPMK07-Mahasiswa mampu merumuskan strategi bisnis IT dan alokasi sumber daya teknologi informasi',
                                'ST055': 'CPMK08-Mahasiswa mampu merancang arsitektur REST API, microservices, dan deployment cloud server',
                                'ST084': 'CPMK09-Mahasiswa mampu merancang web app responsif berbasis HTML, CSS, JavaScript, dan backend API',
                                'ST087': 'CPMK10-Mahasiswa mampu mengelola aset, SDM IT, dan tata kelola teknologi informasi organisasi',
                                'ST091': 'CPMK11-Mahasiswa mampu merekayasa perangkat lunak, analisis proses bisnis, dan diagram UML',
                                'ST108': 'CPMK12-Mahasiswa mampu membangun platform e-commerce, sistem pembayaran digital, dan keamanan transaksi'
                              }[mk.kode_mk] || `CPMK-${mk.kode_mk}: Mahasiswa mampu menguasai kompetensi dasar dan terapan ${mk.nama_mk}`
                            )}
                          </td>
                          <td style={{ padding: '14px', fontSize: '12px', color: '#64748b' }}>{mk.kategori || 'Wajib Prodi'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINASI MODERN PER 10 MATKUL */}
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                    Menampilkan <strong>{Math.min(startIndex + 1, list.length)}</strong> - <strong>{Math.min(startIndex + MATKUL_PER_PAGE, list.length)}</strong> dari <strong>{list.length}</strong> Mata Kuliah
                  </span>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setMatkulPage(prev => Math.max(prev - 1, 1))}
                      disabled={matkulPage === 1}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: matkulPage === 1 ? '#f8fafc' : '#ffffff',
                        color: matkulPage === 1 ? '#94a3b8' : '#475569',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: matkulPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ‹ Sebelumnya
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => setMatkulPage(pNum)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: matkulPage === pNum ? 'none' : '1px solid #cbd5e1',
                          backgroundColor: matkulPage === pNum ? '#9333ea' : '#ffffff',
                          color: matkulPage === pNum ? '#ffffff' : '#475569',
                          fontWeight: '800',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        {pNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setMatkulPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={matkulPage === totalPages}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: matkulPage === totalPages ? '#f8fafc' : '#ffffff',
                        color: matkulPage === totalPages ? '#94a3b8' : '#475569',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: matkulPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Berikutnya ›
                    </button>
                  </div>
                </div>
              </section>
            </>
          );
        })()}

        {/* TAB 5: MAHASISWA KONVERSI */}
        {activeNavTab === 'mahasiswa' && (
          <>
            <section className="welcome-section" style={{ marginBottom: '24px' }}>
              <h2 className="welcome-title">Daftar & Monitoring Mahasiswa Konversi</h2>
              <p className="welcome-desc">
                Pantau daftar seluruh mahasiswa magang, progres 5 step, dan status penetapan DPL pembimbing.
              </p>
            </section>

            <section className="main-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="panel-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={20} className="text-primary" />
                  Daftar Mahasiswa Konversi SKS (S1 Informatika)
                </h3>
                <button 
                  onClick={fetchMahasiswaList} 
                  style={{ background: '#f3e8ff', border: '1px solid #e9d5ff', color: '#7e22ce', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCcw size={14} /> Refresh Data
                </button>
              </div>

              <div style={{ overflowY: 'auto', overflowX: 'auto', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e9d5ff' }}>
                      <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>MAHASISWA</th>
                      <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>INSTANSI MAGANG</th>
                      <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff' }}>DOSEN PEMBIMBING (DPL)</th>
                      <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', textAlign: 'center' }}>USULAN SKS</th>
                      <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', textAlign: 'center' }}>STATUS REVIEW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(mahasiswaListApi.length > 0 ? mahasiswaListApi : [
                      { nim: '21.11.4001', nama: 'Budi Santoso', magang: { nama_instansi: 'PT GoTo Gojek Tokopedia Tbk', posisi: 'Fullstack Developer Intern' }, dpl: { nama_dpl: 'Dr. Indah Susanti, M.Kom' }, konversi_sks: { total_sks: 20, status_review_dpl: 'Disetujui DPL' } },
                      { nim: '21.11.4002', nama: 'Fathur Rahman', magang: { nama_instansi: 'PT Bank Central Asia Tbk', posisi: 'Backend Engineer Intern' }, dpl: { nama_dpl: 'Bambang Kurniawan, M.T.' }, konversi_sks: { total_sks: 20, status_review_dpl: 'Disetujui DPL' } },
                      { nim: '21.11.4003', nama: 'Ramadhan', magang: { nama_instansi: 'PT Bukalapak.com Tbk', posisi: 'Mobile Developer Intern' }, dpl: { nama_dpl: 'Dr. Indah Susanti, M.Kom' }, konversi_sks: { total_sks: 20, status_review_dpl: 'Menunggu Review DPL' } }
                    ]).map((mhs, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b' }}>{mhs.nama}</span>
                            <span style={{ fontSize: '12px', color: '#7e22ce', fontWeight: '600' }}>{mhs.nim}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px', fontSize: '13px', fontWeight: '600', color: '#1e1b4b' }}>
                          {mhs.magang?.nama_instansi || 'PT GoTo Gojek Tokopedia Tbk'}
                        </td>
                        <td style={{ padding: '14px', fontSize: '13px', color: '#475569' }}>
                          {mhs.dpl?.nama_dpl || 'Dr. Indah Susanti, M.Kom'}
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          <span style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', fontSize: '13px' }}>
                            {mhs.konversi_sks?.total_sks || 20} SKS
                          </span>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '11px',
                            backgroundColor: (mhs.konversi_sks?.status_review_dpl || '').includes('Disetujui') ? '#ecfdf5' : '#fffbeb',
                            color: (mhs.konversi_sks?.status_review_dpl || '').includes('Disetujui') ? '#059669' : '#d97706',
                            border: (mhs.konversi_sks?.status_review_dpl || '').includes('Disetujui') ? '1px solid #a7f3d0' : '1px solid #fde68a'
                          }}>
                            {mhs.konversi_sks?.status_review_dpl || 'Menunggu Review DPL'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

    {/* TAB 3: PENILAIAN AKHIR */}
    {activeNavTab === 'penilaian' && (
      <>
        <section className="welcome-section" style={{ marginBottom: '24px' }}>
          <h2 className="welcome-title">Penilaian Proposal & Rilis Nilai Akhir Konversi</h2>
          <p className="welcome-desc">
            Masukkan akumulasi nilai proposal dan nilai kinerja magang mitra, lalu publikasikan Nilai Akhir Konversi SKS ke Website Informatika.
          </p>
        </section>

        <div className="info-grid">
          {/* Section 2: Penilaian Proposal & Rilis Nilai Akhir melalui Website Informatika */}
          <section className="main-panel">
            <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} className="text-primary" />
              Penilaian Proposal & Rilis Nilai Akhir (Website Informatika)
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
              Verifikasi nilai proposal, nilai kinerja magang mitra, dan publikasikan nilai konversi SKS ke Website Informatika.
            </p>

            <div style={{ overflowY: 'auto', overflowX: 'auto', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e9d5ff' }}>
                    <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>MAHASISWA</th>
                    <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>BERKAS PROPOSAL & LAPORAN</th>
                    <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>NILAI PROPOSAL</th>
                    <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>NILAI MITRA & LOGBOOK</th>
                    <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>NILAI AKHIR KONVERSI</th>
                    <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>STATUS RILIS PRODI</th>
                    <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>PUBLIKASI WEBSITE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFinalGradesData.map((grade) => (
                    <tr key={grade.id}>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', whiteSpace: 'nowrap' }}>{grade.name}</span>
                          <span className="sub-text" style={{ fontSize: '12px', color: '#B432F2' }}>{grade.nim} • {grade.company}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <button
                            type="button"
                            title="Cek Proposal Magang"
                            onClick={() => alert(`Membuka File Proposal Magang: ${grade.proposalFile}`)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #e9e2f2',
                              backgroundColor: '#faf5ff',
                              color: '#B432F2',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <FileText size={12} /> Cek Proposal
                          </button>
                          <button
                            type="button"
                            title="Cek Laporan Akhir Magang"
                            onClick={() => alert(`Membuka File Laporan Akhir Magang: ${grade.reportFile}`)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #a7f3d0',
                              backgroundColor: '#ecfdf5',
                              color: '#047857',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <FileCheck size={12} /> Cek Laporan
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <input
                          type="number"
                          value={grade.proposalScore}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFinalGradesData(prev => prev.map(g => g.id === grade.id ? { ...g, proposalScore: val } : g));
                          }}
                          disabled={grade.status === 'Sudah Dirilis ke Website'}
                          style={{
                            width: '56px',
                            padding: '6px 4px',
                            textAlign: 'center',
                            borderRadius: '6px',
                            border: '1px solid #c084fc',
                            fontWeight: '700',
                            color: '#581c87',
                            backgroundColor: grade.status === 'Sudah Dirilis ke Website' ? '#f3e8ff' : '#ffffff'
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <input
                          type="number"
                          value={grade.partnerScore}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFinalGradesData(prev => prev.map(g => g.id === grade.id ? { ...g, partnerScore: val } : g));
                          }}
                          disabled={grade.status === 'Sudah Dirilis ke Website'}
                          style={{
                            width: '56px',
                            padding: '6px 4px',
                            textAlign: 'center',
                            borderRadius: '6px',
                            border: '1px solid #c084fc',
                            fontWeight: '700',
                            color: '#581c87',
                            backgroundColor: grade.status === 'Sudah Dirilis ke Website' ? '#f3e8ff' : '#ffffff'
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#f3e8ff',
                          color: '#7e22ce',
                          fontWeight: '800',
                          fontSize: '12px',
                          border: '1px solid #e9d5ff'
                        }}>
                          {grade.finalGrade}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '99px',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: grade.status === 'Sudah Dirilis ke Website' ? '#ecfdf5' : '#fffbeb',
                          color: grade.status === 'Sudah Dirilis ke Website' ? '#059669' : '#d97706',
                          border: grade.status === 'Sudah Dirilis ke Website' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                        }}>
                          {grade.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {grade.status === 'Draft' ? (
                          <button
                            type="button"
                            onClick={() => handleReleaseGrade(grade.id)}
                            style={{
                              background: 'linear-gradient(135deg, #B432F2 0%, #9f1be0 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '12px',
                              fontWeight: '700',
                              boxShadow: '0 4px 12px rgba(180, 50, 242, 0.25)',
                              cursor: 'pointer'
                            }}
                          >
                            <Send size={13} /> Rilis Nilai Akhir
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700', backgroundColor: '#ecfdf5', padding: '5px 10px', borderRadius: '6px', border: '1px solid #a7f3d0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <ExternalLink size={13} /> Terpublikasi di Website
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sidebar Notifikasi Monitoring & Berkas Pengajuan Magang */}
          <section className="sidebar-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #e9d5ff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="#7e22ce" />
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#581c87', lineHeight: '1.3' }}>
                  Notifikasi Bimbingan & Berkas
                </h3>
              </div>
              <span style={{ fontSize: '11px', backgroundColor: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff', padding: '4px 10px', borderRadius: '99px', fontWeight: '800', whiteSpace: 'nowrap', flexShrink: 0 }}>
                5 Baru
              </span>
            </div>

            <div style={{ maxHeight: '310px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
              <div className="list-item" style={{ borderLeft: '4px solid #9333ea', paddingLeft: '12px' }}>
                <div className="item-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px' }}>
                      📊 MONITORING LOGBOOK
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Baru saja</span>
                  </div>
                  <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                    Budi Santoso (Google Indonesia)
                  </span>
                  <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                    Mengirimkan Logbook Bimbingan Minggu ke-5 (28 Jam Aktivitas).
                  </span>
                </div>
              </div>

              <div className="list-item" style={{ borderLeft: '4px solid #0284c7', paddingLeft: '12px' }}>
                <div className="item-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>
                      📁 BERKAS MAGANG (3/8)
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>10 mnt lalu</span>
                  </div>
                  <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                    Budi Santoso
                  </span>
                  <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                    Mengunggah berkas Proposal Magang, Transkrip IPK & Surat Rekomendasi (3/8 Dokumen).
                  </span>
                </div>
              </div>

              <div className="list-item" style={{ borderLeft: '4px solid #10b981', paddingLeft: '12px' }}>
                <div className="item-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '4px' }}>
                      ✅ BERKAS LENGKAP (8/8)
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>25 mnt lalu</span>
                  </div>
                  <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                    Dewi Lestari (PT Telkom)
                  </span>
                  <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                    Telah melengkapi seluruh 8/8 Dokumen Persyaratan Pengajuan Magang MSIB (Siap di-ACC).
                  </span>
                </div>
              </div>

              <div className="list-item" style={{ borderLeft: '4px solid #d97706', paddingLeft: '12px' }}>
                <div className="item-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#fffbeb', color: '#b45309', padding: '2px 6px', borderRadius: '4px' }}>
                      🎓 USULAN SKS
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>1 jam lalu</span>
                  </div>
                  <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                    Dewi Lestari
                  </span>
                  <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                    Mengajukan usulan konversi 4 Mata Kuliah SKS (16 SKS Total).
                  </span>
                </div>
              </div>

              <div className="list-item" style={{ borderLeft: '4px solid #7e22ce', paddingLeft: '12px' }}>
                <div className="item-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px' }}>
                      📁 PEMBARUAN BERKAS (5/8)
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>2 jam lalu</span>
                  </div>
                  <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                    Siti Aminah (Traveloka)
                  </span>
                  <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                    Memperbarui berkas SPTJM & CV ATS Format (5/8 Dokumen Terkumpul).
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    )}
    </main>
    </div>

      {/* Pop-up Modal Checklist Berkas Pengajuan Magang */}
      {selectedDocStudent && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedDocStudent(null);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(88, 28, 135, 0.25)',
            border: '1px solid #e9d5ff',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              background: 'linear-gradient(135deg, #3b0764 0%, #581c87 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Checklist Berkas Pengajuan Magang</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#e9d5ff' }}>
                  {selectedDocStudent.name} ({selectedDocStudent.nim}) • {selectedDocStudent.company}
                </p>
              </div>
              <button 
                onClick={() => setSelectedDocStudent(null)}
                style={{ background: 'transparent', border: 'none', color: '#e9d5ff', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: List of 8 required documents */}
            <div style={{ padding: '24px', maxHeight: '460px', overflowY: 'auto' }}>
              {(() => {
                const validCount = Object.values(docReviewState).filter(v => v === 'valid').length;
                return (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    padding: '12px 16px',
                    backgroundColor: '#f3e8ff',
                    borderRadius: '10px',
                    border: '1px solid #e9d5ff'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#581c87' }}>Progres Verifikasi Dokumen</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#7e22ce', backgroundColor: '#ffffff', padding: '4px 12px', borderRadius: '6px' }}>
                      {validCount} / {selectedDocStudent.total} Dokumen Di-ACC
                    </span>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {requiredDocumentList.map((doc, idx) => {
                  const isUploaded = idx < (selectedDocStudent.collected || selectedDocStudent.files?.length || 0);
                  const currentReview = docReviewState[idx] || 'pending';
                  const isValidated = currentReview === 'valid';
                  const isRejected = currentReview === 'invalid';
                  const isFileChecked = checkedDocs[idx] || isValidated;

                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: !isUploaded 
                        ? '1px solid #e2e8f0' 
                        : isRejected 
                        ? '1px solid #fecaca' 
                        : isValidated 
                        ? '1px solid #a7f3d0' 
                        : '1px solid #c084fc',
                      backgroundColor: !isUploaded 
                        ? '#f8fafc' 
                        : isRejected 
                        ? '#fef2f2' 
                        : isValidated 
                        ? '#ecfdf5' 
                        : '#faf5ff',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                        {!isUploaded ? (
                          <FileText size={18} color="#94a3b8" />
                        ) : isValidated ? (
                          <CheckCircle size={18} color="#059669" />
                        ) : isRejected ? (
                          <XCircle size={18} color="#dc2626" />
                        ) : (
                          <AlertCircle size={18} color="#9333ea" />
                        )}
                        <div>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '700', 
                            color: !isUploaded ? '#64748b' : isRejected ? '#991b1b' : isValidated ? '#065f46' : '#581c87', 
                            display: 'block' 
                          }}>
                            {idx + 1}. {doc.title}
                          </span>
                          <span style={{ 
                            fontSize: '11px', 
                            color: !isUploaded ? '#94a3b8' : isRejected ? '#b91c1c' : isValidated ? '#047857' : '#7e22ce' 
                          }}>
                            {!isUploaded 
                              ? 'Belum Diunggah Mahasiswa' 
                              : isValidated 
                              ? '✓ Dokumen Valid & Di-ACC' 
                              : isRejected 
                              ? `✕ Dokumen Ditolak • ${docRejectionReasons[idx] ? `Catatan: "${docRejectionReasons[idx]}"` : 'Perlu Revisi'}` 
                              : isFileChecked 
                              ? '🔍 File Sudah Dicek • Siap Di-ACC' 
                              : '🔍 File Sudah Dicek • Siap Di-ACC'}
                          </span>
                        </div>
                      </div>

                      {/* Action Controls */}
                      {!isUploaded ? (
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          Belum Ada File
                        </span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setCheckedDocs(prev => ({ ...prev, [idx]: true }));
                              alert(`Membuka & memeriksa pratinjau dokumen: ${doc.title}`);
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: isFileChecked ? '1px solid #a855f7' : '1px solid #d8b4fe',
                              backgroundColor: isFileChecked ? '#f3e8ff' : '#faf5ff',
                              color: '#7e22ce',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <FileText size={12} /> {isFileChecked ? 'Cek Ulang File' : 'Cek File'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDocReviewState(prev => ({ ...prev, [idx]: 'valid' }));
                              setActiveRejectPopoverIdx(null);
                              showToast(`Dokumen #${idx + 1} (${doc.title}) diverifikasi & di-ACC!`);
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: isValidated ? '1px solid #10b981' : '1px solid #10b981',
                              backgroundColor: isValidated ? '#10b981' : '#ecfdf5',
                              color: isValidated ? '#ffffff' : '#059669',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}
                          >
                            <CheckCircle size={14} /> {isValidated ? 'Di-ACC' : 'ACC Dokumen'}
                          </button>

                          {/* Silang Button with Inline Popover next to it */}
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                              type="button"
                              title="Tolak / Minta Revisi Dokumen Ini"
                              onClick={() => {
                                if (activeRejectPopoverIdx === idx) {
                                  setActiveRejectPopoverIdx(null);
                                } else {
                                  setActiveRejectPopoverIdx(idx);
                                }
                              }}
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                border: isRejected ? '1px solid #ef4444' : '1px solid #e2e8f0',
                                backgroundColor: isRejected ? '#ef4444' : '#ffffff',
                                color: isRejected ? '#ffffff' : '#dc2626',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <XCircle size={15} />
                            </button>

                            {/* Small Popover floating next to silang button */}
                            {activeRejectPopoverIdx === idx && (
                              <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '34px',
                                width: '250px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #fca5a5',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(220, 38, 38, 0.22)',
                                padding: '12px',
                                zIndex: 100,
                                textAlign: 'left'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#991b1b' }}>⚠️ Catatan Revisi Dokumen</span>
                                  <X 
                                    size={14} 
                                    color="#94a3b8" 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={() => setActiveRejectPopoverIdx(null)} 
                                  />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Tulis alasan revisi / penolakan..."
                                  value={docRejectionReasons[idx] || ''}
                                  onChange={(e) => setDocRejectionReasons(prev => ({ ...prev, [idx]: e.target.value }))}
                                  autoFocus
                                  style={{
                                    width: '100%',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #fecaca',
                                    fontSize: '12px',
                                    outline: 'none',
                                    marginBottom: '8px',
                                    backgroundColor: '#fff5f5',
                                    color: '#7f1d1d'
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      setDocReviewState(prev => ({ ...prev, [idx]: 'invalid' }));
                                      setActiveRejectPopoverIdx(null);
                                      showToast(`Dokumen #${idx + 1} ditolak dengan catatan: "${docRejectionReasons[idx] || 'Perlu revisi'}"`);
                                    }
                                  }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => setActiveRejectPopoverIdx(null)}
                                    style={{
                                      padding: '4px 8px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '4px',
                                      backgroundColor: '#ffffff',
                                      color: '#64748b',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Batal
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDocReviewState(prev => ({ ...prev, [idx]: 'invalid' }));
                                      setActiveRejectPopoverIdx(null);
                                      showToast(`Dokumen #${idx + 1} ditolak dengan catatan: "${docRejectionReasons[idx] || 'Perlu revisi'}"`);
                                    }}
                                    style={{
                                      padding: '4px 10px',
                                      fontSize: '11px',
                                      fontWeight: '700',
                                      border: 'none',
                                      borderRadius: '4px',
                                      backgroundColor: '#dc2626',
                                      color: '#ffffff',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Simpan Alasan
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setSelectedDocStudent(null);
                  setActiveRejectPopoverIdx(null);
                  setDocReviewState({});
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Tutup
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {Object.values(docReviewState).includes('invalid') && (
                  <button
                    onClick={() => {
                      const combinedReasons = Object.entries(docRejectionReasons)
                        .filter(([dIdx]) => docReviewState[dIdx] === 'invalid')
                        .map(([dIdx, r]) => `${requiredDocumentList[dIdx]?.title}: ${r || 'Perlu revisi'}`)
                        .join('; ');
                      handleRejectProposal(selectedDocStudent.id, combinedReasons || 'Berkas tidak lengkap / perlu revisi');
                      setSelectedDocStudent(null);
                      setActiveRejectPopoverIdx(null);
                      setDocReviewState({});
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <XCircle size={14} /> Kembalikan Berkas ke Mahasiswa
                  </button>
                )}

                {(() => {
                  const isFullyComplete = selectedDocStudent.collected === selectedDocStudent.total && !Object.values(docReviewState).includes('invalid');
                  return (
                    <button
                      type="button"
                      disabled={!isFullyComplete}
                      onClick={() => {
                        if (!isFullyComplete) return;
                        handleAccProposal(selectedDocStudent.id);
                        setSelectedDocStudent(null);
                        setShowRejectInput(false);
                        setDocReviewState({});
                      }}
                      title={isFullyComplete ? "Setujui & ACC Berkas Pengajuan" : `Berkas belum lengkap (${selectedDocStudent.collected}/8), belum bisa di-ACC`}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isFullyComplete 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                          : '#cbd5e1',
                        color: isFullyComplete ? '#ffffff' : '#64748b',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: isFullyComplete ? 'pointer' : 'not-allowed',
                        boxShadow: isFullyComplete ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle size={14} /> Setujui & ACC Berkas (8/8)
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 1: Tambah DPL Baru */}
      {showCreateDplModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(88, 28, 135, 0.35)',
            border: '1px solid #e9d5ff',
            animation: 'fadeIn 0.25s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e1b4b' }}>Tambah Akun DPL Baru</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Otomatis Mengirim Kredensial via Email</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateDplModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDplSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>NIDN Dosen *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: 0512038901"
                  value={dplForm.nidn}
                  onChange={(e) => setDplForm({ ...dplForm, nidn: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Nama Lengkap Dosen (Gelar) *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Dr. Indah Susanti, M.Kom"
                  value={dplForm.nama}
                  onChange={(e) => setDplForm({ ...dplForm, nama: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Email Resmi Amikom *</label>
                <input 
                  type="email" 
                  placeholder="Contoh: indah.susanti@amikom.ac.id"
                  value={dplForm.email}
                  onChange={(e) => setDplForm({ ...dplForm, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Bidang Keahlian DPL</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Software Engineering & Cloud"
                  value={dplForm.bidang_keahlian}
                  onChange={(e) => setDplForm({ ...dplForm, bidang_keahlian: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Password Sementara (Kosongkan jika auto-generate)</label>
                <input 
                  type="password" 
                  placeholder="Default: Dosen#XXXX"
                  value={dplForm.custom_password}
                  onChange={(e) => setDplForm({ ...dplForm, custom_password: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateDplModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '700', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDpl}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)', color: '#ffffff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)' }}
                >
                  {isSubmittingDpl ? 'Membuat Akun & Mengirim Email...' : 'Buat Akun DPL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tambah Mitra Baru */}
      {showCreateMitraModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(88, 28, 135, 0.35)',
            border: '1px solid #e9d5ff',
            animation: 'fadeIn 0.25s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e1b4b' }}>Tambah Mitra Industri Baru</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Otomatis Mengirim Kredensial via Email</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateMitraModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateMitraSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Nama Perusahaan / Instansi *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: PT GoTo Gojek Tokopedia Tbk"
                  value={mitraForm.nama_perusahaan}
                  onChange={(e) => setMitraForm({ ...mitraForm, nama_perusahaan: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Nama Supervisor / Mentor PIC *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Rian Hidayat, S.T."
                  value={mitraForm.nama_supervisor}
                  onChange={(e) => setMitraForm({ ...mitraForm, nama_supervisor: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Email Supervisor Mitra *</label>
                <input 
                  type="email" 
                  placeholder="Contoh: rian.hidayat@goto.com"
                  value={mitraForm.email}
                  onChange={(e) => setMitraForm({ ...mitraForm, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Bidang Usaha / Kategori Industri</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Technology & Ecommerce"
                  value={mitraForm.bidang_usaha}
                  onChange={(e) => setMitraForm({ ...mitraForm, bidang_usaha: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateMitraModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '700', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMitra}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
                >
                  {isSubmittingMitra ? 'Membuat Akun & Mengirim Email...' : 'Buat Akun Mitra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Tambah Mata Kuliah & CPMK Baru */}
      {showCreateMatkulModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '540px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.35)',
            border: '1px solid #a7f3d0',
            animation: 'fadeIn 0.25s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e1b4b' }}>Tambah Mata Kuliah & CPMK Baru</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Katalog Master Data Prodi S1 Informatika</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateMatkulModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateMatkulSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Kode MK *</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: IF106 / ST120"
                    value={matkulForm.kode_mk}
                    onChange={(e) => setMatkulForm({ ...matkulForm, kode_mk: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div style={{ width: '110px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Jumlah SKS *</label>
                  <select 
                    value={matkulForm.sks}
                    onChange={(e) => setMatkulForm({ ...matkulForm, sks: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  >
                    <option value={2}>2 SKS</option>
                    <option value={3}>3 SKS</option>
                    <option value={4}>4 SKS</option>
                    <option value={6}>6 SKS</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Nama Mata Kuliah *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Cloud Architecture & Microservices"
                  value={matkulForm.nama_mk}
                  onChange={(e) => setMatkulForm({ ...matkulForm, nama_mk: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Deskripsi CPMK (Capaian Pembelajaran MK) *</label>
                <textarea 
                  placeholder="Contoh: CPMK20-Mahasiswa mampu merancang arsitektur cloud server, Docker container, dan microservices skala besar"
                  value={matkulForm.cpmk}
                  onChange={(e) => setMatkulForm({ ...matkulForm, cpmk: e.target.value })}
                  rows={3}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Kategori MK</label>
                  <select 
                    value={matkulForm.kategori}
                    onChange={(e) => setMatkulForm({ ...matkulForm, kategori: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  >
                    <option value="Wajib Prodi">Wajib Prodi</option>
                    <option value="Pilihan">Pilihan</option>
                    <option value="Wajib Fakultas">Wajib Fakultas</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Semester Recomendasi</label>
                  <input 
                    type="number" 
                    value={matkulForm.semester}
                    onChange={(e) => setMatkulForm({ ...matkulForm, semester: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateMatkulModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '700', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMatkul}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}
                >
                  {isSubmittingMatkul ? 'Menambahkan MK...' : 'Simpan Mata Kuliah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaprodiDashboard;

