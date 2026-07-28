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
  FileDown
} from 'lucide-react';
import amikomLogo from '../../assets/amikom.png';
import unikaLogo from '../../assets/unika-logo.svg';
import { 
  getMitraDashboardStatsApi, 
  getMitraMahasiswaListApi, 
  submitMitraPenilaianApi 
} from '../../services/mitraService';

const MitraDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [statsData, setStatsData] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [mitraInfo, setMitraInfo] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal Penilaian State
  const [modal, setModal] = useState({
    show: false,
    item: null,
    nilaiAngka: '',
    catatan: '',
    sertifikatUrl: ''
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

      // 2. Fetch Mahasiswa List
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

  const handleOpenGradingModal = (item) => {
    const existingScore = item.penilaian_mitra?.nilai_angka ?? '';
    const existingNotes = item.penilaian_mitra?.catatan_mitra ?? '';
    const existingCert = item.penilaian_mitra?.sertifikat_magang_url ?? `https://drive.google.com/file/d/sertifikat_${item.nim || 'magang'}.pdf`;

    setModal({
      show: true,
      item,
      nilaiAngka: existingScore !== null ? String(existingScore) : '',
      catatan: existingNotes || '',
      sertifikatUrl: existingCert
    });
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!modal.nilaiAngka || isNaN(Number(modal.nilaiAngka))) {
      alert('Masukkan Nilai Angka yang valid (0-100)');
      return;
    }

    const numVal = Number(modal.nilaiAngka);
    if (numVal < 0 || numVal > 100) {
      alert('Nilai Angka harus dalam rentang 0 hingga 100');
      return;
    }

    setIsSaving(true);
    try {
      const res = await submitMitraPenilaianApi(token, {
        id_surat_akhir: modal.item.id_surat_akhir,
        nim: modal.item.nim,
        nilai_mitra_angka: numVal,
        nilai_mitra_huruf: calculateGradeLetter(numVal),
        catatan_mitra: modal.catatan,
        sertifikat_magang_url: modal.sertifikatUrl,
      });

      if (res.success) {
        setAlertInfo({
          show: true,
          message: `Penilaian untuk ${modal.item.nama_mahasiswa} (${modal.item.nim}) berhasil disimpan! Nilai: ${numVal} (${calculateGradeLetter(numVal)}).`,
          type: 'success'
        });
        setModal({ show: false, item: null, nilaiAngka: '', catatan: '', sertifikatUrl: '' });
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

  // Client side search filter
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
            <button className="nav-item active">
              <LayoutDashboard size={18} />
              {!isSidebarCollapsed && <span>Dashboard Mitra</span>}
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
              background: '#ecfdf5',
              border: '1px solid #6ee7b7',
              color: '#065f46',
              padding: '16px 20px',
              borderRadius: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#10b981" />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{alertInfo.message}</span>
              </div>
              <button 
                onClick={() => setAlertInfo({ show: false, message: '', type: 'success' })}
                style={{ background: 'transparent', border: 'none', color: '#065f46', cursor: 'pointer', fontWeight: '700' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Welcome Section */}
          <section className="welcome-section">
            <h2 className="welcome-title">
              Portal Mitra Industri - {mitraInfo?.nama_perusahaan || currentUser?.name || 'PT GoTo Gojek Tokopedia Tbk'}
            </h2>
            <p className="welcome-desc">
              Kelola evaluasi akhir mahasiswa magang, berikan penilaian kinerja industri, dan unduh <strong>Surat Ucapan Terima Kasih resmi FIK</strong>.
            </p>
          </section>

          {/* Stats Grid */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{statsData?.total_mahasiswa_magang ?? studentsList.length} Orang</span>
                <span className="stat-label">Total Mahasiswa Magang</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <ShieldCheck size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{statsData?.total_sudah_dinilai ?? studentsList.filter(s => s.penilaian_mitra?.status === 'Sudah Dinilai Mitra').length} Selesai</span>
                <span className="stat-label">Sudah Dinilai Mitra</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{statsData?.total_belum_dinilai ?? studentsList.filter(s => s.penilaian_mitra?.status !== 'Sudah Dinilai Mitra').length} Perlu</span>
                <span className="stat-label">Menunggu Evaluasi Mitra</span>
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

          {/* Details Grid */}
          <div className="info-grid" style={{ gridTemplateColumns: '1fr' }}>
            <section className="main-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <h3 className="panel-title" style={{ margin: 0 }}>
                  <Star size={20} className="text-primary" />
                  Daftar Mahasiswa Pengaju Surat Terima Kasih FIK ({filteredStudents.length})
                </h3>

                {/* Filter & Search Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', minWidth: '240px' }}>
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
                  Memuat daftar mahasiswa magang mitra...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '16px' }}>
                  Tidak ada data mahasiswa magang yang cocok dengan pencarian / filter.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>MAHASISWA</th>
                        <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>ID MAGANG / PERIODE</th>
                        <th style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>SURAT TERIMA KASIH FIK</th>
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
                                <span style={{ fontSize: '12px', color: '#64748b' }}>NIM: {item.nim} • {item.prodi || 'Informatika'} ({item.angkatan || '2024'})</span>
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
                                  <span>Unduh Surat FIK</span>
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
                                {isEvaluated ? 'Sudah Dinilai Mitra' : 'Belum Dinilai'}
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
        </main>
      </div>

      {/* Modal Input Penilaian Mitra */}
      {modal.show && (
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
                onClick={() => setModal({ show: false, item: null, nilaiAngka: '', catatan: '', sertifikatUrl: '' })}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveGrade} style={{ padding: '24px' }}>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Nama Mahasiswa:</span>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{modal.item?.nama_mahasiswa}</span>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                  NIM: {modal.item?.nim} • ID Magang: {modal.item?.magang?.id_magang_fakultas || 'FIK6199373'}
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
                    value={modal.nilaiAngka}
                    onChange={(e) => setModal({ ...modal, nilaiAngka: e.target.value })}
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
                    {calculateGradeLetter(modal.nilaiAngka)}
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
                  value={modal.catatan}
                  onChange={(e) => setModal({ ...modal, catatan: e.target.value })}
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
                  value={modal.sertifikatUrl}
                  onChange={(e) => setModal({ ...modal, sertifikatUrl: e.target.value })}
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
                  onClick={() => setModal({ show: false, item: null, nilaiAngka: '', catatan: '', sertifikatUrl: '' })}
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
