import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import amikomLogo from '../../../assets/amikom.png';
import unikaLogo from '../../../assets/unika-logo.svg';
import PengajuanMagang from './PengajuanMagang';
import RiwayatSemesterTab from './RiwayatSemesterTab';
import { getMyPengajuanFikStatusApi, getAllStepsApi, getMahasiswaDashboardApi } from '../../../services/pengajuanFikService';
import { getMyProposalStatusApi } from '../../../services/proposalMagangService';
import { getMySuratPengantarStatusApi } from '../../../services/suratPengantarService';
import { getMyPengajuanDplStatusApi } from '../../../services/pengajuanDplService';
import { getMyKonversiStatusApi } from '../../../services/konversiMatkulService';
import { submitSuratAkhirApi, getMySuratAkhirStatusApi } from '../../../services/suratAkhirService';
import { getMyLogbookApi, submitLogbookApi } from '../../../services/logbookService';
import {
  LogOut,
  LayoutDashboard,
  FileCheck2,
  History,
  GitCompare,
  BookOpen,
  GraduationCap,
  Building2,
  Clock,
  Search,
  Bell,
  ArrowRight,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FolderOpen,
  Upload,
  Eye,
  FileText,
  ChevronLeft,
  User,
  Save,
  Phone,
  Mail,
  ClipboardList,
  Send,
  RefreshCcw,
  CalendarDays,
  CheckCircle,
  XCircle,
  Hourglass
} from 'lucide-react';

const PREDEFINED_COURSES = [
  { id: 'IF184523', code: 'IF184523', name: 'Pengembangan Aplikasi Web Lanjut', sks: 4, cpmk: 'Mampu merancang dan mengimplementasikan arsitektur web modern yang scalable.' },
  { id: 'IF184524', code: 'IF184524', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, cpmk: 'Mampu merencanakan, mengelola, dan memantau daur hidup pengembangan software.' },
  { id: 'IF184525', code: 'IF184525', name: 'Keamanan Sistem Informasi', sks: 3, cpmk: 'Mampu menganalisis kerentanan keamanan dan menerapkan protokol enkripsi/proteksi.' },
  { id: 'IF184526', code: 'IF184526', name: 'Pembelajaran Mesin (Machine Learning)', sks: 4, cpmk: 'Mampu membangun, melatih, dan mengevaluasi model prediktif cerdas berbasis data.' },
  { id: 'IF184527', code: 'IF184527', name: 'Kecerdasan Buatan (AI)', sks: 3, cpmk: 'Mampu mendesain agen cerdas menggunakan logika heuristik dan jaringan saraf.' },
  { id: 'IF184528', code: 'IF184528', name: 'Desain UI/UX & Interaksi', sks: 3, cpmk: 'Mampu merancang wireframe dan antarmuka interaktif yang memiliki usabilitas tinggi.' },
];

const MahasiswaDashboard = () => {
  const { currentUser, logout, getRoleLabel } = useAuth();
  const navigate = useNavigate();

  // Active Tab state: 'dashboard', 'internship', 'conversion'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // ID Magang states for initial registration and approval
  const [idMagangStatus, setIdMagangStatus] = useState('none'); // 'none' | 'pending' | 'approved'
  const [idMagangValue, setIdMagangValue] = useState('');
  const [idMagangData, setIdMagangData] = useState(null);

  // Elevated state for SKS Conversion
  const [conversionState, setConversionState] = useState({
    status: 'none', // 'none' | 'pending' | 'approved'
    tanggalPengajuan: '',
    courses: []
  });

  // Elevated states for internship wizard progression to prevent reset on tab change
  const [proposals, setProposals] = useState([]);
  const [suratPengantar, setSuratPengantar] = useState(null);
  const [dosenPembimbing, setDosenPembimbing] = useState(null);
  const [currentWizard, setCurrentWizard] = useState(null);

  // State for Surat Akhir submitted in Magang tab
  const [suratAkhirSubmitted, setSuratAkhirSubmitted] = useState(false);
  const [isSubmittingSuratAkhir, setIsSubmittingSuratAkhir] = useState(false);

  // Full Mahasiswa Dashboard Backend API state
  const [dashboardData, setDashboardData] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // ── LOGBOOK STATE ──────────────────────────────────────────────────
  const [logbookList, setLogbookList] = useState([]);
  const [logbookSummary, setLogbookSummary] = useState({ total_logbook: 0, disetujui: 0, pending: 0, revisi: 0 });
  const [isLoadingLogbook, setIsLoadingLogbook] = useState(false);
  const [isSubmittingLogbook, setIsSubmittingLogbook] = useState(false);
  const [showLogbookForm, setShowLogbookForm] = useState(false);
  const [logbookForm, setLogbookForm] = useState({
    minggu_ke: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    ringkasan_kegiatan: '',
    file_lampiran_url: '',
  });
  const [logbookFilter, setLogbookFilter] = useState('semua'); // 'semua' | 'disetujui' | 'pending' | 'revisi'

  const token = currentUser?.token || localStorage.getItem('edushift_token');

  // Sync Step 1 & Step 2 status on mount & page refresh
  useEffect(() => {
    if (!token) {
      setIsInitialLoading(false);
      return;
    }
    let isMounted = true;

    const syncBackendStatus = async () => {
      try {
        // 0. Fetch Full Mahasiswa Dashboard Data API
        const resDash = await getMahasiswaDashboardApi(token);
        if (isMounted && resDash.success && resDash.data) {
          const d = resDash.data;
          setDashboardData(d);

          if (d.has_pengajuan && (d.hero_card || (d.tabel_konversi_mk && d.tabel_konversi_mk.length > 0))) {
            setConversionState(prev => ({
              ...prev,
              status: prev.status !== 'none' ? prev.status : 'DISETUJUI',
              tanggalPengajuan: prev.tanggalPengajuan || '27 Juli 2026',
              courses: prev.courses && prev.courses.length > 0 ? prev.courses : (d.tabel_konversi_mk || []).map(c => ({
                selectedCourseId: c.kode_mk,
                objective: c.objective,
                nilaiAngka: c.nilai_angka,
              }))
            }));

            setIdMagangStatus('approved');
            if (d.hero_card?.nama_instansi) {
              setProposals(prev => prev.length > 0 ? prev : [{
                id: 1,
                jenisPengajuan: 'Pengajuan Proposal Magang',
                namaInstansi: d.hero_card.nama_instansi,
                programDiikuti: d.hero_card.jenis_program || 'Magang Mandiri',
                status: 'DISETUJUI',
              }]);
            }
            if (d.dosen_pembimbing?.nama_dpl && d.dosen_pembimbing?.nama_dpl !== 'Belum Ada DPL') {
              setDosenPembimbing(prev => prev || {
                status: 'DISETUJUI',
                namaDPL: d.dosen_pembimbing.nama_dpl,
                skDplUrl: d.dosen_pembimbing.sk_dpl_url,
              });
            }
          } else if (d.has_pengajuan === false) {
            setIdMagangStatus('none');
            setIdMagangValue('');
            setIdMagangData(null);
            setProposals([]);
            setSuratPengantar(null);
            setDosenPembimbing(null);
            setConversionState({ status: 'none', tanggalPengajuan: '', courses: [] });
          }
        }

        // 0b. Unified All Steps Aggregator
        const resAllSteps = await getAllStepsApi(token);
        if (isMounted && resAllSteps.success && resAllSteps.data && resAllSteps.data.riwayat_pengajuan) {
          const riwayat = resAllSteps.data.riwayat_pengajuan;

          // Step 1 check
          const s1 = riwayat.find(r => r.step === 1);
          if (s1) {
            const officialId = s1.id_magang_fakultas || s1.nomor_layanan_fik;
            const statusStr = (s1.status || '').toUpperCase();

            let sem = s1.semester;
            let thn = s1.tahun_akademik;
            if (!sem && s1.sub_info && s1.sub_info.includes('Semester')) {
              const parts = s1.sub_info.split(' - ');
              sem = parts[0]?.replace('Semester', '').trim();
              thn = parts[1]?.trim();
            }

            setIdMagangData({
              id_pengajuan: s1.id_pengajuan || 1,
              jenisPengajuan: s1.jenis_pengajuan || 'Pengajuan ID Magang',
              namaInstansi: s1.nama_instansi || '-',
              alamatInstansi: s1.alamat_instansi || '-',
              semester: sem || '6',
              tahunAkademik: thn || '2026/2027',
              tanggalPengajuan: s1.tanggal_pengajuan || '-',
              idMagangFakultas: officialId,
              statusSuratFakultas: s1.status,
              suratPengantarUrl: s1.surat_pengantar_url,
            });
            if (statusStr.includes('SETUJU') || statusStr.includes('DISETUJUI') || (officialId && !officialId.includes('PENDING'))) {
              setIdMagangValue(officialId);
              setIdMagangStatus('approved');
            } else {
              setIdMagangStatus('pending');
            }
          }

          // Step 2 check
          const s2 = riwayat.find(r => r.step === 2);
          if (s2) {
            const statusStr = (s2.status || '').toUpperCase();
            const normStatus = (statusStr.includes('SETUJU') || statusStr.includes('DISETUJUI')) ? 'DISETUJUI' : 'PENDING';
            setProposals([{
              id: s2.id,
              jenisPengajuan: s2.jenis_pengajuan || 'Pengajuan Proposal Magang',
              namaInstansi: s2.nama_instansi || '-',
              tanggalPengajuan: s2.tanggal_pengajuan || '-',
              status: normStatus,
              rawStatus: s2.status,
            }]);
          }

          // Step 3 check (Surat Pengantar)
          const s3 = riwayat.find(r => r.step === 3);
          if (s3) {
            const statusStr = (s3.status || '').toUpperCase();
            const normStatus = (statusStr.includes('SETUJU') || statusStr.includes('DISETUJUI')) ? 'DISETUJUI' : 'PENDING';
            setSuratPengantar({
              id: s3.id,
              jenisPengajuan: s3.jenis_pengajuan || 'Pengajuan Surat Pengantar Magang FIK',
              tanggalPengajuan: s3.tanggal_pengajuan || '-',
              status: normStatus,
              suratPengantarUrl: s3.surat_pengantar_url,
            });
          }

          // Step 4 check (Dosen Pembimbing)
          const s4 = riwayat.find(r => r.step === 4);
          if (s4) {
            const statusStr = (s4.status || '').toUpperCase();
            const normStatus = (statusStr.includes('SETUJU') || statusStr.includes('DISETUJUI')) ? 'DISETUJUI' : 'PENDING';
            setDosenPembimbing({
              id: s4.id,
              jenisPengajuan: s4.jenis_pengajuan || 'Pengajuan Dosen Pembimbing',
              tanggalPengajuan: s4.tanggal_pengajuan || '-',
              status: normStatus,
              namaDPL: s4.nama_instansi || 'Drs. Kusrini, M.Kom.',
              skDplUrl: s4.sk_dpl_url,
            });
          }

          // Step 5 check (Konversi SKS)
          const s5 = riwayat.find(r => r.step === 5);
          if (s5) {
            const statusStr = (s5.status || '').toUpperCase();
            const normStatus = (statusStr.includes('SETUJU') || statusStr.includes('DISETUJUI')) ? 'DISETUJUI' : 'PENDING';
            setConversionState({
              status: normStatus,
              tanggalPengajuan: s5.tanggal_pengajuan || '-',
              courses: s5.items || [],
            });
          }
        }

        // 1. Sync Step 1 FIK fallback
        const resFik = await getMyPengajuanFikStatusApi(token);
        if (isMounted && resFik.success && resFik.data && resFik.data.length > 0) {
          const latest = resFik.data[0];
          const officialId = latest.id_magang_fakultas || latest.nomor_layanan_fik;
          const statusStr = (latest.status_surat_fakultas || latest.status_pengajuan || '').toUpperCase();

          const formattedDate = latest.created_at
            ? new Date(latest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

          setIdMagangData({
            id_pengajuan: latest.id_pengajuan,
            jenisPengajuan: latest.jenis_pengajuan || 'Pengajuan ID Magang',
            kepadaYth: latest.tujuan_surat || '-',
            namaInstansi: latest.nama_instansi || '-',
            alamatInstansi: latest.alamat_instansi || '-',
            semester: latest.semester || '6',
            tahunAkademik: latest.tahun_akademik || '2026/2027',
            tanggalPengajuan: formattedDate,
            idMagangFakultas: officialId,
            statusSuratFakultas: latest.status_surat_fakultas,
            suratPengantarUrl: latest.surat_pengantar_url,
          });

          if (statusStr.includes('DISETUJUI') || (officialId && !officialId.includes('PENDING'))) {
            setIdMagangValue(officialId);
            setIdMagangStatus('approved');
          } else {
            setIdMagangStatus('pending');
          }
        }

        // 2. Sync Step 2 Proposal fallback
        const resProposal = await getMyProposalStatusApi(token);
        if (isMounted && resProposal.success && resProposal.data) {
          const mapped = resProposal.data.map((p, idx) => {
            const statusStr = (p.status_review || 'Review Proposal Prodi').toUpperCase();
            let normStatus = 'PENDING';
            if (statusStr.includes('ACC') || statusStr.includes('SETUJU') || statusStr.includes('DISETUJUI')) {
              normStatus = 'DISETUJUI';
            } else if (statusStr.includes('REVISI') || statusStr.includes('TOLAK')) {
              normStatus = 'REVISI';
            }

            const formattedDate = p.created_at
              ? new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

            return {
              id: p.id_proposal || idx + 1,
              jenisPengajuan: 'Pengajuan Proposal Magang',
              namaProgramKegiatan: p.nama_program_kegiatan || '-',
              programDiikuti: p.program_diikuti || 'Magang Berdampak',
              namaInstansi: p.nama_instansi || '-',
              namaPIC: p.nama_pic || '-',
              tanggalMulai: p.tanggal_mulai || '-',
              tanggalSelesai: p.tanggal_selesai || '-',
              tanggalPengajuan: formattedDate,
              status: normStatus,
              rawStatus: p.status_review,
              catatanRevisi: p.catatan_revisi,
            };
          });
          setProposals(mapped);
        }
      } catch (err) {
        console.error("Error pada syncBackendStatus:", err);
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };

    let interval = null;
    syncBackendStatus().then(() => {
      if (isMounted && idMagangStatus === 'pending') {
        interval = setInterval(syncBackendStatus, 5000);
      }
    });

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [token]);

  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = useState({
    show: false,
    title: '',
    message: '',
    type: 'info'
  });

  const triggerAlert = (title, message, type = 'info') => {
    setCustomAlert({
      show: true,
      title,
      message,
      type
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock list of internship applications (for Tab 'internship')
  const [internships, setInternships] = useState([
    { id: 1, company: 'PT. Teknologi Nusantara', location: 'Jakarta Selatan', position: 'Frontend Developer', type: 'Magang Merdeka (MSIB)', date: '12 Okt 2023', status: 'DITERIMA' },
    { id: 2, company: 'DataWorks Analytics', location: 'Bandung', position: 'Data Analyst Intern', type: 'Magang Mandiri', date: '15 Okt 2023', status: 'INTERVIEW' },
    { id: 3, company: 'EcoTech Solutions', location: 'Yogyakarta', position: 'UI/UX Designer', type: 'Magang Merdeka (MSIB)', date: '18 Okt 2023', status: 'TERKIRIM' },
    { id: 4, company: 'Bank Central Indonesia', location: 'Jakarta Pusat', position: 'IT Security Intern', type: 'Magang Mandiri', date: '20 Okt 2023', status: 'DITOLAK' },
  ]);

  const getInternStatusStyle = (status) => {
    switch (status) {
      case 'DITERIMA': return { color: '#B432F2', bg: '#f8ebff', border: '#e9cfbf' };
      case 'INTERVIEW': return { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' };
      case 'TERKIRIM': return { color: '#6b7280', bg: '#f3f4f6', border: '#e5e7eb' };
      case 'DITOLAK': return { color: '#ef4444', bg: '#fef2f2', border: '#fca5a5' };
      default: return { color: '#4b5563', bg: '#f3f4f6', border: '#e5e7eb' };
    }
  };

  // Alert handler for mock action buttons
  const handleAlertAction = (msg) => {
    triggerAlert('Fitur Simulasi', msg, 'info');
  };

  // Dynamic calculations for the Dashboard tab when populated
  const totalSks = conversionState.courses.reduce((acc, row) => {
    const course = PREDEFINED_COURSES.find(c => c.id === row.selectedCourseId);
    return acc + (course ? course.sks : 0);
  }, 0);

  const approvedSks = conversionState.status === 'DISETUJUI' ? totalSks : 0;
  const progressPercent = totalSks > 0 ? Math.round((approvedSks / totalSks) * 100) : 0;

  const calculateGrade = (angka) => {
    const n = parseFloat(angka);
    if (isNaN(n) || angka === '') return '-';
    if (n >= 80) return 'A';
    if (n >= 75) return 'B+';
    if (n >= 70) return 'B';
    if (n >= 65) return 'C+';
    if (n >= 60) return 'C';
    if (n >= 50) return 'D';
    return 'E';
  };

  const handleDashboardGradeChange = (courseIdx, value) => {
    setConversionState(prev => {
      const updatedCourses = [...prev.courses];
      updatedCourses[courseIdx] = {
        ...updatedCourses[courseIdx],
        nilaiAngka: value
      };
      return {
        ...prev,
        courses: updatedCourses
      };
    });
  };

  // ── LOGBOOK HANDLERS ───────────────────────────────────────────────
  const fetchLogbook = async () => {
    if (!token) return;
    setIsLoadingLogbook(true);
    try {
      const res = await getMyLogbookApi(token);
      if (res.success && res.data) {
        setLogbookList(res.data.items || []);
        setLogbookSummary(res.data.ringkasan || { total_logbook: 0, disetujui: 0, pending: 0, revisi: 0 });
      }
    } catch (err) {
      console.error('fetchLogbook error:', err);
    } finally {
      setIsLoadingLogbook(false);
    }
  };

  const handleSubmitLogbook = async (e) => {
    e.preventDefault();
    if (!logbookForm.ringkasan_kegiatan.trim()) {
      triggerAlert('Validasi Form', 'Ringkasan kegiatan wajib diisi!', 'warning');
      return;
    }
    setIsSubmittingLogbook(true);
    try {
      const payload = {
        minggu_ke: logbookForm.minggu_ke || (logbookList.length + 1),
        tanggal_mulai: logbookForm.tanggal_mulai || new Date().toISOString().split('T')[0],
        tanggal_selesai: logbookForm.tanggal_selesai || new Date().toISOString().split('T')[0],
        ringkasan_kegiatan: logbookForm.ringkasan_kegiatan.trim(),
        file_lampiran_url: logbookForm.file_lampiran_url || '',
      };
      const res = await submitLogbookApi(token, payload);
      if (res.success) {
        triggerAlert('Logbook Terkirim! ✅', res.message || 'Logbook berhasil disimpan dan dikirim ke Supervisor Mitra.', 'success');
        setShowLogbookForm(false);
        setLogbookForm({ minggu_ke: '', tanggal_mulai: '', tanggal_selesai: '', ringkasan_kegiatan: '', file_lampiran_url: '' });
        await fetchLogbook(); // refresh list
      } else {
        triggerAlert('Gagal Submit', res.message || 'Terjadi kesalahan saat menyimpan logbook.', 'error');
      }
    } catch (err) {
      triggerAlert('Error', 'Gagal terhubung ke server.', 'error');
    } finally {
      setIsSubmittingLogbook(false);
    }
  };

  return (
    <div className="custom-dashboard-container">
      {/* 1. Left Sidebar */}
      <aside className={`custom-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src={unikaLogo} alt="UNIKA Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
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
            {!isSidebarCollapsed && <span className="section-title">MAHASISWA</span>}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>
            <button
              onClick={() => setActiveTab('internship')}
              className={`nav-item ${activeTab === 'internship' ? 'active' : ''}`}
            >
              <FileCheck2 size={18} />
              {!isSidebarCollapsed && <span>Pengajuan Magang</span>}
            </button>
            <button
              onClick={() => {
                setActiveTab('logbook');
                // fetch logbook on first open
                if (logbookList.length === 0) fetchLogbook();
              }}
              className={`nav-item ${activeTab === 'logbook' ? 'active' : ''}`}
            >
              <ClipboardList size={18} />
              {!isSidebarCollapsed && <span>Logbook Magang</span>}
              {!isSidebarCollapsed && logbookSummary.pending > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#f59e0b',
                  color: '#fff',
                  borderRadius: '9px',
                  padding: '1px 7px',
                  fontSize: '11px',
                  fontWeight: '700',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>{logbookSummary.pending}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            >
              <History size={18} />
              {!isSidebarCollapsed && <span>Riwayat Magang</span>}
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

      {/* 2. Main Content Area */}
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
            <button className="icon-btn" onClick={() => handleAlertAction('Pencarian modul...')}>
              <Search size={20} />
            </button>
            <div className="notification-wrapper" style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
                <Bell size={20} />
                {conversionState.status !== 'none' && <span className="notification-dot"></span>}
              </button>

              {isNotificationOpen && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h3>Notifikasi</h3>
                    <span className="new-badge">1 Baru</span>
                  </div>
                  <div className="dropdown-list">
                    <div className="dropdown-item">
                      <div className="item-icon-wrap blue-bg">
                        <FileText size={16} />
                      </div>
                      <div className="item-details">
                        {conversionState.status === 'DISETUJUI' ? (
                          <p><strong>Konversi Disetujui</strong>: Pengajuan konversi SKS Anda telah disetujui secara resmi oleh Kaprodi.</p>
                        ) : conversionState.status === 'PENDING' ? (
                          <p><strong>Pengajuan Terkirim</strong>: Pendaftaran magang dan matriks konversi Anda berhasil dikirim ke Kaprodi.</p>
                        ) : (
                          <p><strong>Belum Ada Pengajuan</strong>: Silakan selesaikan pengajuan magang Anda untuk memulai proses.</p>
                        )}
                        <span className="item-time">Baru saja</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="header-divider"></div>
            
            <div className="profile-badge">
              <div className="profile-info">
                <span className="profile-name">{currentUser?.name || 'Andi Pratama'}</span>
                <span className="profile-role">Mahasiswa Informatika</span>
              </div>
              <div className="profile-avatar">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="viewport-content">
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="tab-pane fade-in">
              <div className="page-heading">
                <h1 className="main-title">Dashboard Mahasiswa</h1>
              </div>

              {isInitialLoading ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '80px 20px',
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  marginTop: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    border: '3.5px solid #e2e8f0',
                    borderTopColor: '#B432F2',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <span style={{ marginTop: '14px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                    Memuat data dashboard...
                  </span>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (dashboardData && dashboardData.has_pengajuan === false) || (conversionState.status === 'none' && (!dashboardData || dashboardData.has_pengajuan === false)) ? (
                // Clean Welcome & Onboarding Dashboard for New Accounts / Unsubmitted State
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease-in-out' }}>
                  {/* Welcome Banner */}
                  <div style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                    borderRadius: '24px',
                    padding: '32px 36px',
                    color: '#ffffff',
                    boxShadow: '0 12px 32px rgba(124, 58, 237, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ maxWidth: '640px' }}>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        display: 'inline-block',
                        marginBottom: '14px',
                        backdropFilter: 'blur(4px)'
                      }}>
                        ✨ PORTAL KONVERSI SKS OBE MAGANG
                      </span>
                      <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 10px 0', lineHeight: '1.3', fontFamily: "'Outfit', sans-serif" }}>
                        Selamat Datang, {currentUser?.name || dashboardData?.mahasiswa?.nama || 'Mahasiswa Informatika'}! 👋
                      </h2>
                      <p style={{ fontSize: '14.5px', opacity: 0.95, margin: 0, lineHeight: '1.6' }}>
                        Anda belum memiliki pengajuan magang atau konversi SKS S-1 Informatika yang aktif saat ini. Silakan mulai pendaftaran Anda untuk mendapatkan konversi hingga 20 SKS!
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => setActiveTab('internship')}
                        style={{
                          background: '#ffffff',
                          color: '#4f46e5',
                          padding: '14px 28px',
                          borderRadius: '14px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Plus size={18} color="#4f46e5" />
                        <span>Mulai Pengajuan Magang</span>
                        <ArrowRight size={16} color="#4f46e5" />
                      </button>
                    </div>
                  </div>

                  {/* 5-Step Process Guide Card Grid */}
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    padding: '28px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px 0', fontFamily: "'Outfit', sans-serif" }}>
                        🗺️ Alur Pengajuan Magang & Konversi SKS OBE (5 Langkah Mudah)
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                        Tahapan resmi pengajuan magang di lingkungan Fakultas Ilmu Komputer AMIKOM Yogyakarta:
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      {[
                        { step: '1', title: 'Pendaftaran ID Magang', desc: 'Input profil instansi & dapatkan ID Magang FIK resmi.', icon: FileText, color: '#4f46e5', bg: '#f5f3ff' },
                        { step: '2', title: 'Proposal Magang', desc: 'Unggah proposal magang industri untuk peninjauan Prodi.', icon: CheckCircle2, color: '#0284c7', bg: '#f0f9ff' },
                        { step: '3', title: 'Surat Pengantar FIK', desc: 'Unduh Surat Pengantar Fakultas bertanda tangan resmi.', icon: Building2, color: '#059669', bg: '#ecfdf5' },
                        { step: '4', title: 'Plotting DPL', desc: 'Penetapan Dosen Pembimbing Lapangan (DPL).', icon: User, color: '#7c3aed', bg: '#faf5ff' },
                        { step: '5', title: 'Konversi SKS & AI', desc: 'Rekomendasi AI CPMK & ACC Penilaian DPL.', icon: GraduationCap, color: '#d97706', bg: '#fffbeb' },
                      ].map((st, i) => {
                        const IconComp = st.icon;
                        return (
                          <div key={i} style={{ background: st.bg, borderRadius: '16px', padding: '18px', border: `1px solid ${st.color}22` }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: st.color, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                <IconComp size={18} />
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: st.color, background: '#ffffff', padding: '2px 8px', borderRadius: '12px' }}>
                                STEP 0{st.step}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', fontFamily: "'Outfit', sans-serif" }}>{st.title}</h4>
                            <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: '1.4' }}>{st.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                // Full Dynamic Dashboard Contents
                <>
                  {/* Top Row Layout */}
                  <div className="dashboard-top-row">
                    {/* Program Card */}
                    <div className="program-summary-card">
                      <div className="card-header-badge">
                        <span className="running-badge">
                          {dashboardData?.hero_card?.status_badge || (conversionState.status === 'DISETUJUI' ? 'Selesai Validasi' : 'Sedang Berjalan')}
                        </span>
                      </div>
                      <h2 className="program-title">
                        {dashboardData?.hero_card?.jenis_program || proposals[0]?.programDiikuti || 'Magang Mandiri'}
                      </h2>
                      <div className="program-partner">
                        <FolderOpen size={16} />
                        <span>{dashboardData?.hero_card?.nama_instansi || proposals[0]?.namaInstansi || '-'}</span>
                      </div>

                      <div className="progress-container">
                        <div className="progress-labels">
                          <span className="progress-target">
                            {dashboardData?.hero_card?.target_konversi?.label || `Target Konversi ${approvedSks} / ${totalSks} SKS`}
                          </span>
                          <span className="progress-percent">
                            {dashboardData?.hero_card?.target_konversi?.tercapai_label || `${progressPercent}% Tercapai`}
                          </span>
                        </div>
                        <div className="progress-bar-track">
                          <div className="progress-bar-fill" style={{ width: `${dashboardData?.hero_card?.target_konversi?.persentase ?? progressPercent}%` }}></div>
                        </div>
                      </div>

                      {/* Indicator Boxes */}
                      <div className="indicator-grid">
                        <div className="indicator-box color-purple">
                          <span className="ind-val">{dashboardData?.hero_card?.metrics?.mk_diajukan ?? (conversionState.courses.length || 5)}</span>
                          <span className="ind-lbl">MK Diajukan</span>
                        </div>
                        <div className="indicator-box color-blue">
                          <span className="ind-val">
                            {dashboardData?.hero_card?.metrics?.disetujui_kaprodi ?? (conversionState.status === 'DISETUJUI' ? conversionState.courses.length : 0)}
                          </span>
                          <span className="ind-lbl">Disetujui Kaprodi</span>
                        </div>
                        <div className="indicator-box color-blue">
                          <span className="ind-val">
                            {dashboardData?.hero_card?.metrics?.proses_dosen ?? (conversionState.status === 'PENDING' ? conversionState.courses.length : 0)}
                          </span>
                          <span className="ind-lbl">Proses Dosen</span>
                        </div>
                        <div className="indicator-box color-gray">
                          <span className="ind-val">{dashboardData?.hero_card?.metrics?.durasi_magang || suratPengantar?.periodeMagang || '6 Bulan'}</span>
                          <span className="ind-lbl">Durasi Magang</span>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar Dosen Pembimbing Widget */}
                    <div className="dashboard-side-actions">
                      <div className="sidebar-box-card" style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box', padding: '20px' }}>
                        <div className="box-card-title" style={{ marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #f6f1fb' }}>
                          <User size={18} />
                          <span>Dosen Pembimbing</span>
                        </div>
                        {(dashboardData?.dosen_pembimbing) || (dosenPembimbing && dosenPembimbing.status === 'DISETUJUI') ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px', width: '100%' }}>
                            {/* Gradient Avatar */}
                            <div style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #B432F2 0%, #8900ff 100%)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 12px rgba(180, 50, 242, 0.25)',
                              fontSize: '18px',
                              fontWeight: '800',
                              fontFamily: "'Outfit', sans-serif"
                            }}>
                              {dashboardData?.dosen_pembimbing?.inisial || 'SW'}
                            </div>

                            {/* Name & Badge */}
                            <div>
                              <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', fontWeight: '800', color: '#0f172a', fontFamily: "'Outfit', sans-serif", lineHeight: '1.3' }}>
                                {dashboardData?.dosen_pembimbing?.nama_dpl || dosenPembimbing?.namaDPL || 'Prof. Dr. Suwarto, M.Kom.'}
                              </h4>
                              <span style={{ fontSize: '9px', fontWeight: '800', color: '#B432F2', background: '#f8ebff', padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block' }}>
                                {dashboardData?.dosen_pembimbing?.role_tag || dashboardData?.dosen_pembimbing?.role || 'DOSEN INFORMATIKA'}
                              </span>
                            </div>

                            {/* Contacts */}
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f6f1fb', paddingTop: '12px', marginTop: '2px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', justifyContent: 'center' }}>
                                <Mail size={13} style={{ color: '#B432F2', flexShrink: 0 }} />
                                <span style={{ fontWeight: '600' }}>{dashboardData?.dosen_pembimbing?.email || 'suwarto.dosen@amikom.ac.id'}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', justifyContent: 'center' }}>
                                <Phone size={13} style={{ color: '#B432F2', flexShrink: 0 }} />
                                <span style={{ fontWeight: '600' }}>{dashboardData?.dosen_pembimbing?.telepon || dashboardData?.dosen_pembimbing?.phone || '+62 812-3456-7890'}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 10px', color: '#94a3b8', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f8fafc', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #f1f5f9' }}>
                              <User size={22} />
                            </div>
                            <div>
                              <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '800', color: '#64748b' }}>Belum Dialokasikan</h5>
                              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>Selesaikan pengajuan Dosen Pembimbing untuk alokasi.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Row Layout */}
                  <div className="dashboard-mid-row">
                    {/* Final Letter & Thank You Note Submission */}
                    <div className="panel-container width-55">
                      <h3 className="section-subheading">Surat Akhir & Ucapan Terima Kasih</h3>
                      <p className="panel-subtitle-text">Pengajuan administrasi akhir setelah selesai melaksanakan program magang.</p>
                      
                      <div className="internship-status-box" style={{ background: '#fcfbfe', borderColor: '#f3e8ff' }}>
                        <div className="box-header" style={{ marginBottom: '16px', borderBottom: '1.5px solid #f3e8ff', paddingBottom: '12px' }}>
                          <div>
                            <h4 style={{ fontSize: '11.5px', color: '#7c3aed', fontWeight: '800', letterSpacing: '0.3px', textTransform: 'uppercase', lineHeight: '1.4', fontFamily: "'Outfit', sans-serif" }}>
                              PENGAJUAN SURAT AKHIR DAN UCAPAN TERIMA KASIH MAGANG MAHASISWA FAKULTAS ILMU KOMPUTER
                            </h4>
                          </div>
                          <span className="running-badge small" style={suratAkhirSubmitted ? { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' } : { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
                            {suratAkhirSubmitted ? 'PENDING' : 'SIAP AJUKAN'}
                          </span>
                        </div>
                        <div className="box-meta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <span className="meta-label" style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Email</span>
                            <span className="meta-val" style={{ fontSize: '12.5px', color: '#334155', fontWeight: '700', marginTop: '3px', display: 'block' }}>
                              {currentUser?.email || 'budi.mahasiswa@amikom.ac.id'}
                            </span>
                          </div>
                          <div>
                            <span className="meta-label" style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Periode Magang</span>
                            <span className="meta-val" style={{ fontSize: '12.5px', color: '#334155', fontWeight: '700', marginTop: '3px', display: 'block' }}>
                              {suratPengantar?.periodeMagang || '6 Bulan'}
                            </span>
                          </div>
                          <div>
                            <span className="meta-label" style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Tanggal Mulai Magang</span>
                            <span className="meta-val" style={{ fontSize: '12.5px', color: '#334155', fontWeight: '700', marginTop: '3px', display: 'block' }}>
                              {suratPengantar?.tanggalMulai || '2026-07-27'}
                            </span>
                          </div>
                          <div>
                            <span className="meta-label" style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Tanggal Berakhir Magang</span>
                            <span className="meta-val" style={{ fontSize: '12.5px', color: '#334155', fontWeight: '700', marginTop: '3px', display: 'block' }}>
                              {suratPengantar?.tanggalSelesai || '2026-12-27'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {suratAkhirSubmitted || dashboardData?.surat_akhir_terima_kasih?.is_submitted ? (
                        <div style={{ background: '#ecfdf5', border: '1px dashed #a7f3d0', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '12.5px', fontWeight: '700', justifyContent: 'center' }}>
                          <CheckCircle2 size={16} />
                          <span>Surat Akhir & Terima Kasih Telah Diajukan ke Mitra</span>
                        </div>
                      ) : (
                        <button 
                          className="add-dashed-btn" 
                          disabled={isSubmittingSuratAkhir}
                          onClick={async () => {
                            setIsSubmittingSuratAkhir(true);
                            try {
                              const res = await submitSuratAkhirApi(token, {
                                id_magang: idMagangValue || 'FIK6199373',
                                tanggal_mulai_magang: '01 Agustus 2026',
                                tanggal_berakhir_magang: '31 Januari 2027',
                                periode_magang: '6 Bulan',
                              });
                              if (res.success) {
                                setSuratAkhirSubmitted(true);
                                triggerAlert(
                                  'Pengajuan Berhasil Terkirim',
                                  'Surat Akhir & Ucapan Terima Kasih FIK berhasil diajukan! Berkas resmi telah otomatis dikirim ke Dashboard Mitra Industri untuk penilaian akhir.',
                                  'success'
                                );
                                const resDash = await getMahasiswaDashboardApi(token);
                                if (resDash.success && resDash.data) setDashboardData(resDash.data);
                              } else {
                                triggerAlert('Gagal Mengajukan', res.message || 'Terjadi kesalahan.', 'error');
                              }
                            } catch (err) {
                              triggerAlert('Gagal Mengajukan', 'Terjadi kesalahan server.', 'error');
                            } finally {
                              setIsSubmittingSuratAkhir(false);
                            }
                          }}
                        >
                          <Plus size={16} />
                          <span>{isSubmittingSuratAkhir ? 'Mengirim Pengajuan...' : '+ Kirim Pengajuan Surat Akhir & Ucapan Terima Kasih'}</span>
                        </button>
                      )}
                    </div>

                    {/* Conversion Subject Progress timelines */}
                    <div className="panel-container width-45">
                      <h3 className="section-subheading">Progress Konversi per Mata Kuliah</h3>
                      <p className="panel-subtitle-text">Pantau tahapan validasi untuk setiap mata kuliah.</p>

                      <div className="timeline-items">
                        {((dashboardData && dashboardData.tabel_konversi_mk && dashboardData.tabel_konversi_mk.length > 0)
                          ? dashboardData.tabel_konversi_mk.map((c) => ({
                              name: c.nama_mk,
                              sks: c.sks,
                              statusItem: c.status_item || 'Disetujui DPL',
                            }))
                          : conversionState.courses.map((row) => {
                              const course = PREDEFINED_COURSES.find(c => c.id === row.selectedCourseId);
                              return {
                                name: course?.name || row.selectedCourseId,
                                sks: course?.sks || 3,
                                statusItem: conversionState.status === 'DISETUJUI' ? 'Disetujui Kaprodi' : 'Menunggu Validasi',
                              };
                            })
                        ).map((item, idx) => {
                          const isCourseApproved = item.statusItem.includes('Disetujui') || item.statusItem.includes('Kaprodi') || conversionState.status === 'DISETUJUI';
                          const statusLabel = isCourseApproved ? 'Selesai' : 'Menunggu Validasi';
                          const statusColor = isCourseApproved ? 'color-purple' : 'color-gray';

                          return (
                            <div className="timeline-row" key={idx}>
                              <div className="row-info">
                                <span className="subject-name">{item.name} ({item.sks} SKS)</span>
                                <span className={`subject-status ${statusColor}`}>{statusLabel}</span>
                              </div>
                              <div className="timeline-track-bar">
                                <div className="bar-segment active"></div>
                                <div className={`bar-segment ${conversionState.status !== 'none' || dashboardData ? 'active' : ''}`}></div>
                                <div className={`bar-segment ${isCourseApproved ? 'active-purple' : ''}`}></div>
                              </div>
                              <div className="timeline-labels">
                                <span>Diajukan</span>
                                <span style={{ textAlign: 'center' }}>Validasi Dosen</span>
                                <span style={{ textAlign: 'right' }}>SK Kaprodi</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Table Row */}
                  <div className="panel-container" style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 className="section-subheading">Status Konversi Mata Kuliah</h3>
                        <p className="panel-subtitle-text">Detail pemetaan modul Industri ke mata kuliah universitas.</p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button 
                          className="btn-brand-primary" 
                          style={{ padding: '8px 16px', fontSize: '12px', background: '#10b981', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                          onClick={() => triggerAlert('Nilai Berhasil Disimpan', 'Nilai angka dan huruf untuk konversi SKS Anda berhasil diperbarui di Dashboard!', 'success')}
                        >
                          <Save size={14} />
                          <span>Simpan Nilai</span>
                        </button>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="custom-data-table">
                        <thead>
                          <tr>
                            <th>Mata Kuliah Amikom</th>
                            <th style={{ textAlign: 'center' }}>SKS</th>
                            <th>Objective Pekerjaan Magang</th>
                            <th style={{ textAlign: 'center', width: '100px' }}>Nilai Angka</th>
                            <th style={{ textAlign: 'center', width: '90px' }}>Nilai Huruf</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {((dashboardData && dashboardData.tabel_konversi_mk && dashboardData.tabel_konversi_mk.length > 0)
                            ? dashboardData.tabel_konversi_mk.map((item, idx) => ({
                                idx,
                                code: item.kode_mk,
                                name: item.nama_mk,
                                sks: item.sks,
                                objective: item.objective,
                                nilaiAngka: item.nilai_angka,
                                nilaiHuruf: item.nilai_huruf || calculateGrade(item.nilai_angka),
                                statusItem: item.status_item || 'Disetujui DPL',
                              }))
                            : conversionState.courses.map((row, idx) => {
                                const course = PREDEFINED_COURSES.find(c => c.id === row.selectedCourseId);
                                return {
                                  idx,
                                  code: course?.code || row.selectedCourseId,
                                  name: course?.name || row.selectedCourseId,
                                  sks: course?.sks || 3,
                                  objective: row.objective || '-',
                                  nilaiAngka: row.nilaiAngka,
                                  nilaiHuruf: calculateGrade(row.nilaiAngka),
                                  statusItem: conversionState.status === 'DISETUJUI' ? 'Disetujui Kaprodi' : 'Menunggu Validasi',
                                };
                              })
                          ).map((item, idx) => {
                            const isCourseApproved = item.statusItem.includes('Disetujui') || item.statusItem.includes('Kaprodi') || conversionState.status === 'DISETUJUI';
                            
                            return (
                              <tr key={idx}>
                                <td>
                                  <div className="cell-primary">{item.name}</div>
                                  <span className="cell-secondary">{item.code}</span>
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.sks}</td>
                                <td className="cell-primary">{item.objective || '-'}</td>
                                <td style={{ textAlign: 'center' }}>
                                  <input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    value={item.nilaiAngka ?? ''} 
                                    onChange={(e) => handleDashboardGradeChange(idx, e.target.value)} 
                                    placeholder="0-100"
                                    style={{ 
                                      fontWeight: '700', 
                                      fontSize: '13px', 
                                      background: '#fffbeb', 
                                      borderColor: '#fde68a', 
                                      width: '75px', 
                                      padding: '6px 8px',
                                      borderRadius: '8px',
                                      border: '1.5px solid #fde68a',
                                      textAlign: 'center',
                                      outline: 'none'
                                    }}
                                  />
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <span className={`sk-grade-badge grade-${(item.nilaiHuruf || '-').replace(/\+/g, '\\+')}`}>
                                    {item.nilaiHuruf || '-'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`status-capsule ${isCourseApproved ? 'badge-purple' : 'badge-gray'}`}>
                                    {item.statusItem}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: PENGAJUAN MAGANG */}
          {activeTab === 'internship' && (
            <PengajuanMagang 
              currentUser={currentUser}
              internships={internships}
              setInternships={setInternships}
              isAddingNew={isAddingNew}
              setIsAddingNew={setIsAddingNew}
              getInternStatusStyle={getInternStatusStyle}
              handleAlertAction={handleAlertAction}
              triggerAlert={triggerAlert}
              idMagangStatus={idMagangStatus}
              setIdMagangStatus={setIdMagangStatus}
              idMagangValue={idMagangValue}
              setIdMagangValue={setIdMagangValue}
              idMagangData={idMagangData}
              setIdMagangData={setIdMagangData}
              conversionState={conversionState}
              setConversionState={setConversionState}
              proposals={proposals}
              setProposals={setProposals}
              suratPengantar={suratPengantar}
              setSuratPengantar={setSuratPengantar}
              dosenPembimbing={dosenPembimbing}
              setDosenPembimbing={setDosenPembimbing}
              currentWizard={currentWizard}
              setCurrentWizard={setCurrentWizard}
            />
          )}

          {/* TAB 3: LOGBOOK HARIAN / MINGGUAN MAGANG */}
          {activeTab === 'logbook' && (
            <div className="tab-pane fade-in">
              <div className="page-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 className="main-title">Logbook Magang</h1>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Catat aktivitas harian / mingguan magang Anda dan pantau verifikasi Supervisor Mitra.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={fetchLogbook}
                    disabled={isLoadingLogbook}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '10px',
                      background: '#f8f9fa', border: '1px solid #e9e2f2',
                      color: '#64748b', fontWeight: '600', fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCcw size={14} style={isLoadingLogbook ? { animation: 'spin 1s linear infinite' } : {}} />
                    Refresh
                  </button>
                  <button
                    onClick={() => setShowLogbookForm(!showLogbookForm)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 20px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #B432F2, #7c3aed)',
                      color: '#fff', fontWeight: '700', fontSize: '13px',
                      border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(180, 50, 242, 0.3)'
                    }}
                  >
                    <Plus size={16} />
                    {showLogbookForm ? 'Tutup Form' : 'Tambah Logbook'}
                  </button>
                </div>
              </div>

              {/* ── STATS CARDS LOGBOOK ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', margin: '20px 0' }}>
                {[
                  { label: 'Total Logbook', val: logbookSummary.total_logbook, color: '#B432F2', bg: '#f8ebff', icon: <ClipboardList size={20} /> },
                  { label: 'Disetujui', val: logbookSummary.disetujui, color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={20} /> },
                  { label: 'Pending Review', val: logbookSummary.pending, color: '#f59e0b', bg: '#fffbeb', icon: <Hourglass size={20} /> },
                  { label: 'Perlu Revisi', val: logbookSummary.revisi, color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={20} /> },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: '#fff', borderRadius: '16px', padding: '18px 20px',
                    border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    display: 'flex', alignItems: 'center', gap: '14px'
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: item.bg, color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '800', color: item.color, lineHeight: 1 }}>{item.val}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginTop: '2px' }}>{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── FORM SUBMIT LOGBOOK ── */}
              {showLogbookForm && (
                <div style={{
                  background: '#fff', borderRadius: '20px', padding: '28px 28px 24px',
                  border: '1px solid #e9e2f2', boxShadow: '0 8px 32px rgba(180,50,242,0.08)',
                  marginBottom: '24px', animation: 'fadeInDown 0.3s ease'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClipboardList size={20} color="#B432F2" />
                    Form Tambah Logbook Mingguan
                  </h3>
                  <form onSubmit={handleSubmitLogbook}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>Minggu Ke</label>
                        <input
                          type="number" min="1" max="52"
                          placeholder={`Minggu ${logbookList.length + 1}`}
                          value={logbookForm.minggu_ke}
                          onChange={(e) => setLogbookForm(p => ({ ...p, minggu_ke: e.target.value }))}
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: '10px',
                            border: '1.5px solid #e9e2f2', fontSize: '13px',
                            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>Tanggal Mulai</label>
                        <input
                          type="date"
                          value={logbookForm.tanggal_mulai}
                          onChange={(e) => setLogbookForm(p => ({ ...p, tanggal_mulai: e.target.value }))}
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: '10px',
                            border: '1.5px solid #e9e2f2', fontSize: '13px',
                            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>Tanggal Selesai</label>
                        <input
                          type="date"
                          value={logbookForm.tanggal_selesai}
                          onChange={(e) => setLogbookForm(p => ({ ...p, tanggal_selesai: e.target.value }))}
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: '10px',
                            border: '1.5px solid #e9e2f2', fontSize: '13px',
                            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>Ringkasan Kegiatan <span style={{ color: '#ef4444' }}>*</span></label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Deskripsikan kegiatan yang dilakukan selama minggu ini secara detail (tools yang digunakan, progress pekerjaan, dll)..."
                        value={logbookForm.ringkasan_kegiatan}
                        onChange={(e) => setLogbookForm(p => ({ ...p, ringkasan_kegiatan: e.target.value }))}
                        style={{
                          width: '100%', padding: '12px 14px', borderRadius: '10px',
                          border: '1.5px solid #e9e2f2', fontSize: '13px',
                          fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>Link Lampiran (Opsional)</label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={logbookForm.file_lampiran_url}
                        onChange={(e) => setLogbookForm(p => ({ ...p, file_lampiran_url: e.target.value }))}
                        style={{
                          width: '100%', padding: '10px 14px', borderRadius: '10px',
                          border: '1.5px solid #e9e2f2', fontSize: '13px',
                          fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setShowLogbookForm(false)}
                        style={{
                          padding: '10px 20px', borderRadius: '10px',
                          background: '#f1f5f9', border: 'none', color: '#64748b',
                          fontWeight: '600', fontSize: '13px', cursor: 'pointer'
                        }}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingLogbook}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 24px', borderRadius: '10px',
                          background: isSubmittingLogbook ? '#c4b5d9' : 'linear-gradient(135deg, #B432F2, #7c3aed)',
                          color: '#fff', fontWeight: '700', fontSize: '13px',
                          border: 'none', cursor: isSubmittingLogbook ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 14px rgba(180,50,242,0.25)'
                        }}
                      >
                        {isSubmittingLogbook ? (
                          <><RefreshCcw size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Mengirim...</>
                        ) : (
                          <><Send size={14} /> Kirim Logbook ke Supervisor</>  
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── FILTER TABS ── */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
                {['semua', 'disetujui', 'pending', 'revisi'].map(f => (
                  <button
                    key={f}
                    onClick={() => setLogbookFilter(f)}
                    style={{
                      padding: '7px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                      border: logbookFilter === f ? 'none' : '1.5px solid #e9e2f2',
                      background: logbookFilter === f ? 'linear-gradient(135deg, #B432F2, #7c3aed)' : '#fff',
                      color: logbookFilter === f ? '#fff' : '#64748b',
                      cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s'
                    }}
                  >
                    {f === 'semua' ? `Semua (${logbookSummary.total_logbook})` :
                     f === 'disetujui' ? `✅ Disetujui (${logbookSummary.disetujui})` :
                     f === 'pending' ? `⏳ Pending (${logbookSummary.pending})` :
                     `⚠️ Revisi (${logbookSummary.revisi})`}
                  </button>
                ))}
              </div>

              {/* ── LOGBOOK LIST ── */}
              {isLoadingLogbook ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                  <RefreshCcw size={28} style={{ animation: 'spin 0.8s linear infinite', marginBottom: '12px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>Memuat logbook...</div>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              ) : logbookList.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  background: '#fff', borderRadius: '20px',
                  border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                }}>
                  <ClipboardList size={48} color="#e2e8f0" style={{ marginBottom: '14px' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px' }}>Belum Ada Logbook</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>Mulai catat aktivitas magang minggu ini dengan menekan tombol Tambah Logbook.</p>
                  <button
                    onClick={() => setShowLogbookForm(true)}
                    style={{
                      padding: '10px 24px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #B432F2, #7c3aed)',
                      color: '#fff', fontWeight: '700', border: 'none', cursor: 'pointer'
                    }}
                  >
                    + Tambah Logbook Pertama
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {logbookList
                    .filter(lb => {
                      if (logbookFilter === 'semua') return true;
                      const s = (lb.status_verifikasi || '').toLowerCase();
                      if (logbookFilter === 'disetujui') return s.includes('disetujui');
                      if (logbookFilter === 'pending') return s.includes('pending');
                      if (logbookFilter === 'revisi') return s.includes('revisi');
                      return true;
                    })
                    .map((lb, idx) => {
                      const isApproved = (lb.status_verifikasi || '').toLowerCase().includes('disetujui');
                      const isRevisi = (lb.status_verifikasi || '').toLowerCase().includes('revisi');
                      const statusColor = isApproved ? '#10b981' : isRevisi ? '#ef4444' : '#f59e0b';
                      const statusBg = isApproved ? '#ecfdf5' : isRevisi ? '#fef2f2' : '#fffbeb';
                      const StatusIcon = isApproved ? CheckCircle : isRevisi ? XCircle : Hourglass;
                      return (
                        <div key={lb.id_logbook || idx} style={{
                          background: '#fff', borderRadius: '16px',
                          border: `1px solid ${isApproved ? '#d1fae5' : isRevisi ? '#fecaca' : '#fde68a'}`,
                          padding: '20px 24px',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                          transition: 'all 0.2s',
                          borderLeft: `4px solid ${statusColor}`
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <div style={{
                                  background: '#f8ebff', color: '#B432F2',
                                  borderRadius: '8px', padding: '4px 12px',
                                  fontSize: '12px', fontWeight: '800'
                                }}>
                                  Minggu {lb.minggu_ke}
                                </div>
                                <span style={{
                                  display: 'flex', alignItems: 'center', gap: '4px',
                                  background: statusBg, color: statusColor,
                                  borderRadius: '8px', padding: '3px 10px',
                                  fontSize: '11px', fontWeight: '700'
                                }}>
                                  <StatusIcon size={12} />
                                  {lb.status_verifikasi || 'Pending Review'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>
                                <CalendarDays size={13} />
                                {lb.tanggal_mulai && lb.tanggal_selesai
                                  ? `${new Date(lb.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – ${new Date(lb.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
                                  : '-'}
                              </div>
                              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                                {lb.ringkasan_kegiatan}
                              </p>
                              {lb.catatan_supervisor && (
                                <div style={{
                                  marginTop: '12px', padding: '10px 14px',
                                  background: '#f0fdf4', borderRadius: '10px',
                                  borderLeft: '3px solid #10b981'
                                }}>
                                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>Catatan Supervisor:</div>
                                  <div style={{ fontSize: '12px', color: '#374151' }}>{lb.catatan_supervisor}</div>
                                </div>
                              )}
                            </div>
                            {lb.file_lampiran_url && (
                              <a
                                href={lb.file_lampiran_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '6px',
                                  padding: '8px 14px', borderRadius: '10px',
                                  background: '#f8ebff', color: '#B432F2',
                                  fontSize: '12px', fontWeight: '700',
                                  textDecoration: 'none', border: '1px solid #e9cfbf',
                                  flexShrink: 0, whiteSpace: 'nowrap'
                                }}
                              >
                                <Eye size={13} />
                                Lihat Lampiran
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RIWAYAT MAGANG PER SEMESTER */}
          {activeTab === 'history' && (
            <RiwayatSemesterTab currentUser={currentUser} />
          )}
        </div>
      </div>

      {/* Styled JSX block to keep this premium component modular and beautiful! */}
      <style>{`
        .custom-dashboard-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background-color: #fdfcff;
          color: #0f172a;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          position: relative;
        }

        /* SIDEBAR STYLES */
        .custom-sidebar {
          width: 260px;
          background-color: #ffffff;
          border-right: 1px solid #e9e2f2;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 100;
          overflow-y: auto;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .custom-sidebar.collapsed {
          width: 80px;
        }

        .sidebar-logo {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #f6f1fb;
          transition: padding 0.3s;
          overflow: hidden;
        }

        .custom-sidebar.collapsed .sidebar-logo {
          padding: 24px 12px;
          justify-content: center;
          gap: 0;
        }

        .custom-sidebar.collapsed .logo-icon {
          margin: 0;
        }

        .custom-sidebar.collapsed .sidebar-nav {
          padding: 16px 8px;
        }

        .custom-sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 12px;
          gap: 0;
        }

        .custom-sidebar.collapsed .sidebar-footer {
          padding: 16px 8px !important;
        }

        .custom-sidebar.collapsed .sidebar-footer button {
          justify-content: center;
          padding: 12px !important;
        }

        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background-color: #f8ebff;
        }

        .logo-text h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
        }

        .logo-text span {
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .sidebar-nav {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-section.disabled {
          opacity: 0.5;
        }

        .section-title {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.8px;
          padding: 6px 12px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          width: 100%;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .nav-item:hover {
          background-color: #f8ebff;
          color: #B432F2;
        }

        .nav-item.active {
          background-color: #B432F2;
          color: #ffffff;
        }

        .nav-item.active svg {
          stroke: #ffffff;
        }

        .cursor-not-allowed {
          cursor: not-allowed !important;
        }

        /* VIEWPORT LAYOUT */
        .main-viewport {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow-x: hidden;
          background-color: #fcfbfe;
        }

        /* HEADER STYLES */
        .custom-header {
          background-color: #ffffff;
          border-bottom: 1px solid #e9e2f2;
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 72px;
          position: sticky;
          top: 0;
          z-index: 101;
        }

        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .header-breadcrumbs span {
          cursor: pointer;
        }

        .header-breadcrumbs span:hover {
          color: #B432F2;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: #64748b;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-btn:hover {
          background-color: #f8ebff;
          color: #B432F2;
        }

        .notification-wrapper {
          position: relative;
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          border: 2px solid #ffffff;
        }

        .header-divider {
          width: 1px;
          height: 28px;
          background-color: #e2e8f0;
          margin: 0 4px;
        }

        .profile-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 0;
          background-color: transparent;
          border: none;
        }

        .profile-info {
          text-align: right;
          display: flex;
          flex-direction: column;
          line-height: 1.3;
        }

        .profile-name {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .profile-role {
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
        }

        .profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(147, 51, 234, 0.2);
        }

        /* VIEWPORT CONTENT & MAIN GRID */
        .viewport-content {
          padding: 32px;
          flex-grow: 1;
        }

        .tab-pane {
          width: 100%;
        }

        .page-heading-with-btn {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .page-heading {
          text-align: left;
        }

        .path-breadcrumbs {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .path-breadcrumbs span.active {
          color: #B432F2;
        }

        .main-title {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .main-subtitle {
          font-size: 14px;
          color: #64748b;
        }

        .btn-brand-primary {
          background-color: #B432F2;
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(180, 50, 242, 0.2);
          transition: all 0.2s ease;
        }

        .btn-brand-primary:hover {
          background-color: #9f1be0;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(180, 50, 242, 0.3);
        }

        /* WIDGET STATS ROW */
        .dashboard-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-card-widget {
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e9e2f2;
          text-align: left;
          position: relative;
          box-shadow: 0 4px 20px -2px rgba(180, 50, 242, 0.02);
        }

        .stat-card-widget.bg-light-blue {
          background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
        }

        .stat-card-widget.bg-light-purple {
          background: linear-gradient(135deg, #ffffff 0%, #faf5ff 100%);
        }

        .stat-card-widget.bg-light-blue-2 {
          background: linear-gradient(135deg, #ffffff 0%, #effafb 100%);
        }

        .stat-card-widget.bg-light-red {
          background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
        }

        .stat-widget-num {
          font-family: 'Outfit', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          margin-bottom: 4px;
        }

        .stat-widget-label {
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
        }

        .stat-bubble {
          position: absolute;
          top: 24px;
          right: 24px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .stat-bubble.bg-blue-opaque {
          background-color: #e0f2fe;
          color: #0369a1;
        }

        .stat-bubble.bg-purple-opaque {
          background-color: #f3e8ff;
          color: #6b21a8;
        }

        .stat-bubble.bg-blue-opaque-2 {
          background-color: #ccfbf1;
          color: #0f766e;
        }

        .stat-bubble.bg-red-opaque {
          background-color: #fee2e2;
          color: #b91c1c;
        }

        /* PANEL WRAPPER AND GRID */
        .panel-container {
          background-color: #ffffff;
          border: 1px solid #e9e2f2;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px -2px rgba(180, 50, 242, 0.02);
          text-align: left;
        }

        .dashboard-top-row {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
        }

        .program-summary-card {
          flex: 1;
          background: linear-gradient(135deg, #B432F2 0%, #9f1be0 50%, #8900ff 100%);
          border-radius: 20px;
          padding: 32px;
          color: #ffffff;
          text-align: left;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(180, 50, 242, 0.2);
        }

        .program-summary-card::after {
          content: '';
          position: absolute;
          right: -50px;
          bottom: -50px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          pointer-events: none;
        }

        .card-header-badge {
          margin-bottom: 16px;
        }

        .running-badge {
          background-color: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 99px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .running-badge.small {
          font-size: 9px;
          padding: 2px 8px;
        }

        .program-title {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .program-partner {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          opacity: 0.9;
          margin-bottom: 28px;
        }

        .progress-container {
          margin-bottom: 24px;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .progress-bar-track {
          height: 6px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 99px;
          overflow: hidden;
          width: 100%;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: #ffffff;
          border-radius: 99px;
        }

        .progress-bar-fill.fill-purple {
          background-color: #B432F2;
        }

        .indicator-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .indicator-box {
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ind-val {
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
        }

        .ind-lbl {
          font-size: 9px;
          font-weight: 600;
          opacity: 0.8;
          text-align: center;
          margin-top: 2px;
        }

        .dashboard-side-actions {
          width: 320px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex-shrink: 0;
        }

        .action-card-btn {
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }

        .action-card-btn.purple-theme {
          background-color: #f8ebff;
          border: 1px solid #e9cfbf;
          color: #B432F2;
        }

        .action-card-btn.purple-theme:hover {
          background-color: #eecfff;
          transform: translateY(-2px);
        }

        .action-card-btn.white-theme {
          background-color: #ffffff;
          border: 1px solid #e9e2f2;
          color: #0f172a;
          box-shadow: 0 4px 15px rgba(180, 50, 242, 0.01);
        }

        .action-card-btn.white-theme:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .act-content h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .act-content span {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
        }

        /* NOTIFICATIONS WIDGET */
        .notifications-widget {
          background-color: #ffffff;
          border: 1px solid #e9e2f2;
          border-radius: 16px;
          padding: 16px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          text-align: left;
          box-shadow: 0 4px 15px rgba(180, 50, 242, 0.01);
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .widget-header h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .new-badge {
          background-color: #fef2f2;
          border: 1px solid #fee2e2;
          color: #ef4444;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .widget-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          max-height: 140px;
        }

        .widget-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 11px;
          line-height: 1.4;
        }

        .item-icon-wrap {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-icon-wrap.blue-bg {
          background-color: #eff6ff;
          color: #3b82f6;
        }

        .item-icon-wrap.purple-bg {
          background-color: #fdfaff;
          color: #B432F2;
        }

        .item-details p {
          color: #334155;
          margin: 0;
        }

        .item-time {
          display: block;
          font-size: 9px;
          color: #94a3b8;
          font-weight: 600;
          margin-top: 2px;
        }

        /* MIDDLE LAYOUT GRID */
        .dashboard-mid-row {
          display: flex;
          gap: 24px;
        }

        .width-55 {
          flex: 1;
        }

        .width-45 {
          width: 420px;
          flex-shrink: 0;
        }

        .section-subheading {
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .panel-subtitle-text {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 20px;
        }

        .internship-status-box {
          border: 1px solid #e9e2f2;
          background-color: #fdfcff;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .box-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .box-header h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .box-header span {
          font-size: 11px;
          color: #64748b;
        }

        .box-meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          border-top: 1px solid #f6f1fb;
          padding-top: 16px;
        }

        .meta-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .meta-val {
          font-size: 12px;
          font-weight: 600;
          color: #334155;
        }

        .add-dashed-btn {
          width: 100%;
          border: 2px dashed #d9cbef;
          background-color: #fdfaff;
          color: #B432F2;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-dashed-btn:hover {
          background-color: #f8ebff;
          border-color: #B432F2;
        }

        /* CONVERSION PROGRESS timelines */
        .timeline-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .timeline-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .row-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .subject-name {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }

        .subject-status {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .subject-status.color-blue {
          color: #3b82f6;
        }

        .subject-status.color-gray {
          color: #6b7280;
        }

        .subject-status.color-purple {
          color: #10b981;
        }

        .timeline-track-bar {
          display: flex;
          gap: 6px;
          width: 100%;
        }

        .bar-segment {
          flex: 1;
          height: 5px;
          border-radius: 99px;
          background-color: #e2e8f0;
        }

        .bar-segment.active {
          background-color: #3b82f6;
        }

        .bar-segment.active-purple {
          background-color: #10b981;
        }

        .timeline-labels {
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .timeline-labels span {
          flex: 1;
        }

        /* DATA TABLE STYLE */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .custom-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .custom-data-table th,
        .custom-data-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f6f1fb;
        }

        .custom-data-table th {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          background-color: #fdfcff;
        }

        .custom-data-table td {
          font-size: 13px;
          color: #334155;
          vertical-align: middle;
        }

        .cell-primary {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .cell-secondary {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        .font-medium-cells td {
          font-size: 14px;
        }

        .font-bold {
          font-weight: 700 !important;
        }

        .font-regular {
          font-weight: 500 !important;
        }

        .status-capsule {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-capsule.badge-blue {
          background-color: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
        }

        .status-capsule.badge-gray {
          background-color: #f3f4f6;
          color: #4b5563;
          border: 1px solid #e5e7eb;
        }

        .status-capsule.badge-purple {
          background-color: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .status-capsule.badge-purple-solid {
          background-color: #f3e8ff;
          color: #6b21a8;
          font-size: 11px;
          padding: 6px 12px;
        }

        .status-capsule.badge-purple-solid-mini {
          background-color: #f3e8ff;
          color: #6b21a8;
          font-size: 9px;
          padding: 2px 8px;
        }

        .status-capsule.badge-blue-outline {
          border: 1px solid #3b82f6;
          color: #3b82f6;
          background-color: transparent;
        }

        .status-dot-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .table-action-icon {
          background: transparent;
          border: none;
          color: #94a3b8;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .table-action-icon:hover {
          background-color: #f8ebff;
          color: #B432F2;
        }

        .text-link-btn {
          background: none;
          border: none;
          color: #B432F2;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s;
        }

        .text-link-btn:hover {
          color: #9f1be0;
          text-decoration: underline;
        }

        /* CONVERSION TAB VIEW STYLE LAYOUT */
        .conversion-view-layout {
          display: flex;
          gap: 24px;
        }

        .conversion-left-list {
          flex: 1;
        }

        .conversion-main-card {
          background-color: #ffffff;
          border: 1px solid #e9e2f2;
          border-radius: 20px;
          padding: 24px;
        }

        .main-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #f6f1fb;
          padding-bottom: 18px;
          margin-bottom: 18px;
        }

        .internship-title {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 4px 0 2px 0;
        }

        .internship-role {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .overall-progress-section {
          background-color: #fdfcff;
          border: 1px solid #f1e9f7;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: left;
        }

        .progress-title-lbl {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .progress-slider-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-percentage-lbl {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #B432F2;
          flex-shrink: 0;
        }

        .conversion-subjects-timeline {
          display: flex;
          flex-direction: column;
          gap: 24px;
          text-align: left;
        }

        .detail-section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: -8px;
        }

        .subject-timeline-node {
          padding-left: 16px;
          border-left: 2px solid #f6f1fb;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
        }

        .subject-timeline-node::before {
          content: '';
          position: absolute;
          left: -6px;
          top: 6px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #B432F2;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 2px #e9dcf5;
        }

        .node-subject-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .sub-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .sub-meta {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }

        .total-sks-badge {
          background-color: #ffffff;
          border: 1px solid #e9e2f2;
          border-radius: 12px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 15px rgba(180, 50, 242, 0.01);
        }

        .badge-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background-color: #f8ebff;
          color: #B432F2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.2;
        }

        .b-label {
          font-size: 8px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.5px;
        }

        .b-val {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }

        .conversion-right-sidebar {
          width: 320px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* HORIZONTAL NODES TIMELINE */
        .horizontal-nodes {
          display: flex;
          align-items: center;
          width: 100%;
          margin-bottom: 12px;
        }

        .h-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 24px;
        }

        .node-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 2px solid #e2e8f0;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .h-node.active .node-circle {
          background-color: #3b82f6;
          border-color: #3b82f6;
          color: #ffffff;
        }

        .h-node.active-purple .node-circle {
          background-color: #B432F2;
          border-color: #B432F2;
          color: #ffffff;
        }

        .h-node-line {
          height: 3px;
          background-color: #e2e8f0;
          flex-grow: 1;
        }

        .h-node-line.active {
          background-color: #3b82f6;
        }

        .h-node-line.active-purple {
          background-color: #B432F2;
        }

        .node-lbl {
          position: absolute;
          top: 26px;
          font-size: 9px;
          font-weight: 700;
          color: #94a3b8;
          white-space: nowrap;
          text-transform: uppercase;
        }

        .h-node.active .node-lbl {
          color: #3b82f6;
        }

        .h-node.active-purple .node-lbl {
          color: #B432F2;
        }

        .horizontal-nodes {
          margin-bottom: 24px;
        }

        /* COMMENT BOX */
        .dosen-comment-box {
          background-color: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .comment-icon {
          color: #d97706;
          flex-shrink: 0;
        }

        .comment-text {
          font-size: 12px;
          color: #d97706;
          line-height: 1.4;
          margin: 0;
        }

        /* SUPPORTING DOCS BOX */
        .sidebar-box-card {
          background-color: #ffffff;
          border: 1px solid #e9e2f2;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px -2px rgba(180, 50, 242, 0.03);
          text-align: left;
        }

        .box-card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f6f1fb;
        }

        .box-card-title svg {
          color: #B432F2;
        }

        .doc-list-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }

        .doc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        }

        .doc-info-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .doc-check-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }

        .doc-check-icon.checked {
          background-color: #ecfdf5;
          color: #10b981;
        }

        .doc-check-icon.alert {
          background-color: #fef2f2;
          color: #ef4444;
        }

        .doc-text h5 {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          line-height: 1.2;
        }

        .doc-text span {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        .doc-view-btn {
          background-color: #f1f5f9;
          border: none;
          color: #64748b;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .doc-view-btn:hover {
          background-color: #e2e8f0;
          color: #0f172a;
        }

        .doc-upload-btn {
          background-color: #ef4444;
          border: none;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .doc-upload-btn:hover {
          background-color: #dc2626;
        }

        .view-history-outline-btn {
          width: 100%;
          border: 1px solid #d9cbef;
          background: transparent;
          color: #B432F2;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-history-outline-btn:hover {
          background-color: #fdfaff;
          border-color: #B432F2;
        }

        .sidebar-illustration-panel {
          border-radius: 20px;
          background-color: #ffffff;
          border: 1px solid #e9e2f2;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .illust-svg {
          width: 100%;
          height: auto;
          max-height: 120px;
        }

        .table-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #f6f1fb;
        }

        .pagination-info {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }

        .pagination-pages {
          display: flex;
          gap: 6px;
        }

        .pag-btn {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pag-btn:hover:not(.active) {
          background-color: #f8ebff;
          color: #B432F2;
          border-color: #d9cbef;
        }

        .pag-btn.active {
          background-color: #B432F2;
          color: #ffffff;
          border-color: #B432F2;
        }

        /* Custom Centered Modal Alert Styles */
        .custom-modal-alert-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .custom-modal-alert-card {
          background-color: #ffffff;
          border-radius: 20px;
          width: 100%;
          max-width: 380px;
          padding: 32px 24px 24px 24px;
          box-shadow: 0 20px 25px -5px rgba(180, 50, 242, 0.1), 0 10px 10px -5px rgba(180, 50, 242, 0.04);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #e9e2f2;
          animation: alertPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes alertPopIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .alert-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .alert-icon-wrapper.success {
          background-color: #ecfdf5;
          color: #10b981;
        }

        .alert-icon-wrapper.error {
          background-color: #fef2f2;
          color: #ef4444;
        }

        .alert-icon-wrapper.warning {
          background-color: #fff7ed;
          color: #f97316;
        }

        .alert-icon-wrapper.info {
          background-color: #eff6ff;
          color: #3b82f6;
        }

        .alert-modal-title {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
          text-transform: none;
          letter-spacing: normal;
        }

        .alert-modal-message {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: #64748b;
          margin-bottom: 24px;
          padding: 0 10px;
        }

        .btn-alert-modal-close {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-alert-modal-close.success {
          background-color: #10b981;
          color: #ffffff;
        }
        .btn-alert-modal-close.success:hover {
          background-color: #059669;
        }

        .btn-alert-modal-close.error {
          background-color: #ef4444;
          color: #ffffff;
        }
        .btn-alert-modal-close.error:hover {
          background-color: #dc2626;
        }

        .btn-alert-modal-close.warning {
          background-color: #f97316;
          color: #ffffff;
        }
        .btn-alert-modal-close.warning:hover {
          background-color: #ea580c;
        }

        .btn-alert-modal-close.info {
          background-color: #3b82f6;
          color: #ffffff;
        }
        .btn-alert-modal-close.info:hover {
          background-color: #2563eb;
        }

        /* GRADE BADGE STYLES */
        .sk-grade-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 800;
        }
        .sk-grade-badge.grade-A { background: #dcfce7; color: #15803d; }
        .sk-grade-badge.grade-B\\+ { background: #dcfce7; color: #16a34a; }
        .sk-grade-badge.grade-B { background: #eff6ff; color: #1d4ed8; }
        .sk-grade-badge.grade-C\\+ { background: #fef9c3; color: #a16207; }
        .sk-grade-badge.grade-C { background: #fef9c3; color: #ca8a04; }
        .sk-grade-badge.grade-D { background: #fee2e2; color: #b91c1c; }
        .sk-grade-badge.grade-E { background: #fee2e2; color: #ef4444; }
        .sk-grade-badge.grade-- { background: #f1f5f9; color: #94a3b8; }

        /* NOTIFICATION DROPDOWN STYLES */
        .notification-dropdown {
          position: absolute;
          right: 0;
          top: 48px;
          width: 320px;
          background-color: #ffffff;
          border: 1px solid #e9e2f2;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(180, 50, 242, 0.1), 0 8px 10px -6px rgba(180, 50, 242, 0.05);
          z-index: 1000;
          padding: 16px;
          text-align: left;
          animation: dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          border-bottom: 1px solid #f6f1fb;
          padding-bottom: 10px;
        }

        .dropdown-header h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .dropdown-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 240px;
          overflow-y: auto;
        }

        .dropdown-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 11px;
          line-height: 1.4;
          padding: 6px 0;
        }

        .dropdown-item p {
          color: #334155;
          margin: 0;
        }

        /* LOCKED DASHBOARD STATE STYLES */
        .dashboard-locked-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 0;
          width: 100%;
        }

        .locked-card {
          background-color: #ffffff;
          border: 1.5px solid #e9e2f2;
          border-radius: 24px;
          padding: 40px;
          max-width: 680px;
          width: 100%;
          text-align: center;
          box-shadow: 0 10px 30px rgba(180, 50, 242, 0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeUp 0.4s ease-out;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .locked-icon-wrapper {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background-color: #fff7ed;
          color: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border: 1.5px solid #ffedd5;
          animation: pulseIcon 2s infinite ease-in-out;
        }

        @keyframes pulseIcon {
          0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(249, 115, 22, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
          }
        }

        .locked-title {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .locked-description {
          font-size: 14.5px;
          color: #64748b;
          line-height: 1.6;
          max-width: 500px;
          margin-bottom: 32px;
        }

        .locked-steps-tracker {
          width: 100%;
          background-color: #fdfcff;
          border: 1.5px solid #f3e8ff;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          text-align: left;
        }

        .tracker-header {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tracker-steps-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .tracker-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 12px 8px;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .tracker-step-item.completed {
          background-color: #f0fdf4;
          border-color: #bbf7d0;
          color: #15803d;
        }

        .tracker-step-item.pending {
          background-color: #eff6ff;
          border-color: #bfdbfe;
          color: #1d4ed8;
        }

        .step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #f1f5f9;
          color: #64748b;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .tracker-step-item.completed .step-number {
          background-color: #16a34a;
          color: #ffffff;
        }

        .tracker-step-item.pending .step-number {
          background-color: #2563eb;
          color: #ffffff;
        }

        .step-name {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 4px;
        }

        .tracker-step-item.completed .step-name {
          color: #15803d;
        }

        .tracker-step-item.pending .step-name {
          color: #1d4ed8;
        }

        .step-status {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .tracker-step-item.completed .step-status {
          color: #16a34a;
        }

        .tracker-step-item.pending .step-status {
          color: #2563eb;
        }

        .locked-cta {
          padding: 12px 24px;
          font-size: 13px;
          gap: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: auto;
        }

        @media (max-width: 1024px) {
          .dashboard-top-row,
          .dashboard-mid-row,
          .conversion-view-layout {
            flex-direction: column;
          }
          
          .program-summary-card,
          .dashboard-side-actions,
          .width-55,
          .width-45,
          .conversion-left-list,
          .conversion-right-sidebar {
            flex: none;
            width: 100%;
          }
          
          .dashboard-stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .custom-sidebar {
            display: none; /* In production would implement sidebar drawer toggling */
          }
          .custom-header {
            padding: 16px 20px;
          }
          .viewport-content {
            padding: 20px;
          }
          .dashboard-stats-row {
            grid-template-columns: 1fr;
          }
          .indicator-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* CUSTOM MODAL ALERT DI TENGAH LAYAR */}
      {customAlert.show && (
        <div className="custom-modal-alert-overlay fade-in">
          <div className="custom-modal-alert-card">
            <div className={`alert-icon-wrapper ${customAlert.type}`}>
              {customAlert.type === 'success' && <CheckCircle2 size={36} />}
              {customAlert.type === 'error' && <AlertCircle size={36} />}
              {customAlert.type === 'warning' && <AlertCircle size={36} />}
              {customAlert.type === 'info' && <AlertCircle size={36} />}
            </div>
            <h3 className="alert-modal-title">{customAlert.title}</h3>
            <p className="alert-modal-message">{customAlert.message}</p>
            <button 
              className={`btn-alert-modal-close ${customAlert.type}`}
              onClick={() => setCustomAlert(prev => ({ ...prev, show: false }))}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MahasiswaDashboard;
