import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Building, 
  ShieldCheck, 
  FileCheck2, 
  BarChart2, 
  Star, 
  CheckCircle, 
  Clock, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Search,
  FileText,
  ExternalLink,
  Award,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Filter,
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  Inbox,
  Check,
  Ban
} from 'lucide-react';
import amikomLogo from '../../assets/amikom.png';
import unikaLogo from '../../assets/unika-logo.svg';
import { 
  getMitraDashboardStatsApi, 
  getMitraMahasiswaListApi, 
  submitMitraPenilaianApi,
  getMitraPendaftarListApi,
  accPendaftarMitraApi,
  tolakPendaftarMitraApi
} from '../../services/mitraService';

const MitraDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('penerimaan'); // 'penerimaan' or 'penilaian'
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [statsData, setStatsData] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [pendaftarList, setPendaftarList] = useState([]);
  const [mitraInfo, setMitraInfo] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal Penilaian State
  const [gradingModal, setGradingModal] = useState({
    show: false,
    item: null,
    nilaiAngka: '',
    catatan: '',
    sertifikatUrl: ''
  });

  // Modal ACC / Tolak Pendaftar State
  const [decisionModal, setDecisionModal] = useState({
    show: false,
    item: null,
    type: 'ACC', // 'ACC' or 'TOLAK'
    catatan: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: 'success' });

  const token = currentUser?.token || localStorage.getItem('edushift_token');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchMitraData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Dashboard Stats
      const resStats = await getMitraDashboardStatsApi(token);
      if (resStats.success && resStats.data) {
        setStatsData(resStats.data.ringkasan);
        if (resStats.data.mitra) setMitraInfo(resStats.data.mitra);
      }

      // 2. Fetch Pendaftaran Magang List (Penerimaan TAB)
      const resPendaftar = await getMitraPendaftarListApi(token);
      if (resPendaftar.success && Array.isArray(resPendaftar.data)) {
        setPendaftarList(resPendaftar.data);
      }

      // 3. Fetch Surat Akhir & Evaluation List (Penilaian TAB)
      const resList = await getMitraMahasiswaListApi(token, searchQuery, statusFilter === 'ALL' ? '' : statusFilter);
      if (resList.success && resList.data) {
        setStudentsList(resList.data.mahasiswa || []);
        if (resList.data.mitra && !mitraInfo) setMitraInfo(resList.data.mitra);
      }
    } catch (err) {
      console.error('Gagal mengambil data Mitra Dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMitraData();
    }
  }, [token, statusFilter]);

  const calculateGradeLetter = (score) => {
    if (score === null || score === undefined || score === '' || isNaN(Number(score))) return '-';
    const val = Math.ceil(Number(score));
    if (val >= 90) return 'A';
    if (val >= 80) return 'A-';
    if (val >= 75) return 'B+';
    if (val >= 70) return 'B';
    if (val >= 65) return 'C+';
    if (val >= 60) return 'C';
    if (val >= 50) return 'D';
    return 'E';
  };

  // Open Modal for ACC / Tolak
  const handleOpenDecisionModal = (item, type) => {
    setDecisionModal({
      show: true,
      item,
      type,
      catatan: type === 'ACC' 
        ? 'Selamat! Pendaftaran magang Anda telah disetujui resmi oleh Mitra Industri.' 
        : 'Mohon maaf, kualifikasi portofolio / kuota magang perusahaan saat ini telah penuh.'
    });
  };

  // Submit Decision (ACC or Tolak)
  const handleSubmitDecision = async (e) => {
    e.preventDefault();
    if (decisionModal.type === 'TOLAK' && !decisionModal.catatan.trim()) {
      alert('Alasan penolakan pendaftaran magang wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      let res;
      if (decisionModal.type === 'ACC') {
        res = await accPendaftarMitraApi(token, {
          id_pengajuan: decisionModal.item.id_pengajuan,
          nim: decisionModal.item.nim,
          catatan_mitra: decisionModal.catatan
        });
      } else {
        res = await tolakPendaftarMitraApi(token, {
          id_pengajuan: decisionModal.item.id_pengajuan,
          nim: decisionModal.item.nim,
          catatan_mitra: decisionModal.catatan
        });
      }

      if (res.success) {
        setAlertInfo({
          show: true,
          message: decisionModal.type === 'ACC'
            ? `Pendaftaran magang ${decisionModal.item.nama_mahasiswa} (${decisionModal.item.nim}) Berhasil DI-ACC!`
            : `Pendaftaran magang ${decisionModal.item.nama_mahasiswa} (${decisionModal.item.nim}) telah ditolak.`,
          type: decisionModal.type === 'ACC' ? 'success' : 'warning'
        });
        setDecisionModal({ show: false, item: null, type: 'ACC', catatan: '' });
        await fetchMitraData();
      } else {
        alert(res.message || 'Gagal memproses pendaftaran.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Open Modal for Grading
  const handleOpenGradingModal = (item) => {
    const existingScore = item.penilaian_mitra?.nilai_angka ?? '';
    const existingNotes = item.penilaian_mitra?.catatan_mitra ?? '';
    const existingCert = item.penilaian_mitra?.sertifikat_magang_url ?? `https://drive.google.com/file/d/sertifikat_${item.nim || 'magang'}.pdf`;

    setGradingModal({
      show: true,
      item,
      nilaiAngka: existingScore !== null ? String(existingScore) : '',
      catatan: existingNotes || '',
      sertifikatUrl: existingCert
    });
  };

  // Save Grade
  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradingModal.nilaiAngka || isNaN(Number(gradingModal.nilaiAngka))) {
      alert('Masukkan Nilai Angka yang valid (0-100)');
      return;
    }

    const numVal = Number(gradingModal.nilaiAngka);
    if (numVal < 0 || numVal > 100) {
      alert('Nilai Angka harus dalam rentang 0 hingga 100');
      return;
    }

    setIsSaving(true);
    try {
      const res = await submitMitraPenilaianApi(token, {
        id_surat_akhir: gradingModal.item.id_surat_akhir,
        nim: gradingModal.item.nim,
        nilai_mitra_angka: numVal,
        nilai_mitra_huruf: calculateGradeLetter(numVal),
        catatan_mitra: gradingModal.catatan,
        sertifikat_magang_url: gradingModal.sertifikatUrl,
      });

      if (res.success) {
        setAlertInfo({
          show: true,
          message: `Penilaian untuk ${gradingModal.item.nama_mahasiswa} (${gradingModal.item.nim}) berhasil disimpan! Nilai: ${numVal} (${calculateGradeLetter(numVal)}).`,
          type: 'success'
        });
        setGradingModal({ show: false, item: null, nilaiAngka: '', catatan: '', sertifikatUrl: '' });
        await fetchMitraData();
      } else {
        alert(res.message || 'Gagal menyimpan penilaian mitra.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Search filter for Pendaftar tab
  const filteredPendaftar = pendaftarList.filter(item => {
    const q = searchQuery.toLowerCase();
    return !q || 
      item.nama_mahasiswa?.toLowerCase().includes(q) || 
      item.nim?.toLowerCase().includes(q) || 
      item.prodi?.toLowerCase().includes(q) ||
      item.id_magang_fakultas?.toLowerCase().includes(q);
  });

  // Search filter for Penilaian tab
  const filteredStudents = studentsList.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchQuery = !q || 
      item.nama_mahasiswa?.toLowerCase().includes(q) || 
      item.nim?.toLowerCase().includes(q) || 
      item.prodi?.toLowerCase().includes(q) ||
      item.magang?.id_magang_fakultas?.toLowerCase().includes(q);

    const isEvaluated = item.penilaian_mitra?.status === 'Sudah Dinilai Mitra' || item.penilaian_mitra?.nilai_angka !== null;
    let matchStatus = true;
    if (statusFilter === 'SUDAH') matchStatus = isEvaluated;
    if (statusFilter === 'BELUM') matchStatus = !isEvaluated;

    return matchQuery && matchStatus;
  });

  return (
    <div className="custom-dashboard-container purple-gradient-theme fade-in">
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
            {!isSidebarCollapsed && <span className="section-title">MITRA INDUSTRI</span>}
            
            <button 
              onClick={() => setActiveTab('penerimaan')}
              className={`nav-item ${activeTab === 'penerimaan' ? 'active' : ''}`}
            >
              <Inbox size={18} />
              {!isSidebarCollapsed && <span>Penerimaan Magang</span>}
            </button>

            <button 
              onClick={() => setActiveTab('penilaian')}
              className={`nav-item ${activeTab === 'penilaian' ? 'active' : ''}`}
            >
              <Star size={18} />
              {!isSidebarCollapsed && <span>Evaluasi & Nilai</span>}
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
      >
        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* 2. Main Viewport */}
      <div className="main-viewport">
        {/* Top Header */}
        <header className="custom-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={amikomLogo} 
              alt="Logo Universitas Amikom Yogyakarta" 
              style={{ height: '38px', width: 'auto', objectFit: 'contain' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', lineHeight: '1.2' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#B432F2', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                UNIVERSITAS AMIKOM
              </h3>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', margin: 0, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                YOGYAKARTA
              </span>
            </div>
          </div>

          <div className="header-actions">
            <div className="profile-badge">
              <div className="profile-info">
                <span className="profile-name">{mitraInfo?.nama_perusahaan || currentUser?.name || 'PT GoTo Gojek Tokopedia Tbk'}</span>
                <span className="profile-role">{mitraInfo?.nama_supervisor || 'Supervisor Industri'}</span>
              </div>
              <div className="profile-avatar">
                {currentUser?.name ? currentUser.name.charAt(0) : 'M'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-content" style={{ maxWidth: '100%', margin: '0', padding: '32px' }}>
          
          {/* Alert Notification Popup */}
          {alertInfo.show && (
            <div style={{
              background: alertInfo.type === 'warning' ? '#fffbeb' : '#ecfdf5',
              border: `1px solid ${alertInfo.type === 'warning' ? '#fcd34d' : '#6ee7b7'}`,
              color: alertInfo.type === 'warning' ? '#b45309' : '#065f46',
              padding: '16px 20px',
              borderRadius: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color={alertInfo.type === 'warning' ? '#d97706' : '#10b981'} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{alertInfo.message}</span>
              </div>
              <button 
                onClick={() => setAlertInfo({ show: false, message: '', type: 'success' })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: '700' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Welcome Section */}
          <section className="welcome-section">
            <h2 className="welcome-title">Portal Mitra Industri - {mitraInfo?.nama_perusahaan || currentUser?.name || 'PT GoTo Gojek Tokopedia Tbk'}</h2>
            <p className="welcome-desc">
              Kelola verifikasi penerimaan mahasiswa magang (ACC/Tolak), tinjau <strong>Surat Pengantar Magang FIK</strong>, serta input penilaian kinerja industri.
            </p>
          </section>

          {/* Stats Grid */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{pendaftarList.length} Pendaftar</span>
                <span className="stat-label">Pendaftar Magang Masuk</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <ShieldCheck size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{pendaftarList.filter(p => p.status_penerimaan_mitra?.includes('Disetujui')).length} Diterima</span>
                <span className="stat-label">Mahasiswa Magang (ACC)</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{pendaftarList.filter(p => !p.status_penerimaan_mitra || p.status_penerimaan_mitra.includes('Pending')).length} Pending</span>
                <span className="stat-label">Menunggu Review Penerimaan</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{statsData?.rata_rata_nilai ? Number(statsData.rata_rata_nilai).toFixed(1) : '95.0'}</span>
                <span className="stat-label">Rata-rata Nilai Mitra</span>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* TAB 1: PENERIMAAN MAHASISWA MAGANG (ACC / TOLAK & SURAT PENGANTAR FIK) */}
          {/* ========================================================================= */}
          {activeTab === 'penerimaan' && (
            <div className="info-grid fade-in" style={{ gridTemplateColumns: '1fr' }}>
              <section className="main-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <h3 className="panel-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Inbox size={20} className="text-primary" />
                      Daftar Pendaftaran Mahasiswa Magang Masuk ({filteredPendaftar.length})
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Tinjau Surat Pengantar Magang FIK, lalu berikan persetujuan (ACC) atau penolakan magang.
                    </span>
                  </div>

                  {/* Search Bar */}
                  <div style={{ position: 'relative', minWidth: '260px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Cari Mahasiswa / NIM..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        padding: '8px 12px 8px 36px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        width: '100%',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Memuat pendaftaran magang masuk...
                  </div>
                ) : filteredPendaftar.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '16px' }}>
                    Belum ada pendaftaran magang mahasiswa yang masuk ke perusahaan Anda.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>MAHASISWA</th>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>ID MAGANG / POSISI</th>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>SURAT PENGANTAR FIK</th>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center' }}>STATUS PENERIMAAN</th>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center' }}>AKSI VERIFIKASI MITRA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPendaftar.map((item) => {
                          const statusStr = item.status_penerimaan_mitra || 'Pending Review Mitra';
                          const isApproved = statusStr.includes('Disetujui');
                          const isRejected = statusStr.includes('Ditolak');

                          return (
                            <tr key={item.id_pengajuan || item.nim} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '16px 8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{item.nama_mahasiswa}</span>
                                  <span style={{ fontSize: '12px', color: '#64748b' }}>NIM: {item.nim} • {item.prodi || 'Informatika'}</span>
                                </div>
                              </td>

                              <td style={{ padding: '16px 8px', fontSize: '13px' }}>
                                <span style={{ fontWeight: '700', color: '#B432F2', display: 'block' }}>
                                  {item.id_magang_fakultas || 'FIK6199364'}
                                </span>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                  {item.posisi || 'Fullstack Developer Intern'}
                                </span>
                              </td>

                              <td style={{ padding: '16px 8px' }}>
                                {item.surat_pengantar_url ? (
                                  <a
                                    href={item.surat_pengantar_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      padding: '6px 12px',
                                      borderRadius: '8px',
                                      background: '#faf5ff',
                                      color: '#B432F2',
                                      border: '1px solid #f3e8ff',
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      textDecoration: 'none'
                                    }}
                                  >
                                    <FileText size={14} />
                                    <span>Lihat Surat FIK PDF</span>
                                  </a>
                                ) : (
                                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>-</span>
                                )}
                              </td>

                              <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '5px 12px',
                                  borderRadius: '99px',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  backgroundColor: isApproved ? '#ecfdf5' : isRejected ? '#fef2f2' : '#fffbeb',
                                  color: isApproved ? '#059669' : isRejected ? '#dc2626' : '#d97706',
                                  border: isApproved ? '1px solid #a7f3d0' : isRejected ? '1px solid #fecaca' : '1px solid #fde68a'
                                }}>
                                  {isApproved ? <CheckCircle size={13} /> : isRejected ? <Ban size={13} /> : <Clock size={13} />}
                                  {isApproved ? 'Diterima (ACC Mitra)' : isRejected ? 'Ditolak Mitra' : 'Pending Review'}
                                </span>
                              </td>

                              <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDecisionModal(item, 'ACC')}
                                    style={{
                                      background: isApproved ? '#059669' : '#10b981',
                                      color: '#ffffff',
                                      border: 'none',
                                      padding: '7px 14px',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)'
                                    }}
                                  >
                                    <Check size={14} />
                                    <span>{isApproved ? 'ACC (Disetujui)' : 'ACC / Terima'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleOpenDecisionModal(item, 'TOLAK')}
                                    style={{
                                      background: isRejected ? '#ef4444' : '#ffffff',
                                      color: isRejected ? '#ffffff' : '#ef4444',
                                      border: '1px solid #ef4444',
                                      padding: '7px 14px',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <Ban size={14} />
                                    <span>{isRejected ? 'Ditolak' : 'Tolak'}</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EVALUASI & PENILAIAN AKHIR MAGANG MITRA */}
          {/* ========================================================================= */}
          {activeTab === 'penilaian' && (
            <div className="info-grid fade-in" style={{ gridTemplateColumns: '1fr' }}>
              <section className="main-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <h3 className="panel-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Star size={20} className="text-primary" />
                      Daftar Pengajuan Surat Akhir Magang & Evaluasi Kinerja Mahasiswa ({filteredStudents.length})
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      Input nilai kinerja industri (0-100), ulasan evaluasi, serta link sertifikat magang.
                    </span>
                  </div>

                  {/* Filter & Search Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative', minWidth: '220px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="Cari Mahasiswa/NIM..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          padding: '8px 12px 8px 36px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          width: '100%',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#475569',
                        outline: 'none',
                        background: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="ALL">Semua Status</option>
                      <option value="BELUM">Belum Dinilai</option>
                      <option value="SUDAH">Sudah Dinilai</option>
                    </select>
                  </div>
                </div>
                
                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Memuat daftar pengajuan magang...
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>MAHASISWA</th>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>ID MAGANG / PERIODE</th>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>SURAT FIK</th>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center' }}>STATUS EVALUASI</th>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center' }}>NILAI MITRA</th>
                          <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center' }}>AKSI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((item) => {
                          const isEvaluated = item.penilaian_mitra?.status === 'Sudah Dinilai Mitra' || item.penilaian_mitra?.nilai_angka !== null;
                          const gradeVal = item.penilaian_mitra?.nilai_angka;
                          const gradeLetter = item.penilaian_mitra?.nilai_huruf || calculateGradeLetter(gradeVal);
                          const pdfUrl = item.magang?.surat_terima_kasih_url || item.surat_terima_kasih_url;

                          return (
                            <tr key={item.id_surat_akhir || item.nim} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '16px 8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{item.nama_mahasiswa}</span>
                                  <span style={{ fontSize: '12px', color: '#64748b' }}>NIM: {item.nim} • {item.prodi || 'Informatika'}</span>
                                </div>
                              </td>
                              
                              <td style={{ padding: '16px 8px', fontSize: '13px' }}>
                                <span style={{ fontWeight: '700', color: '#B432F2', display: 'block' }}>
                                  {item.magang?.id_magang_fakultas || 'FIK6199373'}
                                </span>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                  {item.magang?.posisi || 'Fullstack Developer Intern'} • {item.magang?.periode_magang || '6 Bulan'}
                                </span>
                              </td>

                              <td style={{ padding: '16px 8px' }}>
                                {pdfUrl ? (
                                  <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      padding: '6px 12px',
                                      borderRadius: '8px',
                                      background: '#faf5ff',
                                      color: '#B432F2',
                                      border: '1px solid #f3e8ff',
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      textDecoration: 'none'
                                    }}
                                  >
                                    <FileText size={14} />
                                    <span>Surat Terima Kasih PDF</span>
                                  </a>
                                ) : (
                                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>-</span>
                                )}
                              </td>

                              <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 12px',
                                  borderRadius: '99px',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  backgroundColor: isEvaluated ? '#ecfdf5' : '#fffbeb',
                                  color: isEvaluated ? '#059669' : '#d97706',
                                  border: isEvaluated ? '1px solid #a7f3d0' : '1px solid #fde68a'
                                }}>
                                  {isEvaluated ? <CheckCircle size={12} /> : <Clock size={12} />}
                                  {isEvaluated ? 'Sudah Dinilai' : 'Belum Dinilai'}
                                </span>
                              </td>

                              <td style={{ padding: '16px 8px', fontSize: '14px', textAlign: 'center', fontWeight: '800' }}>
                                {isEvaluated ? (
                                  <span style={{ color: '#10b981', background: '#ecfdf5', padding: '4px 10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                                    {gradeVal} ({gradeLetter})
                                  </span>
                                ) : (
                                  <span style={{ color: '#94a3b8' }}>-</span>
                                )}
                              </td>

                              <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenGradingModal(item)}
                                  style={{
                                    background: isEvaluated ? '#ffffff' : 'linear-gradient(135deg, #B432F2 0%, #7c3aed 100%)',
                                    color: isEvaluated ? '#B432F2' : '#ffffff',
                                    border: isEvaluated ? '1px solid #B432F2' : 'none',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: isEvaluated ? 'none' : '0 4px 12px rgba(180, 50, 242, 0.3)',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  {isEvaluated ? 'Edit Penilaian' : 'Beri Penilaian Mitra'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Modal ACC / Tolak Pendaftaran Magang */}
      {decisionModal.show && (
        <div style={{
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
          zIndex: 1200,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            animation: 'modalPop 0.25s ease'
          }}>
            <div style={{
              padding: '20px 24px',
              background: decisionModal.type === 'ACC' 
                ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
                : 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#a7f3d0' }}>
                  {decisionModal.type === 'ACC' ? 'ACC PENDAFTARAN MAGANG' : 'PENOLAKAN PENDAFTARAN MAGANG'}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0' }}>
                  {decisionModal.type === 'ACC' ? 'Terima Mahasiswa Magang' : 'Tolak Pendaftaran Magang'}
                </h3>
              </div>
              <button
                onClick={() => setDecisionModal({ show: false, item: null, type: 'ACC', catatan: '' })}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitDecision} style={{ padding: '24px' }}>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Mahasiswa Pendaftar:</span>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{decisionModal.item?.nama_mahasiswa}</span>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                  NIM: {decisionModal.item?.nim} • ID Magang: {decisionModal.item?.id_magang_fakultas || 'FIK6199364'}
                </span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  {decisionModal.type === 'ACC' ? 'Catatan & Pesan Persetujuan Mitra:' : 'Catatan / Alasan Penolakan Magang (Wajib) *:'}
                </label>
                <textarea
                  rows="4"
                  required={decisionModal.type === 'TOLAK'}
                  value={decisionModal.catatan}
                  onChange={(e) => setDecisionModal({ ...decisionModal, catatan: e.target.value })}
                  placeholder={decisionModal.type === 'ACC' ? 'Tuliskan pesan sambutan / instruksi awal...' : 'Tuliskan alasan penolakan...'}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setDecisionModal({ show: false, item: null, type: 'ACC', catatan: '' })}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    border: 'none',
                    color: '#475569',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    background: decisionModal.type === 'ACC' ? '#10b981' : '#ef4444',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: decisionModal.type === 'ACC' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  {decisionModal.type === 'ACC' ? <Check size={16} /> : <Ban size={16} />}
                  <span>{isSaving ? 'Memproses...' : decisionModal.type === 'ACC' ? 'ACC / Terima Mahasiswa' : 'Konfirmasi Tolak'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Input Penilaian Mitra */}
      {gradingModal.show && (
        <div style={{
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
          zIndex: 1200,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            animation: 'modalPop 0.25s ease'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#c084fc', letterSpacing: '0.5px' }}>
                  EVALUASI KINERJA INDUSTRI
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0 0' }}>
                  Penilaian Kinerja Mahasiswa Magang
                </h3>
              </div>
              <button
                onClick={() => setGradingModal({ show: false, item: null, nilaiAngka: '', catatan: '', sertifikatUrl: '' })}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveGrade} style={{ padding: '24px' }}>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Nama Mahasiswa:</span>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{gradingModal.item?.nama_mahasiswa}</span>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                  NIM: {gradingModal.item?.nim} • ID Magang: {gradingModal.item?.magang?.id_magang_fakultas || 'FIK6199373'}
                </span>
              </div>

              {/* Nilai Angka & Huruf */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Nilai Kinerja (0-100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={gradingModal.nilaiAngka}
                    onChange={(e) => setGradingModal({ ...gradingModal, nilaiAngka: e.target.value })}
                    placeholder="Contoh: 95"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '15px',
                      fontWeight: '700',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Konversi Nilai Huruf
                  </label>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#faf5ff',
                    border: '1.5px solid #e9d5ff',
                    fontSize: '16px',
                    fontWeight: '800',
                    color: '#B432F2',
                    textAlign: 'center'
                  }}>
                    {calculateGradeLetter(gradingModal.nilaiAngka)}
                  </div>
                </div>
              </div>

              {/* Catatan Mitra */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Catatan Evaluasi & Ulasan Kinerja Industri
                </label>
                <textarea
                  rows="3"
                  value={gradingModal.catatan}
                  onChange={(e) => setGradingModal({ ...gradingModal, catatan: e.target.value })}
                  placeholder="Contoh: Mahasiswa sangat proaktif dalam merancang arsitektur backend microservices..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* URL Sertifikat Magang Mitra */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Link / URL Sertifikat Kelulusan Magang Mitra
                </label>
                <input
                  type="url"
                  value={gradingModal.sertifikatUrl}
                  onChange={(e) => setGradingModal({ ...gradingModal, sertifikatUrl: e.target.value })}
                  placeholder="https://drive.google.com/sertifikat-magang.pdf"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setGradingModal({ show: false, item: null, nilaiAngka: '', catatan: '', sertifikatUrl: '' })}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    border: 'none',
                    color: '#475569',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #B432F2 0%, #7c3aed 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(180, 50, 242, 0.3)'
                  }}
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Penilaian Mitra'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MitraDashboard;
